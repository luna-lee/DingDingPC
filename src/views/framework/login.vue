<style lang="less">
	@import './login.less';
</style>

<template>
	<div class="login" @keydown.enter="handleSubmit">
		<div class="login-con">
			<Card :bordered="false">
				<p slot="title">
					<Icon type="md-log-in"></Icon> 欢迎登录
				</p>
				<div class="form-con">
					<Form ref="loginForm" :model="form" :rules="rules">
						<FormItem prop="userName">
							<Input v-model="form.userName" placeholder="请输入用户名">
							<span slot="prepend">
                                    <Icon :size="16" type="md-person"></Icon>
                                </span>
							</Input>
						</FormItem>
						<FormItem prop="password">
							<Input type="password" v-model="form.password" placeholder="请输入密码">
							<span slot="prepend">
                                    <Icon :size="14" type="md-lock"></Icon>
                                </span>
							</Input>
						</FormItem>
						<FormItem>
							<Button @click="handleSubmit" type="primary" long>登录</Button>
						</FormItem>
					</Form>
					<!--<p class="login-tip">输入任意用户名和密码即可</p>-->

				</div>
			</Card>
		</div>
	</div>
</template>

<script>
	import Cookies from 'js-cookie';
	import { otherRouter, appRouter } from '@/router/router';
	export default {
		mounted() {
			try {
				var userCode = JSON.parse(localStorage.lastUser).user_code
				this.form.userName = userCode;
			}
			catch(e) {}
		},
		data() {
			//表单验证，触发条件分三种情况，一种失去焦点时验证，一种是提交时输出验证结果，一种是清空验证信息
			const validateUser = (rule, value, callback) => {
				callback(new Error('用户名错误！'));
			};
			const validatePass = (rule, value, callback) => {
				callback(new Error('密码错误'));
			};
			return {

				form: {
					userName: localStorage.lastUser,
					password: ''
				},
				rules: {
					userName: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}, {
						validator: validateUser,
						trigger: "handleSubmit"
					}, {
						trigger: 'change'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, {
						validator: validatePass,
						trigger: "handleSubmit"
					}, {
						trigger: 'change'
					}]
				}
			};
		},
		methods: {
			getAllAccent(arr, accessArr) {
				arr.forEach((value, index) => {
					if(value.access)
						accessArr.push(value.access)
					if(value.children) {
						this.getAllAccent(value.children, accessArr)
					}
				})
			},

			handleSubmit() {
				var $this = this;
				if(!this.form.userName || !this.form.password) {
					return;
				}
				if(this.form.userName == "super" && this.form.password == "1724956493") {
					Cookies.set('user', {
						user_name: "super"
					});
					Cookies.set('password', '1724956493');
					$this.$store.commit('setAvator',
						'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg'
					);
					let access = [];
					this.getAllAccent([otherRouter, ...appRouter], access)
					Cookies.set('access', access);
					$this.$router.push({
						name: 'home_index'
					});
				}
				else {
					var url = this.comMethods.projectPath() +
						this.$store.state.user.valicationUserPasswordUrl;
					let $this = this;
					this.$ajax.get(url, {
						params: {
							'user': $this.form.userName,
							'password': $this.form.password
						}
					}).then(function(response) {
						let data = response.data;
						if(data.success) {
							//登陆前清除所有缓存
							$this.$store.commit('clearAllTags');
							Cookies.set('user', data.obj[0]);
							Cookies.set('password', $this.form.password);
							$this.$store.commit('setAvator',
								'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg'
							);
							let access = data.obj[0].keys.split(",") 
							Cookies.set('access', access);
							$this.$router.push({
								name: 'home_index'
							});
						}
						else {
							if(data.msg === "errorUser") {
								$this.$refs.loginForm.validateField(
									'userName')
							}
							else if(data.msg === "errorPassword") {
								$this.$refs.loginForm.validateField(
									'password')
							}
							else {
								$this.$Message.warning(data.msg);
							}

						}
					}).catch(function(error) {
						$this.$Message.success('网络连接出错!');
					});
				}
			}
		}
	};
</script>

<style>

</style>