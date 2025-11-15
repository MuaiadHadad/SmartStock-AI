/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: [
        'text-emerald-400',
        'text-blue-400',
        'text-amber-400',
        'text-purple-400',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
