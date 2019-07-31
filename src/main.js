import Vue from 'vue';
import iView from 'iview';
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';
import App from './app.vue';
import axios from 'axios';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from './libs/util';
import MyComponents from './assets/MyComponents/MyComponents';
import './assets/MyComponents/MyComponents.css';
Vue.use(MyComponents);
Vue.use(VueI18n);
Vue.use(iView);
Vue.prototype.$ajax = axios;
new Vue({
	el: '#app',
	router: router,
	store: store,
	render: h => h(App),
	mounted() {  
		// 显示打开的页面的列表
		this.$store.commit('setOpenedList');
		this.$store.commit('initCachepage');
		// 权限菜单过滤相关 在Main.vue中
		/*	this.$store.commit('updateMenulist');*/
		// iview-admin检查更新
		// util.checkUpdate(this);
		/*		var $this = this;
				var url = this.comMethods.projectPath() + this.$store.state.user.valicationUserPasswordUrl;
				this.$ajax.get(url, params: {
						ID: 12345
					})
					.then(
						function(response) {
							//					console.log(JSON.stringify(response.data));
						})
					.catch(function(error) {
						//				console.log(error);
					});*/
		/*this.$http.get(url).then(function(response) {
			console.log(JSON.stringify(response.body));
		})
		.catch(function(response) {

		});*/
	},
	created() {
		let tagsList = [];
		appRouter.map((item) => {
			if(item.children.length <= 1) {
				tagsList.push(item.children[0]);
			}
			else {
				tagsList.push(...item.children);
			}
		});
		this.$store.commit('setTagsList', tagsList);
		let $this = this;
		window.onresize = function(e) {
			$this.$store.commit('setWindowResize', {
				x: document.documentElement.clientWidth,
				y: document.documentElement.clientHeight
			});
		}
		document.onkeydown = function(e) {
			$this.$store.commit('setOnkeydown', e);
		}
		document.onkeyup = function(e) {
			$this.$store.commit('setOnkeyup', e);
		}
	}
});