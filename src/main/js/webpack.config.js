var path = require("path");

var root = path.join(__dirname, "../../../");

module.exports = (env) => {
  return {
    mode: env.development ? "development" : "production",
  	entry: path.join(root, "/src/main/js/app.tsx"),
  	output: {
  		path: path.join(root, "/build/resources/main/static/built"),
  		filename: "bundle.js",
  	},
  	module: {
  		rules: [
  			{
          test: /\.(?:js|ts|jsx|tsx)/,
  				exclude: /node_modules/,
  				use: [{
  					loader: "babel-loader",
  					options: {
              	presets: ["@babel/preset-env", ["@babel/preset-react", {"runtime": "automatic"} ], "@babel/preset-typescript"]
  					}
  				}]
  			},
  			{
  				test: /\.css$/,
  				use: [
  					{ loader: "style-loader" },
  					{ loader: "css-loader" },
  					{ loader: "postcss-loader" }
  				],
  			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i, // Regular expression to test image types
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[hash].[ext]',  // Define naming pattern and location
							outputPath: 'assets/',               // Output folder for images
						},
					},
				],
			},
  		]
  	},
  	resolve: {
      modules: [
        path.resolve(__dirname + ""),
        path.resolve(__dirname + "/node_modules"),
      ],
  		extensions: [".js", ".json", ".ts", ".tsx"],
  	},
    devtool: env.development ? "inline-source-map" : "source-map",
  	cache: true,
  };
};
