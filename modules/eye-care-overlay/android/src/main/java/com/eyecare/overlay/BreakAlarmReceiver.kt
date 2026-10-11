package com.eyecare.overlay

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.content.ContextCompat

class BreakAlarmReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent?) {
    val config = OverlayPreferences(context).get()
    if (!config.enabled) return
    Log.i(
      "EyeCareScheduler",
      "BREAK ALARM FIRED at ${
        java.text.SimpleDateFormat(
          "HH:mm:ss",
          java.util.Locale.getDefault()
        ).format(java.util.Date())
      }"
    )
    val serviceIntent = Intent(context, OverlayService::class.java).setAction(OverlayService.ACTION_SHOW_BREAK)
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) ContextCompat.startForegroundService(context, serviceIntent)
      else context.startService(serviceIntent)
    } catch (e: Exception) {
      Log.e("EyeCareScheduler", "Could not start break service", e)
      BreakScheduler.scheduleNext(context, config.intervalMinutes)
    }
  }
}
