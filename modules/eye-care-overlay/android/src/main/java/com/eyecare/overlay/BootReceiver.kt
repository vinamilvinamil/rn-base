package com.eyecare.overlay

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class BootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    if (intent?.action != Intent.ACTION_BOOT_COMPLETED) return
    val config = OverlayPreferences(context).get()
    if (config.enabled) {
      BreakScheduler.scheduleNext(context, config.intervalMinutes)
      Log.i("EyeCareBoot", "Next EyeCare reminder scheduled after reboot")
    }
  }
}
