package com.eyecare.overlay

import android.content.Context
import android.os.Build
import android.provider.Settings

object PermissionHelper {
  fun canDrawOverlays(context: Context): Boolean =
    Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(context)
}
