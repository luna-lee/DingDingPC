<style lang="less">
	@import './own-space.less';
</style>

<template>
	<div>
		<Card>
			<p slot="title">
				<Icon type="person"></Icon>
				个人信息
			</p>
			<div>
				<Form ref="userForm" :model="userForm" :label-width="100" label-position="right" >
					<FormItem label="用户姓名：" prop="name">
						<span>{{userForm.name }}</span>
					</FormItem>
					<FormItem label="用户手机：" prop="cellphone">
						<span>{{userForm.phone }}</span>
					</FormItem>
					<FormItem label="公司：">
						<span>{{ userForm.company }}</span>
					</FormItem>
					<FormItem label="部门：">
						<span>{{ userForm.department }}</span>
					</FormItem>
				</Form>
			</div>
		</Card>

	</div>
</template>

<script>
	import Cookies from 'js-cookie';
	export default {
		name: 'ownspace_index',
		data() {
			return {
				userForm: {
					name: '',
					phone: '',
					company: '',
					department: ''
				}

			}
		},
		methods: { 
			init() {
				console.log(Cookies.get('user'))
				var user = JSON.parse(Cookies.get('user'));
				this.userForm.name = user.user_name;
				this.userForm.phone = user.mobile;
				this.userForm.company = '新时代造船厂';
				this.userForm.department = user.deptname;
			}
		},
		mounted() {
			this.init();
		}
	};
</script>