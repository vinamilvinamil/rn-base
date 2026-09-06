/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                'primary-pressed': 'var(--color-primary-pressed)',
                'primary-soft': 'var(--color-primary-soft)',

                background: {
                    DEFAULT: 'var(--color-background)',
                    secondary: 'var(--color-background-secondary)',
                    element: 'var(--color-background-element)',
                    selected: 'var(--color-background-selected)',
                },

                text: {
                    DEFAULT: 'var(--color-text)',
                    secondary: 'var(--color-text-secondary)',
                    tertiary: 'var(--color-text-tertiary)',
                    disabled: 'var(--color-text-disabled)',
                },

                border: {
                    DEFAULT: 'var(--color-border)',
                    strong: 'var(--color-border-strong)',
                },

                success: {
                    DEFAULT: 'var(--color-success)',
                    soft: 'var(--color-success-soft)',
                },

                warning: {
                    DEFAULT: 'var(--color-warning)',
                    soft: 'var(--color-warning-soft)',
                },

                error: {
                    DEFAULT: 'var(--color-error)',
                    soft: 'var(--color-error-soft)',
                },

                info: {
                    DEFAULT: 'var(--color-info)',
                    soft: 'var(--color-info-soft)',
                },
            },
        },
    },
    plugins: [],
};
