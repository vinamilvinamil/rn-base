package com.eyecare.overlay

import android.content.Context

class OverlayController(
    private val context: Context,
    private val onFinished: (skipped: Boolean) -> Unit,
    private val onSnoozeTwoHours: () -> Unit
) {
    private var overlay: OverlayView? = null

    fun showBreak(durationSeconds: Int) {
        overlay?.hide()

        overlay = OverlayView(
            context = context,
            durationSeconds = durationSeconds,
            onFinished = { skipped ->
                overlay = null
                onFinished(skipped)
            },
            onSnoozeTwoHours = {
                overlay = null
                onSnoozeTwoHours()
            }
        )

        overlay?.show()
    }

    fun isVisible(): Boolean = overlay?.isVisible() == true

    fun hide() {
        overlay?.hide()
        overlay = null
    }
}