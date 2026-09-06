export const vi = {
    common: {
        loading: 'Đang tải...',
        save: 'Lưu',
        cancel: 'Hủy',
        confirm: 'Xác nhận',
        retry: 'Thử lại',
        success: 'Thành công',
        error: 'Lỗi',
        info: 'Thông báo',
        select: 'Chọn',
        search: 'Tìm kiếm...',
        noResults: 'Không tìm thấy kết quả',
        close: 'Đóng',
    },

    errors: {
        network: 'Không thể kết nối đến máy chủ',
        server: 'Máy chủ đang gặp sự cố',
        unknown: 'Đã xảy ra lỗi. Vui lòng thử lại',
    },

    auth: {
        login: {
            title: 'Đăng nhập',
            email: 'Email',
            password: 'Mật khẩu',
            submit: 'Đăng nhập',
            success: 'Đăng nhập thành công',
            error: 'Email hoặc mật khẩu không đúng',
        },

        validation: {
            emailRequired: 'Email không được để trống',
            emailInvalid: 'Email không hợp lệ',
            passwordRequired: 'Mật khẩu không được để trống',
        },
        errors: {
            account_invalid: "Thông tin tài khoản không đúng!",
            session_expired: "Phiên làm việc đã hết hạn"
        }
    },
    product: {
        title: 'Sản phẩm',
        create: {
            title: 'Tạo sản phẩm',
        },
        edit: {
            title: 'Chỉnh sửa sản phẩm',
        },
        form: {
            name: 'Tên sản phẩm',
            namePlaceholder: 'Nhập tên sản phẩm',
            description: 'Mô tả',
            descriptionPlaceholder: 'Nhập mô tả sản phẩm',
            price: 'Giá',
            pricePlaceholder: 'Nhập giá sản phẩm',
            category: 'Danh mục',
            categoryPlaceholder: 'Chọn danh mục',
            shippingMethod: 'Phương thức vận chuyển',
            shippingMethodPlaceholder:
                'Chọn phương thức vận chuyển',
            isActive: 'Đang hoạt động',
            create: 'Tạo sản phẩm',
            update: 'Lưu thay đổi',
            submit: 'Lưu',
        },

        validation: {
            nameRequired:
                'Tên sản phẩm không được để trống',
            descriptionRequired:
                'Mô tả sản phẩm không được để trống',
            priceRequired:
                'Giá sản phẩm không được để trống',
            priceInvalid:
                'Giá sản phẩm không hợp lệ',
            pricePositive:
                'Giá sản phẩm phải lớn hơn 0',
            categoryRequired:
                'Vui lòng chọn danh mục',
            shippingMethodRequired:
                'Vui lòng chọn phương thức vận chuyển',
        },

        messages: {
            createSuccess: 'Tạo sản phẩm thành công',
            createSuccessDescription:
            'Sản phẩm đã được tạo thành công.',
            updateSuccess: 'Cập nhật sản phẩm thành công',
            updateSuccessDescription:
            'Sản phẩm đã được cập nhật thành công.',
            deleteSuccess: 'Xóa sản phẩm thành công',
            deleteSuccessDescription:
            'Sản phẩm đã được xóa thành công.',
        },

        errors: {
            loadFailed:
                'Không thể tải thông tin sản phẩm',
            createFailed:
                'Không thể tạo sản phẩm',
            updateFailed:
                'Không thể cập nhật sản phẩm',
            deleteFailed:
                'Không thể xóa sản phẩm',
        },

        actions: {
            create: 'Tạo sản phẩm',
            edit: 'Chỉnh sửa',
            delete: 'Xóa',
            view: 'Xem chi tiết',
        },
    },
    profile: {
        title: 'Tài khoản',
        name: 'Họ và tên',
        email: 'Email',
        logout: 'Đăng xuất',
        settings: 'Cài đặt',
        language: 'Ngôn ngữ',
        theme: 'Giao diện',

        languages: {
            vi: 'Tiếng Việt',
            en: 'English',
        },

        themes: {
            light: 'Sáng',
            dark: 'Tối',
            system: 'Theo hệ thống',
        },
    },

    home: {
        products: 'Sản phẩm',
        profile: 'Tài khoản',
    },
};