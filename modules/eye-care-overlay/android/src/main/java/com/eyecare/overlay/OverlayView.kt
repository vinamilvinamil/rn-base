
package com.eyecare.overlay

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.AnimationDrawable
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.GradientDrawable
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import java.util.Locale
import kotlin.math.abs

enum class MascotAnimation {
    BLINK,
    LOOK_UP_DOWN,
    LOOK_LEFT_RIGHT
}

/**
 * EyeCare native overlay.
 *
 * Features:
 * - Animated mascot using local PNG sprite sheets.
 * - Cycles through blink, look up/down, and look left/right.
 * - Countdown based on durationSeconds.
 * - Draggable mascot.
 * - Skip callback preserved.
 */
class OverlayView(
    private val context: Context,
    private val durationSeconds: Int,
    private val onFinished: (skipped: Boolean) -> Unit,
    private val onSnoozeTwoHours: () -> Unit
) {
    private val wm =
        context.getSystemService(Context.WINDOW_SERVICE) as WindowManager

    private val handler = Handler(Looper.getMainLooper())

    private var root: View? = null
    private var mascotImage: ImageView? = null
    private var timer: TextView? = null

    private var attached = false
    private var finished = false
    private var startMs = 0L

    private val animations =
        mutableMapOf<MascotAnimation, AnimationDrawable>()

    private var currentAnimation: AnimationDrawable? = null
    private var animationIndex = 0

    private val animationModes = listOf(
        MascotAnimation.BLINK,
        MascotAnimation.LOOK_UP_DOWN,
        MascotAnimation.LOOK_LEFT_RIGHT
    )

    private val params = WindowManager.LayoutParams(
        WindowManager.LayoutParams.WRAP_CONTENT,
        WindowManager.LayoutParams.WRAP_CONTENT,
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        },
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
        PixelFormat.TRANSLUCENT
    ).apply {
        gravity = Gravity.TOP or Gravity.END
        x = dp(16)
        y = dp(180)
    }

    private val tick = object : Runnable {
        override fun run() {
            if (!attached || finished) return

            val elapsedSeconds =
                ((System.currentTimeMillis() - startMs) / 1000L).toInt()

            val remaining =
                (durationSeconds - elapsedSeconds).coerceAtLeast(0)

            timer?.text = formatTime(remaining)

            if (remaining <= 0) {
                finish(false)
            } else {
                handler.postDelayed(this, 250L)
            }
        }
    }

    /**
     * Change animation every 6 seconds.
     */
    private val animationCycle = object : Runnable {
        override fun run() {
            if (!attached || finished) return

            animationIndex = (animationIndex + 1) % animationModes.size
            playAnimation(animationModes[animationIndex])

            handler.postDelayed(this, 6_000L)
        }
    }

    fun show() {
        if (attached || !PermissionHelper.canDrawOverlays(context)) return

        finished = false

        val panel = LinearLayout(context).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(dp(16), dp(12), dp(16), dp(12))
            background = rounded(
                Color.rgb(224, 250, 247),
                28f,
                Color.rgb(107, 222, 210)
            )
            elevation = dp(10).toFloat()
            minimumWidth = dp(210)
        }

        mascotImage = ImageView(context).apply {
            scaleType = ImageView.ScaleType.FIT_CENTER
            contentDescription = "EyeCare animated mascot"
        }

        panel.addView(
            mascotImage,
            LinearLayout.LayoutParams(dp(112), dp(112))
        )

        panel.addView(TextView(context).apply {
            text = "Take a break!"
            setTextColor(Color.rgb(16, 91, 105))
            textSize = 17f
            typeface = Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER
            setPadding(0, dp(4), 0, dp(3))
        })

        panel.addView(TextView(context).apply {
            text = "Look away and relax your eyes"
            setTextColor(Color.rgb(49, 111, 119))
            textSize = 12f
            gravity = Gravity.CENTER
            setPadding(0, dp(2), 0, dp(6))
        })

        timer = TextView(context).apply {
            text = formatTime(durationSeconds)
            setTextColor(Color.rgb(15, 83, 96))
            textSize = 25f
            typeface = Typeface.DEFAULT_BOLD
            gravity = Gravity.CENTER
            setPadding(0, dp(2), 0, dp(8))
        }
        panel.addView(timer)

        panel.addView(TextView(context).apply {
            text = "Skip"
            gravity = Gravity.CENTER
            textSize = 14f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.WHITE)
            setPadding(dp(24), dp(9), dp(24), dp(9))
            background = rounded(Color.rgb(24, 151, 143), 18f)
            isClickable = true
            isFocusable = true
            contentDescription = "Skip eye break"
            setOnClickListener {
                finish(true)
            }
        })

        // Tạo khoảng cách giữa nút Skip và nút Snooze.
        panel.addView(View(context), LinearLayout.LayoutParams(
            1,
            dp(12)
        ))

        panel.addView(TextView(context).apply {
            text = "Skip trong 2 giờ"
            gravity = Gravity.CENTER
            textSize = 13f
            typeface = Typeface.DEFAULT_BOLD
            setTextColor(Color.rgb(16, 91, 105))
            setPadding(dp(16), dp(10), dp(16), dp(10))
            background = rounded(
                Color.WHITE,
                18f,
                Color.rgb(107, 222, 210)
            )

            isClickable = true
            isFocusable = true
            contentDescription = "Snooze reminders for two hours"

            setOnClickListener {
                onSnoozeTwoHours()
                finish(true)
            }
        })

        try {
            wm.addView(panel, params)

            root = panel
            attached = true

            startMs = System.currentTimeMillis()

            // Prepare all three sprite-sheet animations.
            prepareAnimations()

            animationIndex = 0
            playAnimation(animationModes[animationIndex])

            // Drag using the mascot only, so the Skip button remains clickable.
            mascotImage?.let { enableDrag(it) }

            handler.post(tick)
            handler.postDelayed(animationCycle, 6_000L)
        } catch (e: Exception) {
            android.util.Log.e(
                "EyeCareOverlay",
                "Unable to attach overlay",
                e
            )

            clearAnimations()
            root = null
            attached = false
            onFinished(true)
        }
    }

    fun isVisible(): Boolean = attached && root != null

    /**
     * Can also be called by OverlayService to select a specific animation.
     */
    fun setAnimationMode(mode: MascotAnimation) {
        animationIndex = animationModes.indexOf(mode).coerceAtLeast(0)

        if (attached) {
            playAnimation(mode)
        }
    }

    private fun prepareAnimations() {
        clearAnimations()

        animations[MascotAnimation.BLINK] =
            createSpriteAnimation(R.drawable.sprout_blink)

        animations[MascotAnimation.LOOK_UP_DOWN] =
            createSpriteAnimation(R.drawable.sprout_eyes_up_down)

        animations[MascotAnimation.LOOK_LEFT_RIGHT] =
            createSpriteAnimation(R.drawable.sprout_eyes_left_right)
    }

    private fun playAnimation(mode: MascotAnimation) {
        val image = mascotImage ?: return
        val animation = animations[mode] ?: return

        currentAnimation?.stop()

        currentAnimation = animation
        image.setImageDrawable(animation)
        animation.start()
    }

    /**
     * Each sheet is expected to have 5 columns and 2 rows.
     * Decode without density scaling so frame coordinates stay accurate.
     */
    private fun createSpriteAnimation(
        resourceId: Int,
        frameDurationMs: Int = 600
    ): AnimationDrawable {
        val options = BitmapFactory.Options().apply {
            inScaled = false
        }

        val sheet = BitmapFactory.decodeResource(
            context.resources,
            resourceId,
            options
        ) ?: error("Cannot decode sprite sheet: $resourceId")

        val columns = 5
        val rows = 2
        val frameWidth = sheet.width / columns
        val frameHeight = sheet.height / rows

        require(frameWidth > 0 && frameHeight > 0) {
            "Invalid sprite sheet dimensions: ${sheet.width}x${sheet.height}"
        }

        val animation = AnimationDrawable().apply {
            isOneShot = false
        }

        try {
            for (row in 0 until rows) {
                for (column in 0 until columns) {
                    val left = column * frameWidth
                    val top = row * frameHeight

                    val width = if (column == columns - 1) {
                        sheet.width - left
                    } else {
                        frameWidth
                    }

                    val height = if (row == rows - 1) {
                        sheet.height - top
                    } else {
                        frameHeight
                    }

                    val frame: Bitmap = Bitmap.createBitmap(
                        sheet,
                        left,
                        top,
                        width,
                        height
                    )

                    animation.addFrame(
                        BitmapDrawable(context.resources, frame),
                        frameDurationMs
                    )
                }
            }
        } finally {
            sheet.recycle()
        }

        return animation
    }

    fun hide() {
        handler.removeCallbacks(tick)
        handler.removeCallbacks(animationCycle)

        currentAnimation?.stop()
        currentAnimation = null

        val current = root
        root = null

        if (attached && current != null) {
            try {
                wm.removeView(current)
            } catch (_: Exception) {
                // The view may already have been detached.
            }
        }

        clearAnimations()

        mascotImage = null
        timer = null
        attached = false
    }

    private fun clearAnimations() {
        animations.values.forEach { it.stop() }
        animations.clear()
        currentAnimation = null
    }

    private fun finish(skipped: Boolean) {
        if (finished) return

        finished = true
        hide()
        onFinished(skipped)
    }

    private fun enableDrag(handle: View) {
        var startX = 0
        var startY = 0
        var rawX = 0f
        var rawY = 0f
        var moved = false

        handle.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    startX = params.x
                    startY = params.y
                    rawX = event.rawX
                    rawY = event.rawY
                    moved = false
                    true
                }

                MotionEvent.ACTION_MOVE -> {
                    val dx = (event.rawX - rawX).toInt()
                    val dy = (event.rawY - rawY).toInt()

                    if (abs(dx) > dp(6) || abs(dy) > dp(6)) {
                        moved = true
                    }

                    // Overlay is anchored to TOP | END.
                    params.x = (startX - dx).coerceAtLeast(0)
                    params.y = (startY + dy).coerceAtLeast(0)

                    root?.let {
                        try {
                            wm.updateViewLayout(it, params)
                        } catch (_: Exception) {
                        }
                    }

                    true
                }

                MotionEvent.ACTION_UP -> {
                    // Consume the touch so it doesn't trigger unintended clicks.
                    true
                }

                MotionEvent.ACTION_CANCEL -> true
                else -> false
            }
        }
    }

    private fun formatTime(seconds: Int): String =
        String.format(
            Locale.getDefault(),
            "%02d:%02d",
            seconds / 60,
            seconds % 60
        )

    private fun dp(value: Int): Int =
        (value * context.resources.displayMetrics.density).toInt()

    private fun rounded(
        color: Int,
        radius: Float,
        strokeColor: Int? = null
    ) = GradientDrawable().apply {
        setColor(color)
        cornerRadius = radius * context.resources.displayMetrics.density

        if (strokeColor != null) {
            setStroke(dp(1), strokeColor)
        }
    }
}
