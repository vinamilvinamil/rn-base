package com.eyecare.overlay

import android.content.Context

class OverlayPreferences(context: Context) {

    private val prefs = context.getSharedPreferences(
        "eyecare_overlay",
        Context.MODE_PRIVATE
    )

    // Giữ lại các phương thức cũ để tương thích trong giai đoạn chuyển đổi.
    fun save(map: Map<String, Any?>) {
        save(BreakConfig.fromMap(map))
    }

    fun save(config: BreakConfig) {
        if (config.ruleId != null) {
            saveRule(config)
            return
        }

        // Cấu hình legacy: một lịch duy nhất.
        prefs.edit()
            .putBoolean("enabled", config.enabled)
            .putInt("interval_minutes", config.intervalMinutes)
            .putInt("duration_seconds", config.breakDurationSeconds)
            .putString("bubble_style", config.bubbleStyle)
            .apply()
    }

    fun get(): BreakConfig {
        return BreakConfig(
            enabled = prefs.getBoolean("enabled", false),
            intervalMinutes = prefs.getInt(
                "interval_minutes",
                20
            ).coerceIn(1, 1440),
            breakDurationSeconds = prefs.getInt(
                "duration_seconds",
                20
            ).coerceIn(5, 300),
            bubbleStyle = prefs.getString(
                "bubble_style",
                "detailed"
            ) ?: "detailed"
        )
    }

    // Lưu một lịch riêng theo ruleId.
    fun saveRule(config: BreakConfig) {
        require(!config.ruleId.isNullOrBlank()) {
            "ruleId is required to save a reminder rule"
        }

        require(config.type == "micro" || config.type == "long") {
            "type must be micro or long"
        }

        val prefix = rulePrefix(config.ruleId)

        prefs.edit()
            .putString("${prefix}id", config.ruleId)
            .putString("${prefix}type", config.type)
            .putBoolean("${prefix}enabled", config.enabled)
            .putInt(
                "${prefix}interval_minutes",
                config.intervalMinutes.coerceIn(1, 1440)
            )
            .putInt(
                "${prefix}duration_seconds",
                config.breakDurationSeconds.coerceIn(5, 300)
            )
            .putString("${prefix}bubble_style", config.bubbleStyle)
            .apply()
    }

    // Đọc một lịch theo ID.
    fun getRule(ruleId: String): BreakConfig? {
        val prefix = rulePrefix(ruleId)

        if (!prefs.contains("${prefix}id")) {
            return null
        }

        return BreakConfig(
            ruleId = prefs.getString("${prefix}id", ruleId),
            type = prefs.getString("${prefix}type", null),
            enabled = prefs.getBoolean("${prefix}enabled", false),
            intervalMinutes = prefs.getInt(
                "${prefix}interval_minutes",
                20
            ).coerceIn(1, 1440),
            breakDurationSeconds = prefs.getInt(
                "${prefix}duration_seconds",
                20
            ).coerceIn(5, 300),
            bubbleStyle = prefs.getString(
                "${prefix}bubble_style",
                "detailed"
            ) ?: "detailed"
        )
    }

    // Đọc tất cả lịch đã lưu.
    fun getAllRules(): List<BreakConfig> {
        val ruleIds = prefs.all.keys
            .filter { it.startsWith(RULE_PREFIX) && it.endsWith("_id") }
            .mapNotNull { key ->
                prefs.getString(key, null)
            }
            .distinct()

        return ruleIds.mapNotNull { ruleId ->
            getRule(ruleId)
        }
    }

    // Bật/tắt riêng một lịch.
    fun setRuleEnabled(ruleId: String, enabled: Boolean): Boolean {
        val config = getRule(ruleId) ?: return false
        saveRule(config.copy(enabled = enabled))
        return true
    }

    // Xóa một lịch.
    fun removeRule(ruleId: String) {
        val prefix = rulePrefix(ruleId)

        prefs.edit()
            .remove("${prefix}id")
            .remove("${prefix}type")
            .remove("${prefix}enabled")
            .remove("${prefix}interval_minutes")
            .remove("${prefix}duration_seconds")
            .remove("${prefix}bubble_style")
            .apply()
    }

    private fun rulePrefix(ruleId: String): String {
        // Encode ID để tránh ký tự đặc biệt làm hỏng key.
        val encodedId = android.util.Base64.encodeToString(
            ruleId.toByteArray(Charsets.UTF_8),
            android.util.Base64.URL_SAFE or
                android.util.Base64.NO_WRAP or
                android.util.Base64.NO_PADDING
        )

        return "${RULE_PREFIX}${encodedId}_"
    }

    companion object {
        private const val RULE_PREFIX = "rule_"
    }
}