package com.eyecare.overlay

data class BreakConfig(
    val enabled: Boolean = false,
    val intervalMinutes: Int = 20,
    val breakDurationSeconds: Int = 20,
    val bubbleStyle: String = "detailed",
    val ruleId: String? = null,
    val type: String? = null
) {
    companion object {
        fun fromMap(map: Map<String, Any?>) = BreakConfig(
            enabled = map["enabled"] as? Boolean ?: true,
            intervalMinutes = (
                (map["intervalMinutes"] as? Number)?.toInt() ?: 20
            ).coerceIn(1, 1440),
            breakDurationSeconds = (
                (map["breakDurationSeconds"] as? Number)?.toInt() ?: 20
            ).coerceIn(5, 300),
            bubbleStyle = map["bubbleStyle"] as? String ?: "detailed",
            ruleId = map["ruleId"] as? String,
            type = (map["type"] as? String)
                ?.takeIf { it == "micro" || it == "long" }
        )
    }
}