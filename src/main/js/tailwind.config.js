 /** @type {import("tailwindcss").Config} */
module.exports = {
	content: [
		"./app.css",
		"./app.tsx",
    	"./**/*.tsx"
	],
	theme: {
		extend: {
			fontFamily: {
				"inter": ["Inter", "sans-serif"]
			},
		},
	},

  plugins: [],
} 
