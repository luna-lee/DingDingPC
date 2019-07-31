import env from '../../build/env';
import semver from 'semver';
import packjson from '../../package.json';
/**对象函数*/
let util = {};
/**页面标题,如果路由所打开的页面有标题则显示相应的标题，若没有则显示iView admin*/
util.title = function(title) {
	title = title || '管理信息系统';
	window.document.title = title;
};
/**判断数组arr 是否 是数组targetArr的子数组，返回true/false*/
util.inOf = function(arr, targetArr) {
	let res = true;
	arr.forEach(item => {
		if(targetArr.indexOf(item) < 0) {
			res = false;
		}
	});
	return res;
};
/**判断元素为ele是否在 数组targetArr中，返回true/false*/
util.oneOf = function(ele, targetArr) {
	if(targetArr.indexOf(ele) >= 0) {
		return true;
	}
	else {
		return false;
	}
};
/* 从路由中筛选所有地址中拥有access这一属性的路由,将其值与管理员给出的权限值或权限值数组做匹配,
 * 若等于或包含于管理员给出权限值或权限值数组,则返回true/false
 * itAccess 对应每个路由对象的权限值，
 * currentAccess 对象当前用户拥有的权限值 
 * 用于侧边栏显示，true为显示，false为隐藏
 * */
util.showThisRoute = function(itAccess, currentAccess) {
	if(currentAccess) {
		try {
			currentAccess = JSON.parse(currentAccess)
		}
		catch(e) {}
		if(typeof currentAccess === 'object' && Array.isArray(currentAccess)) {
			if(!Array.isArray(itAccess)) return util.oneOf(itAccess, currentAccess);
			else return util.inOf(itAccess, currentAccess);
		}
		else {
			console.error("权限值必须为数组")
		}
	}
};
/**根据路由名获取相应路由对象,调用函数本身筛选子路由，返回得到路由对象*/
util.getRouterObjByName = function(routers, name) {
	if(!name || !routers || !routers.length) {
		return null;
	}
	// debugger;
	let routerObj = null;
	for(let item of routers) {
		if(item.name === name) {
			return item;
		}
		routerObj = util.getRouterObjByName(item.children, name);
		if(routerObj) {
			return routerObj;
		}
	}
	return null;
};
/**根据路由名获取相应路由对象层次结构，即包含父路由, 返回得到路由对象数组*/
util.getRouterObjArrayByName = function(routers, name) {
	var routerObjArray = [];
	if(!name || !routers || !routers.length) {
		return null;
	}
	var ifbreak = false;
	for(let item of routers) {
		routerObjArray.splice(0);
		routerObjArray.push(item)
		if(item.name === name) {
			ifbreak = true;
			break;
		}
		var istrue = util.getRouterObjArrayByNameInnerMethods(item.children, name, routerObjArray);
		if(istrue) {
			ifbreak = true;
			break;
		}
	}
	return ifbreak ? routerObjArray : null;
};
/**根据路由名获取相应路由对象层次结构，即包含父路由, 返回得到路由对象数组*/
util.getRouterObjArrayByNameInnerMethods = function(routers, name, routerObjArray) {
	var len = routerObjArray.length;
	var last = false;
	if(!name || !routers || !routers.length) {
		return last;
	}
	for(let item of routers) {
		routerObjArray.splice(len);
		routerObjArray.push(item);
		if(item.name === name) {
			last = true;
			break;
		}
		if(util.getRouterObjArrayByNameInnerMethods(item.children, name, routerObjArray)) break;
	}
	return last
};
/**从路由对象item中获取页面标题*/
util.handleTitle = function(vm, item) {
	if(typeof item.title === 'object') {
		return vm.$t(item.title.i18n);
	}
	else {
		return item.title;
	}
};
/**从当前页面对应的路由名称，返回得到路由层次对象数组,并在面包屑中显示
 *首页即name为home_index 永远显示在面包屑中，
 */
util.setCurrentPath = function(vm, name) {
	//	console.log(name)
	let title = '';
	let isOtherRouter = false;
	vm.$store.state.app.routers.forEach(item => {
		if(item.children.length === 1) {
			if(item.children[0].name === name) {
				title = util.handleTitle(vm, item);
				if(item.name === 'otherRouter') {
					isOtherRouter = true;
				}
			}
		}
		else {
			item.children.forEach(child => {
				if(child.name === name) {
					title = util.handleTitle(vm, child);
					if(item.name === 'otherRouter') {
						isOtherRouter = true;
					}
				}
			});
		}
	});
	let currentPathArr = [];
	if(name === 'home_index') {
		currentPathArr = [{
			title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
			path: '',
			name: 'home_index'
		}];
	}
	else if((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
		currentPathArr = [{
			title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
			path: '/home',
			name: 'home_index'
		}, {
			title: title,
			path: '',
			name: name
		}];
	}
	else {
		let currentPathObj = vm.$store.state.app.routers.filter(item => {
			if(item.children.length <= 1 && !item.expand) {
				return item.children[0].name === name;
			}
			else {
				let i = 0;
				let childArr = item.children;
				let len = childArr.length;
				while(i < len) {
					if(childArr[i].name === name) {
						return true;
					}
					i++;
				}
				return false;
			}
		})[0]; 
		if(currentPathObj.children.length <= 1 && !currentPathObj.expand) {
			currentPathArr = [{
				title: '首页',
				path: '/home',
				name: 'home_index'
			}, {
				title: currentPathObj.title,
				path: '',
				name: name
			}];
		} 
		else {
			let childObj = currentPathObj.children.filter((child) => {
				return child.name === name;
			})[0];
			currentPathArr = [{
				title: '首页',
				path: '/home',
				name: 'home_index'
			}, {
				title: currentPathObj.title,
				path: '',
				name: currentPathObj.name
			}, {
				title: childObj.title,
				path: currentPathObj.path + '/' + childObj.path,
				name: name
			}];
		}
	}
	vm.$store.commit('setCurrentPath', currentPathArr);
	//console.log(JSON.stringify(currentPathArr))
	return currentPathArr;
};
/**
 * 修改vuex中 记录当前所有打开的页面的信息，用于标签，显示和关闭
 *increateTag 对stroe里的pageOpenedList添加
 * pageOpenedList 对stroe里的pageOpenedList更新
 */
util.openNewPage = function(vm, name, argu, query) {
	let pageOpenedList = vm.$store.state.app.pageOpenedList;
	let openedPageLen = pageOpenedList.length;
	let i = 0;
	let tagHasOpened = false;
	while(i < openedPageLen) {
		if(name === pageOpenedList[i].name) { // 页面已经打开
			vm.$store.commit('pageOpenedList', {
				index: i,
				argu: argu,
				query: query
			});
			tagHasOpened = true;
			break;
		}
		i++;
	}
	if(!tagHasOpened) {
		let tag = vm.$store.state.app.tagsList.filter((item) => {
			if(item.children) {
				return name === item.children[0].name;
			}
			else {
				return name === item.name;
			}
		});
		tag = tag[0];
		if(tag) {
			tag = tag.children ? tag.children[0] : tag;
			if(argu) {
				tag.argu = argu;
			}
			if(query) {
				tag.query = query;
			}
			vm.$store.commit('increateTag', tag);
		}
	}
	vm.$store.commit('setCurrentPageName', name);
};
/*当路由中有子路有，并且没有设置重定向，那么路由的默认页面为其子路由的第一个路由页面。
 * 当点击一个拥有下拉菜单的菜单时，默认显示第一个下拉菜单*/
util.toDefaultPage = function(routers, name, route, next) {
	let len = routers.length;
	let i = 0;
	let notHandle = true;
	while(i < len) {
		if(routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
			route.replace({
				name: routers[i].children[0].name
			});
			notHandle = false;
			next();
			break;
		}
		i++;
	}
	if(notHandle) {
		next();
	}
};
/*全屏，更改状态，暂不知使用情况，即使删除也不报错*/
util.fullscreenEvent = function(vm) {
	console.log("全屏显示状态....util.js 252")
	vm.$store.commit('initCachepage');
	// 权限菜单过滤相关
	vm.$store.commit('updateMenulist');
	// 全屏相关
};
/**iview-admin更新  版本规格满足semver，出现更新时弹出Notice信息*/
/*util.checkUpdate = function(vm) {
	axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
		let version = res.data.tag_name;
		vm.$Notice.config({
			duration: 0
		});
		if(semver.lt(packjson.version, version)) {
			vm.$Notice.info({
				title: 'iview-admin更新啦',
				desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
			});
		}
	});
};*/
export default util;