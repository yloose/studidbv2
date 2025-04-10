module.exports = {
	content: [
		"./app.css",
		"./app.tsx",
    	"./**/*.tsx"
	],
    theme: {
        extend: {
            colors: {
                blue: {
                    50: '#e6f1fe',
                    100: '#cce3fd',
                    200: '#99c7fb',
                    300: '#66aaf9',
                    400: '#338ef7',
                    500: '#0072f5',
                    600: '#005bc4',
                    700: '#004493',
                    800: '#002e62',
                    900: '#001731',
                },
            },
            boxShadow: {
                'neu': '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff',
                'neu-inset': 'inset 3px 3px 6px #d1d1d1, inset -3px -3px 6px #ffffff',
                'neu-pressed': 'inset 2px 2px 5px #d1d1d1, inset -2px -2px 5px #ffffff',
            },
        },
    },
    plugins: [],
} 
