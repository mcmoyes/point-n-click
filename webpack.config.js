// var webpack = require('webpack');
module.exports = {
    entry: {
        entry: __dirname + '/entry.js'
    },
    output: {
        filename: 'dist/point-n-click.js',
        library: 'PointNClick',
        libraryTarget: 'this'
    },
    module: {
    	loaders: [
	    	{
	    	    test: /\.js$/,
	    	    loader: 'babel-loader',
	    	    exclude: /node_modules/,
	    	    query: {
	    	        presets: ['es2015']
	    	    }
	    	}
    	]
    },
    devtool: 'source-map'
}
