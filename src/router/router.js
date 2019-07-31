import Main from '@/views/framework/Main.vue';
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
	path: '/login',
	name: 'login',
	meta: {
		title: 'Login - 登录'
	},
	component: () =>
		import('@/views/framework/login.vue')
};
export const page404 = {
	path: '/*',
	name: 'error-404',
	meta: {
		title: '404-页面不存在'
	},
	component: () =>
		import('@/views/framework/error-page/404.vue')
};
export const page403 = {
	path: '/403',
	meta: {
		title: '403-权限不足'
	},
	name: 'error-403',
	component: () =>
		import('@//views/framework/error-page/403.vue')
};
export const page500 = {
	path: '/500',
	meta: {
		title: '500-服务端错误'
	},
	name: 'error-500',
	component: () =>
		import('@/views/framework/error-page/500.vue')
};
export const locking = {
	path: '/locking',
	name: 'locking',
	component: () =>
		import('@/views/framework/main-components/lockscreen/components/locking-page.vue')
};
// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
	path: '/',
	name: 'otherRouter',
	redirect: '/home',
	component: Main,
	children: [{
		path: 'home',
		title: {
			i18n: 'home'
		},
		name: 'home_index',
		component: () =>
			import('@/views/framework/home/home.vue')
	}, {
		path: 'ownspace',
		title: '个人中心',
		name: 'ownspace_index',
		component: () =>
			import('@/views/framework/own-space/own-space.vue')
	}]
};
// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
	/*{
		path: '/demo',
		icon: 'key',
		access: "demo",
		name: 'demo',
		title: '范例',
		component: Main,
		children: [{
			path: 'index',
			title: '范例-1',
			name: 'demo_index',
			component: () =>
				import('@/views/contents/demo/demo.vue')
		}]
	}, {
		path: '/demo2',
		icon: 'key',
		name: 'demo2',
		title: '范例2',
		access: "demo2",
		component: Main,
		expand:true,//设置为true后 当子路由只有一个时也使用下拉展开菜单
		children: [{
			path: 'index2',
			title: '范例2-1',
			name: 'demo_index2',
			component: () =>
				import('@/views/contents/demo2/demo2.vue')
		}]
	},*/
	{
		path: '/PermissionsAndRoles',
		icon: 'md-person',
		name: 'PermissionsAndRoles',
		access: 'PermissionsAndRoles',
		expand: true,
		title: '权限与角色',
		component: Main,
		children: [{
			path: 'PermissionAndRoleManage',
			title: '权限角色管理',
			access: 'PermissionManage',
			name: 'PermissionAndRoleManage',
			component: () =>
				import(
					'@/views/contents/PermissionsAndRoles/PermissionAndRoleManage/PermissionAndRoleManage.vue')
		}]
	}, {
		path: '/DingDingPermissionsAndRoles',
		icon: 'md-person',
		name: 'DingDingPermissionsAndRoles',
		access: 'DingDingPermissionsAndRoles',
		title: '钉钉权限管理',
		component: Main,
		expand: true,
		children: [{
			path: 'DingDingPermissionAndRoleManage',
			title: '钉钉权限角色管理',
			access: 'DingDingPermissionAndRoleManage',
			name: 'DingDingPermissionAndRoleManage',
			component: () =>
				import(
					'@/views/contents/DingDingPermissionsAndRoles/DingDingPermissionAndRoleManage/DingDingPermissionAndRoleManage.vue'
				)
		}]
	}, {
		path: '/EquipmentDept',
		icon: 'md-settings',
		name: 'EquipmentDept',
		access: "EquipmentDept",
		title: '设备部',
		component: Main,
		expand: true,
		children: [{
			path: 'EquipCheckPoint',
			title: '设备点检项',
			access: 'EquipCheckPoint',
			name: 'EquipCheckPoint',
			component: () =>
				import('@/views/contents/EquipmentDept/EquipCheckPoint/EquipCheckPoint.vue')
		}, {
			path: 'EquipCheckReport',
			title: '设备点检报表',
			access: 'EquipCheckReport',
			name: 'EquipCheckReport',
			component: () =>
				import('@/views/contents/EquipmentDept/EquipCheckReport/EquipCheckReport.vue')
		}]
	}, {
		path: '/SecurityDept',
		icon: 'md-aperture',
		name: 'SecurityDept',
		access: "SecurityDept",
		title: '安环部',
		component: Main,
		expand: true,
		children: [{
			path: 'AreaCheckPoint',
			title: '场地点检项',
			access: 'AreaCheckPoint',
			name: 'AreaCheckPoint',
			component: () =>
				import('@/views/contents/SecurityDept/AreaCheckPoint/AreaCheckPoint.vue')
		}, {
			path: 'AreaCheckReport',
			title: '场地点检报表',
			access: 'AreaCheckReport',
			name: 'AreaCheckReport',
			component: () =>
				import('@/views/contents/SecurityDept/AreaCheckReport/AreaCheckReport.vue')
		}]
	}, {
		path: '/Functions',
		icon: 'md-construct',
		name: 'Functions',
		access: "Functions",
		title: '辅助工具',
		component: Main,
		expand: true,
		children: [{
			path: 'QRCode',
			title: '二维码生成',
			access: 'QRCode',
			name: 'QRCode',
			component: () =>
				import('@/views/contents/Functions/QRCode/QRCode.vue')
		}]
	}
];
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
	loginRouter,
	otherRouter,
	locking, ...appRouter,
	page500,
	page403,
	page404 //一定要写在routers的最后面。routers是逐级匹配的
];