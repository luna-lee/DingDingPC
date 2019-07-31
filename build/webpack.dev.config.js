const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
	const buf = 'export default "development";';
	fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {

	devtool: '#source-map',
	output: {
		publicPath: '/dist/',
		filename: '[name].js',
		chunkFilename: '[name].chunk.js'
	},
	plugins: [
		new ExtractTextPlugin({
			filename: '[name].css',
			allChunks: true
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: ['vender-exten', 'vender-base'],
			minChunks: Infinity
		}),
		new HtmlWebpackPlugin({
			title: 'MIS' + package.version,
			filename: '../index.html',
			inject: false
		}),
		new CopyWebpackPlugin([{
				from: 'src/views/framework/main-components/theme-switch/theme'
			},
			{
				from: 'src/views/framework/my-components/text-editor/tinymce'
			}
		], {
			ignore: [
				'text-editor.vue'
			]
		})
	],
	//设置跨域代理
	devServer: {
		//如果为 true ，页面出错不会弹出 404 页面
		historyApiFallback: true,
		/**热模块更新作用。即修改或模块后，保存会自动更新，页面不用刷新呈现最新的效果。
		这不是和 webpack.HotModuleReplacementPlugin （HMR） 这个插件不是一样功能吗？是的，
		不过请注意了，HMR 这个插件是真正实现热模块更新的。
		而 devServer 里配置了 hot: true ,
		webpack会自动添加 HMR 插件。所以模块热更新最终还是 HMR 这个插件起的作用*/
		hot: true,
		inline: true,
		//如果为 true ，开启虚拟服务器时，为你的代码进行压缩。加快开发流程和优化的作用。
		//		compress: true,
		stats: {
			colors: true
		},
		proxy: {
			'/apis': { 
				target: 'http://localhost:8088/ntstruts', // 接口域名
				changeOrigin: true, //是否跨域
				pathRewrite: {
					'^/apis': '' //需要rewrite重写的,
				}
			}
		},
		//写主机名的。默认 localhost
//		host: '192.168.1.110',
		//端口号。默认 8080
		port: 8089,
		//true，则自动打开浏览器。
		//		autoOpenBrowser: true,
		/**如果为 true ，在浏览器上全屏显示编译的errors或warnings。默认 false （关闭）
		如果你只想看 error ，不想看 warning。*/
		//		errorOverlay: true
	}
});