
export const en = {
    common: {
        success: 'Success',
        error: 'Error',
        info: 'Information',
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        retry: 'Retry',
        select: 'Select',
        search: 'Search...',
        noResults: 'No results found',
        close: 'Close',
    },

    errors: {
        network: 'Unable to connect to the server',
        server: 'The server is currently unavailable',
        unknown: 'Something went wrong. Please try again',
    },

    auth: {
        login: {
            title: 'Login',
            email: 'Email',
            password: 'Password',
            submit: 'Login',
            success: 'Login successful',
            error: 'Invalid email or password',
        },

        validation: {
            emailRequired: 'Email is required',
            emailInvalid: 'Invalid email',
            passwordRequired: 'Password is required',
        },

        errors: {
            account_invalid: 'Invalid account information',
            session_expired: 'Your session has expired',
        },
    },

    product: {
        title: 'Products',

        create: {
            title: 'Create Product',
        },

        edit: {
            title: 'Edit Product',
        },

        form: {
            name: 'Product name',
            namePlaceholder: 'Enter product name',
            description: 'Description',
            descriptionPlaceholder: 'Enter product description',
            price: 'Price',
            pricePlaceholder: 'Enter product price',
            category: 'Category',
            categoryPlaceholder: 'Select category',
            shippingMethod: 'Shipping method',
            shippingMethodPlaceholder: 'Select shipping method',
            isActive: 'Active',
            create: 'Create Product',
            update: 'Save Changes',
            submit: 'Save',
        },

        validation: {
            nameRequired: 'Product name is required',
            descriptionRequired: 'Product description is required',
            priceRequired: 'Product price is required',
            priceInvalid: 'Invalid product price',
            pricePositive: 'Product price must be greater than 0',
            categoryRequired: 'Please select a category',
            shippingMethodRequired: 'Please select a shipping method',
        },

        messages: {
            createSuccess: 'Product created successfully',
            createSuccessDescription:
            'The product has been created successfully.',
            updateSuccess: 'Product updated successfully',
            updateSuccessDescription:
            'The product has been updated successfully.',
            deleteSuccess: 'Product deleted successfully',
            deleteSuccessDescription:
            'The product has been deleted successfully.',
        },

        errors: {
            loadFailed: 'Unable to load product information',
            createFailed: 'Unable to create product',
            updateFailed: 'Unable to update product',
            deleteFailed: 'Unable to delete product',
        },

        actions: {
            create: 'Create Product',
            edit: 'Edit',
            delete: 'Delete',
            view: 'View Details',
        },
    },

    profile: {
        title: 'Profile',
        name: 'Full name',
        email: 'Email',
        logout: 'Log out',
        settings: 'Settings',
        language: 'Language',
        theme: 'Theme',

        languages: {
            vi: 'Vietnamese',
            en: 'English',
        },

        themes: {
            light: 'Light',
            dark: 'Dark',
            system: 'System',
        },
    },

    home: {
        products: 'Products',
        profile: 'Profile',
    },
};