//创建表 ad_mis_permission, ad_mis_role ,ad_mis_role_permission
import Cookies from 'js-cookie';
import permission from '../components/PermissionManage/PermissionManage'
import role from '../components/RoleManage/RoleManage'
import tables from '../tables/tables.js'
import sql from '../sql/sql.js'
export default {
	name: 'PermissionAndRoleManage',
	components: {
		permission,
		role
	},
	data() {
		return {
			tables: tables,
			treeStructure: {
				id: tables.permission.colum.pk,
				title: tables.permission.colum.name,
				parentId: tables.permission.colum.parentid
			},
			tableName: tables.role_permission.name,
			username: JSON.parse(Cookies.get('user')).user_name,
			roleTreeData: [],
			permissionTreeData: [],
			treeDataPermissionOnRole: [],
			showLoading: false,
			deleteModel: false,
			showLoadingKeeping: false,
			currentPermission: [],
			currentRole: {},
			newPermissionOnRole: [],
			rightClickNodeId: "",
			root: "root"
		}
	},
	mounted() {
		this.getRoleTreeData();
		this.delayExecuteGetPermissionTreeData();
	},
	methods: {
		onButton() {
			let $this = this
			let pkPmsSelectedArray = []
			let pkRole = this.currentRole[tables.role.colum.pk];
			if(!pkRole || pkRole == this.root) {
				$this.$Message.error("请选择角色");
				return
			};
			this.currentPermission.forEach(function(value, index) {
				if((value.checked || value.indeterminate) && value[tables.permission.colum.pk] != this.root)
					pkPmsSelectedArray.push(value[tables.permission.colum.pk])
			}.bind(this))
			if(pkPmsSelectedArray.length == 0) {
				$this.$Message.error("请选择权限");
				return
			}
			pkPmsSelectedArray.forEach(function(value, index) {
				let SetInsertValue = {}
				SetInsertValue[tables.role_permission.colum.pk] = this.comMethods.guid();
				SetInsertValue[tables.role_permission.colum.pkRole] = pkRole;
				SetInsertValue[tables.role_permission.colum.pkPermission] = value;
				SetInsertValue[tables.role_permission.colum.ts] = $this.comMethods.formatDate(1);
				SetInsertValue[tables.role_permission.colum.operator] = this.username;
				SetInsertValue[tables.role_permission.colum.dr] = 0;
				let Condition = {}
				Condition[tables.role_permission.colum.pkRole] = pkRole
				Condition[tables.role_permission.colum.pkPermission] = value;
				this.newPermissionOnRole.push({
					SetInsertValue: SetInsertValue,
					Condition: Condition
				})
			}.bind(this))
			this.addNewPermissionOnRole()
		},
		addNewPermissionOnRole() {
			let $this = this
			$this.showLoading = true;
			$this.$ajax.post($this.path + '/json/mis_saveUpdateOrInsertArray', {
				tableName: $this.tableName,
				data: JSON.stringify(this.newPermissionOnRole)
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.$Message.success("权限分配成功！");
					$this.delayExecuteGetPermissionByRole()
				}
				else {
					let message = {
						content: "权限分配失败！",
						duration: 0,
						closable: true
					}
					$this.$Message.error(message);
				}
			}).catch(function(response) {
				console.log(response)
				let message = {
					content: "权限分配失败，网络故障,请检查网络！",
					duration: 0,
					closable: true
				}
				$this.$Message.error(message);
			}).then(function() {
				$this.showLoading = false;
			});
		},
		delayExecuteGetPermissionTreeData() {
			this.showLoadingKeeping = true;
			var t = setTimeout(this.delayExecuteGetPermissionTreeData, 200)
			if(!this.showLoading && this.$refs.role && this.$refs.permission && !this.$refs.role.showLoading &&
				!this.$refs.permission.showLoading) {
				clearTimeout(t)
				this.showLoadingKeeping = false;
				this.getPermissionTreeData()
			}
		},
		delayExecuteGetPermissionByRole() {
			this.showLoadingKeeping = true;
			var t = setTimeout(this.delayExecuteGetPermissionByRole, 200)
			if(!this.showLoading && this.$refs.role && this.$refs.permission && !this.$refs.role.showLoading &&
				!this.$refs.permission.showLoading) {
				clearTimeout(t)
				this.showLoadingKeeping = false;
				this.getPermissionByRole()
			}
		},
		getRoleTreeData() {
			var $this = this;
			if(this.showLoading) {
				return;
			}
			this.showLoading = true;
			this.$ajax.get(this.path + '/json/mis_getData', {
				params: sql.getAllRoleSql()
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					var tree = data.obj;
					let initRoot = {}
					initRoot[tables.role.colum.pk] = $this.root;
					initRoot[tables.role.colum.name] = "角色管理";
					initRoot.expand = true;
					initRoot.parentid = "";
					tree.forEach(function(value, index) {
						value.expand = true;
						value.parentId = $this.root;
						if(index == 0) value.selected = true;
					})
					$this.roleTreeData = tree;
					$this.roleTreeData.push(initRoot)
				}
				else {
					$this.$Message.error(data.msg);
				}
			}).catch(function(response) {
				console.log()
				$this.$Message.error("网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		getPermissionTreeData() {
			var $this = this;
			if(this.showLoading) {
				return;
			}
			this.showLoading = true;
			this.$ajax.get(this.path + '/json/mis_getData', {
				params: sql.getAllPermissionSql()
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					var tree = data.obj;
					let initRoot = {}
					initRoot[tables.permission.colum.pk] = $this.root;
					initRoot[tables.permission.colum.name] = "权限管理";
					initRoot.expand = true;
					initRoot[tables.permission.colum.parentid] = ""
					let rootExist = false;
					tree.forEach(function(value) {
						value.expand = true
						if(!value[tables.permission.colum.parentid]) {
							rootExist = true;
							$this.root = value[tables.permission.colum.pk];
							value[tables.permission.colum.name] = "权限管理";
						}
					})
					$this.permissionTreeData = tree
					if(!rootExist) $this.permissionTreeData.push(initRoot)
				}
				else {
					$this.$Message.error(data.msg);
				}
			}).catch(function(response) {
				$this.$Message.error("网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		getPermissionByRole() {
			var $this = this;
			if(this.showLoading) {
				return;
			}
			this.showLoading = true;
			this.$ajax.get(this.path + '/json/mis_getData', {
				params: sql.getPermissionByRoleSql($this.currentRole[tables.role.colum.pk])
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					var tree = data.obj;
					let initRoot = {}
					initRoot[tables.permission.colum.pk] = $this.root;
					initRoot[tables.permission.colum.name] = "当前角色所拥有的权限";
					initRoot.expand = true;
					initRoot[tables.permission.colum.parentid] = ""
					let rootExist = false;
					tree.forEach(function(value) {
						value.expand = true
						if(!value[tables.permission.colum.parentid]) {
							rootExist = true;
							$this.root = value[tables.permission.colum.pk];
							value[tables.permission.colum.name] = "当前角色所拥有的权限";
						}
					})
					$this.treeDataPermissionOnRole = tree;
					if(!rootExist) $this.treeDataPermissionOnRole.push(initRoot)
				}
				else {
					$this.$Message.error(data.msg);
				}
			}).catch(function(response) {
				console.log(response)
				$this.$Message.error("网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		onPermissiondata(val) {
			this.currentPermission = JSON.parse(JSON.stringify(val))
		},
		onRoledata(val) {
			if(val.selected && val[tables.role.colum.pk] != this.root) this.currentRole = JSON.parse(JSON.stringify(
				val))
		},
		onSelected(val) {},
		rightClickId(val) {
			if(val[tables.permission.colum.pk] == this.root) {
				this.$refs.moontree.dropShow = false;
			}
			else {
				this.rightClickNodeId = val
			}
		}, 
		deleteCancel() {
			this.deleteModel = false;
		},
		deleteOk() {
			let $this = this;
			let pkRole = this.currentRole[tables.role.colum.pk]; 
			//当删除根节点时触发提示
			let success = this.$refs.moontree.deleteNode(() => {
				$this.$Message.error("有子权限，请先删除子权限")
			});
			if(success) {
				let setData = {}
				setData[tables.role_permission.colum.dr] = 1
				setData[tables.role_permission.colum.operator] = $this.username;
				setData[tables.role_permission.colum.ts] = $this.comMethods.formatDate(1);
				let condition = {}
				condition[tables.role_permission.colum.pkRole] = pkRole
				condition[tables.role_permission.colum.pkPermission] = this.rightClickNodeId[this.treeStructure
					.id]
				this.showLoading = true;
				this.$ajax.get(this.path + '/json/mis_saveUpdateOrInsert', {
					params: {
						tableName: tables.role_permission.name,
						data: setData,
						condition: condition
					}
				}).then(function(response) {
					var data = response.data;
					if(data.success) {
						$this.$Message.success("权限删除成功！");
					}
					else {
						$this.$Message.error("权限删除失败！");
					}
				}).catch(function(response) {
					console.log(response)
					$this.$Message.error("权限删除失败，网络故障,请检查网络");
				}).then(function() {
					$this.showLoading = false;
					$this.deleteModel = false;
				});
			}
		},
		deletePmsOnRole() {
			this.deleteModel = true
		}
	},
	watch: {
		currentRole(val) {
			this.delayExecuteGetPermissionByRole();
		}
	},
	computed: {
		path() {
			return this.comMethods.projectPath();
		}, //高度控制
		mainRouterAreaHeight() {
			return this.$store.state.app.mainRouterArea.height
		}
	}
}