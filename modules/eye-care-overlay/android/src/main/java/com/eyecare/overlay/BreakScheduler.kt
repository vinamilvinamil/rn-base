package com.eyecare.overlay

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

object BreakScheduler {
  const val ACTION_BREAK_DUE = "com.eyecare.overlay.ACTION_BREAK_DUE"
  private const val REQUEST_CODE = 7201

  private fun pendingIntent(context: Context): PendingIntent {
    val intent = Intent(context, BreakAlarmReceiver::class.java).setAction(ACTION_BREAK_DUE)
    val flags = PendingIntent.FLAG_UPDATE_CURRENT or
      (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
    return PendingIntent.getBroadcast(context, REQUEST_CODE, intent, flags)
  }

  fun scheduleNext(context: Context, intervalMinutes: Int) {
    val alarm = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val at = System.currentTimeMillis() + intervalMinutes.coerceIn(1, 1440) * 60_000L
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      alarm.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pendingIntent(context))
    } else {
      alarm.set(AlarmManager.RTC_WAKEUP, at, pendingIntent(context))
    }
    Log.i("EyeCareScheduler", "Next break scheduled in $intervalMinutes minute(s)")
  }

  fun scheduleAfterMillis(context: Context, delayMs: Long) {
    val alarm = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    val safeDelay = delayMs.coerceAtLeast(1_000L)
    val at = System.currentTimeMillis() + safeDelay

    Log.i(
      "EyeCareScheduler",
      "Scheduling alarm | delay=${safeDelay / 1000}s | " +
        "expectedAt=${
          java.text.SimpleDateFormat(
            "HH:mm:ss",
            java.util.Locale.getDefault()
          ).format(java.util.Date(at))
        }"
    )

    val operation = pendingIntent(context)

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      alarm.setAndAllowWhileIdle(
        AlarmManager.RTC_WAKEUP,
        at,
        operation
      )
    } else {
      alarm.set(AlarmManager.RTC_WAKEUP, at, operation)
    }
  }

  fun cancel(context: Context) {
    val alarm = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    alarm.cancel(pendingIntent(context))
  }
}
