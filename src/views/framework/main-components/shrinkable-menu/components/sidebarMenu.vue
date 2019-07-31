<style lang="less">
	@import '../styles/menu.less';
</style>

<template>
	<Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto"
	 z @on-select="changeMenu">
		<template v-for="item in menuList">
			<!--单个节点 ，当只拥有一个子节点时 ，默认显示第一个子节点-->
			<MenuItem v-if="item.children.length<=1 && !item.expand" :name="item.children[0].name" :key="'menuitem' + item.name">
			<Icon :type="item.children[0].icon || item.icon" :size="iconSize" :key="'menuicon' + item.name"></Icon>
			<span class="layout-text" :key="'title' + item.name">{{ itemTitle(item.children[0]) }}</span>
			</MenuItem>
			<!--下拉节点   -->
			<Submenu v-if="item.children.length > 1 || item.expand" :name="item.name" :key="item.name">
				<template slot="title">
					<Icon :type="item.icon" :size="iconSize"></Icon>
					<span class="layout-text">{{ itemTitle(item) }}</span>
				</template>
				<template v-for="child in item.children">
					<MenuItem :name="child.name" :key="'menuitem' + child.name">
					<Icon :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
					<span class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
					</MenuItem>
				</template>
			</Submenu>
		</template>
	</Menu>
</template>

<script>
	export default {
		name: 'sidebarMenu',
		props: {
			menuList: Array,
			iconSize: Number,
			menuTheme: {
				type: String,
				default: 'dark'
			},
			openNames: {
				type: Array
			}
		},
		methods: {
			changeMenu(active) {
				this.$emit('on-change', active);
			},
			itemTitle(item) {
				if(typeof item.title === 'object') {
					return this.$t(item.title.i18n);
				}
				else {
					return item.title;
				}
			}
		},
		updated() {
			this.$nextTick(() => {
				if(this.$refs.sideMenu) {
					this.$refs.sideMenu.updateOpened();
				}
			});
		}

	};
</script>