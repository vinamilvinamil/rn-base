
package com.eyecare.overlay

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.os.SystemClock
import android.util.Log
import androidx.core.content.ContextCompat
import android.os.Handler
import android.os.Looper

class OverlayService : Service() {

    private val timerHandler = Handler(Looper.getMainLooper())

    private var controller: OverlayController? = null
    private var breakInProgress = false
    private var activeRuleId: String? = null
    private var screenActive = false
    private var receiverRegistered = false

    private var snoozeRunnable: Runnable? = null

    private fun snoozeUntilMs(): Long =
        usagePrefs.getLong(KEY_SNOOZE_UNTIL, 0L)

    private fun isSnoozed(): Boolean =
        System.currentTimeMillis() < snoozeUntilMs()

    // Các rule đang bật, được đánh chỉ mục bằng ruleId.
    private val rules = mutableMapOf<String, BreakConfig>()

    // Thời gian sử dụng tích lũy của từng rule.
    private val accumulatedUsage = mutableMapOf<String, Long>()

    // Thời điểm bắt đầu phiên sử dụng hiện tại của từng rule.
    private val usageStartedAt = mutableMapOf<String, Long>()

    // Handler timer riêng cho từng rule.
    private val ruleTimers = mutableMapOf<String, Runnable>()

    // Chỉ hiển thị một bubble tại một thời điểm.
    private val pendingBreaks = mutableListOf<String>()

    private val usagePrefs by lazy {
        getSharedPreferences(USAGE_PREFS, Context.MODE_PRIVATE)
    }

    private val screenReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            when (intent.action) {
                Intent.ACTION_SCREEN_OFF -> {
                    Log.i(TAG, "Screen off: pause all rule timers")

                    pauseAllUsage()
                    cancelAllTimers()
                    BreakScheduler.cancel(this@OverlayService)

                    updateNotification("EyeCare paused · screen off")
                }

                Intent.ACTION_SCREEN_ON,
                Intent.ACTION_USER_PRESENT -> {
                    if (!isScreenActive()) return

                    Log.i(TAG, "Screen active: resume all rule timers")

                    screenActive = true
                    resumeAllUsage()
                    scheduleAllRules()

                    if (!breakInProgress) {
                        processPendingBreaks()
                    }

                    updateNotification(
                        "EyeCare active · tracking screen usage"
                    )
                }
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        isRunning = true

        createNotificationChannel()
        startForeground(
            NOTIFICATION_ID,
            buildNotification("EyeCare protection active")
        )

        controller = OverlayController(
            context = this,
            onFinished = { skipped ->
                onBreakFinished(skipped)
            },
            onSnoozeTwoHours = {
                snoozeBreaksForTwoHours()
            }
        )

        registerScreenReceiver()

        screenActive = isScreenActive()

        syncRules()

        Log.i(
            TAG,
            "Service created | active=$screenActive | rules=${rules.size}"
        )
    }

    override fun onStartCommand(
        intent: Intent?,
        flags: Int,
        startId: Int
    ): Int {
        Log.i(TAG, "onStartCommand: action=${intent?.action}")

        when (intent?.action) {
            ACTION_ENABLE -> {
                resetSnooze()
                syncRules()
            }

            ACTION_SHOW_BREAK -> {
                val ruleId = intent.getStringExtra(EXTRA_RULE_ID)

                if (!isScreenActive()) {
                    pauseAllUsage()
                    cancelAllTimers()
                    return START_STICKY
                }

                screenActive = true
                resumeAllUsage()

                if (ruleId != null) {
                    handleRuleDue(ruleId)
                } else {
                    // Tương thích với alarm cũ chưa truyền ruleId.
                    rules.keys.toList().forEach { id ->
                        handleRuleDue(id)
                    }
                }
            }

            ACTION_STOP -> {
                stopProtection()
            }

            else -> {
                syncRules()
            }
        }

        return START_STICKY
    }

    private fun resetSnooze() {
        usagePrefs.edit()
            .remove(KEY_SNOOZE_UNTIL)
            .apply()

        snoozeRunnable?.let { timerHandler.removeCallbacks(it) }
        snoozeRunnable = null

        Log.i(TAG, "Snooze reset")
    }

    /**
     * Đọc các rule đã bật từ OverlayPreferences.
     * Mỗi rule giữ trạng thái và timer độc lập.
     */
    private fun syncRules() {
        val preferences = OverlayPreferences(this)
        val allSavedRules = preferences.getAllRules()

        val enabledRules = allSavedRules
            .filter { it.enabled && !it.ruleId.isNullOrBlank() }
            .associateBy { it.ruleId!! }

        rules.clear()
        rules.putAll(enabledRules)

        // Tương thích với cấu hình cũ chưa có ruleId.
        // Chỉ dùng khi chưa có bất kỳ rule nào được lưu.
        if (allSavedRules.isEmpty()) {
            val legacy = preferences.get()

            if (legacy.enabled) {
                val legacyRule = legacy.copy(
                    enabled = true,
                    ruleId = LEGACY_RULE_ID,
                    type = "micro"
                )
                rules[LEGACY_RULE_ID] = legacyRule
            }
        }

        // Những rule không còn bật phải dừng đếm thời gian.
        usageStartedAt.keys.toList().forEach { id ->
            if (id !in rules) {
                updateUsage(id)
                usageStartedAt.remove(id)
                cancelRuleTimer(id)
                pendingBreaks.removeAll { it == id }
            }
        }

        // Đọc thời gian tích lũy riêng của mỗi rule.
        rules.keys.forEach { id ->
            if (!accumulatedUsage.containsKey(id)) {
                accumulatedUsage[id] = usagePrefs.getLong(
                    usageKey(id),
                    0L
                )
            }
        }

        // Nếu không còn lịch nào bật thì dừng service.
        if (rules.isEmpty()) {
            stopProtection()
            return
        }

        screenActive = isScreenActive()

        if (isSnoozed()) {
            scheduleSnoozeExpiry(snoozeUntilMs())
        }

        if (screenActive) {
            resumeAllUsage()
            scheduleAllRules()
        } else {
            pauseAllUsage()
            cancelAllTimers()
        }

        updateNotification(
            "EyeCare active · ${rules.size} reminder rule(s)"
        )

        Log.i(
            TAG,
            "Rules synced: " +
                rules.values.joinToString {
                    "${it.type}:${it.ruleId}=${it.intervalMinutes}min"
                }
        )
    }

    private fun registerScreenReceiver() {
        if (receiverRegistered) return

        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_SCREEN_OFF)
            addAction(Intent.ACTION_SCREEN_ON)
            addAction(Intent.ACTION_USER_PRESENT)
        }

        ContextCompat.registerReceiver(
            this,
            screenReceiver,
            filter,
            ContextCompat.RECEIVER_NOT_EXPORTED
        )

        receiverRegistered = true
    }

    /**
     * isInteractive vẫn true khi màn hình khóa còn sáng.
     * Không dùng KeyguardManager để loại màn hình khóa.
     */
    private fun isScreenActive(): Boolean {
        val powerManager =
            getSystemService(POWER_SERVICE) as PowerManager

        return powerManager.isInteractive
    }

    private fun resumeAllUsage() {
        if (!isScreenActive()) {
            screenActive = false
            return
        }

        screenActive = true

        rules.keys.forEach { id ->
            startUsageSession(id)
        }
    }

    private fun pauseAllUsage() {
        usageStartedAt.keys.toList().forEach { id ->
            updateUsage(id)
            usageStartedAt.remove(id)
        }

        screenActive = false
    }

    private fun startUsageSession(ruleId: String) {
        if (ruleId !in rules) return
        if (usageStartedAt.containsKey(ruleId)) return

        usageStartedAt[ruleId] = SystemClock.elapsedRealtime()

        Log.i(TAG, "Usage session started | ruleId=$ruleId")
    }

    /**
     * Cộng thời gian cho một rule, không ảnh hưởng rule khác.
     * Sau khi cập nhật, mốc bắt đầu được đặt lại để tiếp tục đếm.
     */
    private fun updateUsage(ruleId: String) {
        val startedAt = usageStartedAt[ruleId] ?: return
        val now = SystemClock.elapsedRealtime()

        val elapsed = (now - startedAt).coerceAtLeast(0L)
        val total = (accumulatedUsage[ruleId] ?: 0L) + elapsed

        accumulatedUsage[ruleId] = total
        usageStartedAt[ruleId] = now

        usagePrefs.edit()
            .putLong(usageKey(ruleId), total)
            .apply()
    }

    private fun resetUsage(ruleId: String) {
        accumulatedUsage[ruleId] = 0L

        usagePrefs.edit()
            .putLong(usageKey(ruleId), 0L)
            .apply()

        if (screenActive && ruleId in rules) {
            usageStartedAt[ruleId] = SystemClock.elapsedRealtime()
        } else {
            usageStartedAt.remove(ruleId)
        }
    }

    private fun scheduleAllRules() {
        Log.i(
            TAG,
            "DEBUG scheduleAllRules | " +
                "snoozed=${isSnoozed()} | " +
                "screenActive=$screenActive | " +
                "interactive=${isScreenActive()} | " +
                "rules=${rules.size}"
        )
        if (isSnoozed()) {
            cancelAllTimers()
            Log.i(TAG, "DEBUG: timers cancelled because snoozed")
            return
        }

        if (!screenActive || !isScreenActive()) {
            pauseAllUsage()
            cancelAllTimers()
            return
        }

        rules.keys.toList().forEach { id ->
            if (id == activeRuleId || id in pendingBreaks) {
                cancelRuleTimer(id)
            } else {
                scheduleRule(id)
            }
        }
    }

    private fun scheduleRule(ruleId: String) {
        val config = rules[ruleId] ?: return

        if (isSnoozed()) return
        if (!screenActive || !isScreenActive()) return
        if (ruleId == activeRuleId || ruleId in pendingBreaks) return

        startUsageSession(ruleId)
        updateUsage(ruleId)

        val intervalMs =
            config.intervalMinutes.coerceIn(1, 1440) * 60_000L

        val usedMs = accumulatedUsage[ruleId] ?: 0L
        val remainingMs = (intervalMs - usedMs).coerceAtLeast(0L)

        Log.i(
            TAG,
            "BREAK TIMER | type=${config.type} | " +
                "ruleId=$ruleId | " +
                "interval=${config.intervalMinutes}min | " +
                "used=${usedMs / 1000}s | " +
                "remaining=${remainingMs / 1000}s"
        )

        if (remainingMs <= 0L) {
            handleRuleDue(ruleId)
            return
        }

        cancelRuleTimer(ruleId)

        val runnable = Runnable {
            ruleTimers.remove(ruleId)
            handleRuleDue(ruleId)
        }

        ruleTimers[ruleId] = runnable
        timerHandler.postDelayed(runnable, remainingMs)
    }

    private fun cancelRuleTimer(ruleId: String) {
        ruleTimers.remove(ruleId)?.let { runnable ->
            timerHandler.removeCallbacks(runnable)
        }
    }

    private fun cancelAllTimers() {
        ruleTimers.keys.toList().forEach { id ->
            cancelRuleTimer(id)
        }
    }

    /**
     * Xác minh thời gian đã đủ trước khi đưa rule vào hàng chờ.
     * Alarm cũ hoặc timer chạy sớm sẽ không làm hiện bubble sai lúc.
     */
    private fun handleRuleDue(ruleId: String) {
        if (isSnoozed()) return

        val config = rules[ruleId] ?: return

        if (!config.enabled || !screenActive || !isScreenActive()) {
            return
        }

        updateUsage(ruleId)

        val intervalMs =
            config.intervalMinutes.coerceIn(1, 1440) * 60_000L

        val usedMs = accumulatedUsage[ruleId] ?: 0L
        val remainingMs = intervalMs - usedMs

        if (remainingMs > 0L) {
            scheduleRule(ruleId)
            return
        }

        if (breakInProgress) {
            if (ruleId != activeRuleId && ruleId !in pendingBreaks) {
                pendingBreaks.add(ruleId)
                Log.i(TAG, "Break queued | ruleId=$ruleId")
            }
            return
        }

        showRuleBreak(ruleId)
    }

    private fun showRuleBreak(ruleId: String) {
        val config = rules[ruleId] ?: return

        if (!screenActive || !isScreenActive()) return
        if (breakInProgress) {
            if (ruleId !in pendingBreaks) pendingBreaks.add(ruleId)
            return
        }

        cancelRuleTimer(ruleId)

        if (!PermissionHelper.canDrawOverlays(this)) {
            Log.e(TAG, "Overlay permission missing | ruleId=$ruleId")

            // Thử lại sau 30 giây, không reset thời gian tích lũy.
            scheduleRuleTimerWithDelay(ruleId, 30_000L)
            return
        }

        breakInProgress = true
        activeRuleId = ruleId

        Log.i(
            TAG,
            "Showing break | type=${config.type} | " +
                "ruleId=$ruleId | duration=${config.breakDurationSeconds}s"
        )

        try {
            controller?.showBreak(config.breakDurationSeconds)
            updateNotification(
                "${config.type ?: "Eye"} break in progress"
            )

            if (controller?.isVisible() != true) {
                Log.e(TAG, "Bubble is not visible | ruleId=$ruleId")

                breakInProgress = false
                activeRuleId = null
                scheduleRuleTimerWithDelay(ruleId, 30_000L)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Unable to show break | ruleId=$ruleId", e)

            breakInProgress = false
            activeRuleId = null
            scheduleRuleTimerWithDelay(ruleId, 30_000L)
        }
    }

    private fun scheduleRuleTimerWithDelay(
        ruleId: String,
        delayMs: Long
    ) {
        cancelRuleTimer(ruleId)

        if (!screenActive || ruleId !in rules) return

        val runnable = Runnable {
            ruleTimers.remove(ruleId)
            handleRuleDue(ruleId)
        }

        ruleTimers[ruleId] = runnable
        timerHandler.postDelayed(runnable, delayMs)
    }

    private fun processPendingBreaks() {
        if (isSnoozed()) return
        if (breakInProgress || !screenActive || !isScreenActive()) return

        while (pendingBreaks.isNotEmpty()) {
            val nextId = pendingBreaks.removeAt(0)

            if (nextId !in rules) continue

            val config = rules[nextId] ?: continue
            val intervalMs =
                config.intervalMinutes.coerceIn(1, 1440) * 60_000L

            updateUsage(nextId)

            if ((accumulatedUsage[nextId] ?: 0L) >= intervalMs) {
                showRuleBreak(nextId)
                return
            }

            scheduleRule(nextId)
        }
    }

    /**
     * Callback này được gọi khi bubble hoàn thành hoặc người dùng Skip.
     * Chỉ reset chu kỳ của rule đang hiển thị.
     */
    private fun onBreakFinished(skipped: Boolean) {
        val finishedRuleId = activeRuleId

        breakInProgress = false
        activeRuleId = null
        controller?.hide()

        if (finishedRuleId != null) {
            resetUsage(finishedRuleId)

            Log.i(
                TAG,
                "Break ${if (skipped) "skipped" else "completed"} | " +
                    "ruleId=$finishedRuleId"
            )
        }

        if (rules.isEmpty()) {
            stopProtection()
            return
        }

        if (isScreenActive()) {
            screenActive = true
            resumeAllUsage()

            processPendingBreaks()

            if (!breakInProgress) {
                scheduleAllRules()
            }
        } else {
            pauseAllUsage()
            cancelAllTimers()
        }

        updateNotification(
            if (skipped) {
                "Break skipped · next usage cycle started"
            } else {
                "Break completed · next usage cycle started"
            }
        )
    }

    private fun snoozeBreaksForTwoHours() {
        val until = System.currentTimeMillis() + SNOOZE_DURATION_MS

        usagePrefs.edit()
            .putLong(KEY_SNOOZE_UNTIL, until)
            .apply()

        breakInProgress = false
        activeRuleId = null
        pendingBreaks.clear()
        controller?.hide()

        // Hủy timer của mọi rule và alarm cũ trong thời gian snooze.
        cancelAllTimers()
        BreakScheduler.cancel(this)

        scheduleSnoozeExpiry(until)

        updateNotification("EyeCare reminders snoozed for 2 hours")

        Log.i(TAG, "Reminders snoozed until $until")
    }

    private fun scheduleSnoozeExpiry(until: Long) {
        snoozeRunnable?.let(timerHandler::removeCallbacks)

        snoozeRunnable = Runnable {
            val remaining = until - System.currentTimeMillis()

            if (remaining > 0L) {
                scheduleSnoozeExpiry(until)
                return@Runnable
            }

            usagePrefs.edit()
                .remove(KEY_SNOOZE_UNTIL)
                .apply()

            snoozeRunnable = null

            Log.i(TAG, "Snooze expired")

            if (screenActive && isScreenActive()) {
                screenActive = true
                resumeAllUsage()
                scheduleAllRules()
                if (!breakInProgress) {
                    processPendingBreaks()
                }
                updateNotification("EyeCare reminders resumed")
            }
        }

        timerHandler.postDelayed(
            snoozeRunnable!!,
            (until - System.currentTimeMillis()).coerceAtLeast(0L)
        )
    }

    private fun persistUsage(ruleId: String) {
        usagePrefs.edit()
            .putLong(
                usageKey(ruleId),
                accumulatedUsage[ruleId] ?: 0L
            )
            .apply()
    }

    private fun stopProtection() {
        cancelAllTimers()
        BreakScheduler.cancel(this)

        pendingBreaks.clear()
        controller?.hide()

        breakInProgress = false
        activeRuleId = null

        usageStartedAt.clear()
        screenActive = false

        rules.keys.forEach { id ->
            accumulatedUsage[id] = 0L
            persistUsage(id)
        }

        rules.clear()
        accumulatedUsage.clear()

        // Tắt cấu hình legacy nếu có.
        val preferences = OverlayPreferences(this)
        preferences.save(preferences.get().copy(enabled = false))

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE)
        } else {
            @Suppress("DEPRECATION")
            stopForeground(true)
        }

        stopSelf()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "EyeCare reminders",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description =
                    "Ongoing notification for EyeCare break reminders"
            }

            getSystemService(NotificationManager::class.java)
                .createNotificationChannel(channel)
        }
    }

    private fun buildNotification(text: String): Notification {
        val builder =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Notification.Builder(this, CHANNEL_ID)
            } else {
                @Suppress("DEPRECATION")
                Notification.Builder(this)
            }

        return builder
            .setSmallIcon(android.R.drawable.ic_menu_view)
            .setContentTitle("EyeCare")
            .setContentText(text)
            .setOngoing(true)
            .build()
    }

    private fun updateNotification(text: String) {
        val manager =
            getSystemService(NOTIFICATION_SERVICE) as NotificationManager

        manager.notify(NOTIFICATION_ID, buildNotification(text))
    }

    override fun onDestroy() {
        cancelAllTimers()
        snoozeRunnable?.let(timerHandler::removeCallbacks)
        snoozeRunnable = null

        if (receiverRegistered) {
            unregisterReceiver(screenReceiver)
            receiverRegistered = false
        }

        controller?.hide()
        controller = null
        isRunning = false

        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun usageKey(ruleId: String): String =
        "accumulated_usage_ms_$ruleId"

    companion object {
        const val ACTION_ENABLE =
            "com.eyecare.overlay.ACTION_ENABLE"

        const val ACTION_SHOW_BREAK =
            "com.eyecare.overlay.ACTION_SHOW_BREAK"

        const val ACTION_STOP =
            "com.eyecare.overlay.ACTION_STOP"

        const val EXTRA_RULE_ID = "ruleId"

        private const val LEGACY_RULE_ID = "legacy"

        @Volatile
        var isRunning = false
            private set

        private const val CHANNEL_ID = "eyecare_reminders"
        private const val NOTIFICATION_ID = 7202
        private const val TAG = "EyeCareService"
        private const val USAGE_PREFS = "eyecare_usage_timer"
        private const val KEY_SNOOZE_UNTIL = "snooze_until_ms"
        private const val SNOOZE_DURATION_MS = 2 * 60 * 60 * 1000L
    }
}
