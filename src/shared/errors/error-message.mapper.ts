export function toUserMessage(error: unknown) { return error instanceof Error ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại.'; }
