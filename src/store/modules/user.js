import Cookies from 'js-cookie';
const user = {
	state: {
		valicationUserPasswordUrl: "/json/mis_valicationUserPassword", 
	},
	mutations: {
		logout(state, vm) {
			let lastUser= Cookies.get("user")
			Cookies.remove('user');
			
			Cookies.remove('password');
			Cookies.remove('access');
			// 恢复默认样式
			let themeLink = document.querySelector(
				'link[name="theme"]');
			themeLink.setAttribute('href', '');
			// 清空打开的页面等数据，但是保存主题数据
			let theme = '';
			if(localStorage.theme) {
				theme = localStorage.theme;
			}
			localStorage.clear();
			localStorage.lastUser =lastUser; 
			if(theme) {
				localStorage.theme = theme;
			}
		} 
	}
};
export default user;