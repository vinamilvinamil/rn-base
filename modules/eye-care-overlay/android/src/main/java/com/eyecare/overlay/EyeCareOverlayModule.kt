package com.eyecare.overlay

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class EyeCareOverlayModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("EyeCareOverlay")

    AsyncFunction("canDrawOverlays") {
      val context = appContext.reactContext ?: return@AsyncFunction false
      PermissionHelper.canDrawOverlays(context)
    }

    AsyncFunction("openOverlaySettings") {
      val context = appContext.reactContext ?: throw Exception("React context unavailable")
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
        val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
          .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
      }
    }

    AsyncFunction("startOverlay") { rawConfig: Map<String, Any?> ->
    val context = appContext.reactContext
        ?: throw Exception("React context unavailable")

    if (!PermissionHelper.canDrawOverlays(context)) {
        throw Exception("Overlay permission not granted")
    }

    val config = BreakConfig.fromMap(rawConfig)
        .copy(enabled = true)

    val preferences = OverlayPreferences(context)

    if (config.ruleId != null) {
        preferences.saveRule(config)
    } else {
        preferences.save(config)
    }

    launchService(context, OverlayService.ACTION_ENABLE)
}

    AsyncFunction("updateOverlay") { rawConfig: Map<String, Any?> ->
    val context = appContext.reactContext
        ?: throw Exception("React context unavailable")

    val config = BreakConfig.fromMap(rawConfig)
    val preferences = OverlayPreferences(context)

    if (config.ruleId != null) {
        // Cập nhật riêng Micro break hoặc Long break.
        if (config.enabled &&
            !PermissionHelper.canDrawOverlays(context)
        ) {
            throw Exception("Overlay permission not granted")
        }

        preferences.saveRule(config)

        // Service cần đọc lại danh sách rule sau khi cập nhật.
        launchService(context, OverlayService.ACTION_ENABLE)
    } else {
        // Tương thích với cấu hình legacy chưa có ruleId.
        preferences.save(config)

        if (config.enabled) {
            if (!PermissionHelper.canDrawOverlays(context)) {
                throw Exception("Overlay permission not granted")
            }

            launchService(context, OverlayService.ACTION_ENABLE)
        } else {
            BreakScheduler.cancel(context)
            launchService(context, OverlayService.ACTION_STOP)
        }
    }
}

AsyncFunction("stopOverlay") { rawConfig: Map<String, Any?> ->
    val context = appContext.reactContext
        ?: throw Exception("React context unavailable")

    val preferences = OverlayPreferences(context)
    val ruleId = rawConfig["ruleId"] as? String

    if (!ruleId.isNullOrBlank()) {
        // Chỉ tắt rule được yêu cầu.
        val updated = preferences.setRuleEnabled(
            ruleId = ruleId,
            enabled = false
        )

        if (!updated) {
            throw Exception("Reminder rule not found: $ruleId")
        }

        // Yêu cầu service tính lại các rule còn bật.
        launchService(context, OverlayService.ACTION_ENABLE)
    } else {
        // Legacy: tắt cấu hình chung.
        preferences.save(
            preferences.get().copy(enabled = false)
        )

        BreakScheduler.cancel(context)
        launchService(context, OverlayService.ACTION_STOP)
    }
}

AsyncFunction("getOverlayStatus") {
    val context = appContext.reactContext
        ?: throw Exception("React context unavailable")

    val preferences = OverlayPreferences(context)
    val enabledRules = preferences.getAllRules()
        .filter { it.enabled }

    mapOf(
        "running" to OverlayService.isRunning,
        "permissionGranted" to PermissionHelper.canDrawOverlays(context),
        "enabled" to (
            enabledRules.isNotEmpty() || preferences.get().enabled
        ),
        "enabledRules" to enabledRules.map { rule ->
            mapOf(
                "ruleId" to rule.ruleId,
                "type" to rule.type,
                "enabled" to rule.enabled,
                "intervalMinutes" to rule.intervalMinutes,
                "breakDurationSeconds" to rule.breakDurationSeconds,
                "bubbleStyle" to rule.bubbleStyle
            )
        }
    )
}
  }

  private fun launchService(context: Context, action: String) {
    val intent = Intent(context, OverlayService::class.java).setAction(action)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) ContextCompat.startForegroundService(context, intent)
    else context.startService(intent)
  }
}
