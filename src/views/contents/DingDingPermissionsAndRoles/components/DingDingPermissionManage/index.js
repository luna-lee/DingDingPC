//创建表 ad_mis_permission, ad_mis_role ,ad_mis_role_permission
import Cookies from 'js-cookie';
import tables from '../../tables/tables.js'
export default {
	name: 'DingDingPermissionManage',
	props: {
		data: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			tables: tables,
			treeStructure: {
				id: tables.permission.colum.pk,
				title: tables.permission.colum.name,
				parentId: tables.permission.colum.parentid
			},
			tableName: tables.permission.name,
			username: JSON.parse(Cookies.get('user')).user_name,
			treeSelect: "",
			treeData: JSON.parse(JSON.stringify(this.data)),
			showLoading: false,
			rightClickNodeId: "",
			addModel: false,
			editModel: false,
			deleteModel: false,
			formInline: {
				inputValName: '',
				inputValKey: ''
			},
			ruleInline: {
				inputValName: [{
					required: true,
					message: '钉钉权限名称不能为空',
					trigger: 'blur'
				}],
				inputValKey: [{
					required: true,
					message: '钉钉权限键值不能为空',
					trigger: 'blur'
				}]
			}
		}
	},
	watch: {
		data(val) {
			this.treeData = JSON.parse(JSON.stringify(val))
		},
		treeData(val) {
			this.$emit('on-permissiondata', val)
		}
	},
	methods: {
		onSelected(val) {
			console.log(JSON.stringify(val))
			this.treeSelect = val
		},
		formRest() {
			this.formInline = {
				inputValName: '',
				inputValKey: ''
			}
		},
		editCancel() {
			this.editModel = false
			this.formRest()
		},
		editOk() {
			let $this = this;
			this.$refs.editForm.validate((valid) => {
				if(valid) {
					$this.showLoading = true;
					$this.rightClickNodeId[$this.treeStructure.title] = $this.formInline.inputValName
					$this.rightClickNodeId[tables.permission.colum.key] = $this.formInline.inputValKey
					$this.rightClickNodeId[tables.permission.colum.operator] = $this.username;
					$this.rightClickNodeId[tables.permission.colum.ts] = $this.comMethods.formatDate(1);
					let condition = {}
					condition[$this.treeStructure.id] = $this.rightClickNodeId[$this.treeStructure.id]
					$this.$ajax.get($this.path + '/json/mis_saveUpdateOrInsert', {
						params: {
							tableName: $this.tableName,
							data: $this.rightClickNodeId,
							condition: condition
						}
					}).then(function(response) {
						var data = response.data;
						if(data.success) {
							$this.$Message.success("钉钉权限更新成功！");
							$this.$refs.moontree.editNode($this.rightClickNodeId)
							$this.editModel = false
						}
						else {
							$this.$Message.error("钉钉权限更新失败！");
						}
					}).catch(function(response) {
						console.log(response)
						$this.$Message.error("钉钉权限更新失败，网络故障,请检查网络");
					}).then(function() {
						$this.showLoading = false;
						$this.formRest()
					});
				}
			})
		},
		addCancel() {
			this.formRest()
			this.addModel = false;
		},
		addOk() {
			let $this = this;
			this.$refs.addForm.validate((valid) => {
				if(valid) {
					let newData = {}
					newData[$this.treeStructure.id] = $this.comMethods.guid()
					newData[$this.treeStructure.title] = $this.formInline.inputValName
					newData[tables.permission.colum.operator] = $this.username;
					newData[tables.permission.colum.ts] = $this.comMethods.formatDate(1);
					newData[tables.permission.colum.key] = $this.formInline.inputValKey;
					newData[$this.treeStructure.parentId] = $this.rightClickNodeId[$this.treeStructure.id]
					let condition = {}
					condition[tables.permission.colum.pk] = newData[tables.permission.colum.pk]
					$this.showLoading = true;
					$this.$ajax.get($this.path + '/json/mis_saveUpdateOrInsert', {
						params: {
							tableName: $this.tableName,
							data: newData,
							condition: condition
						}
					}).then(function(response) {
						var data = response.data;
						if(data.success) {
							$this.$Message.success("新增钉钉权限成功！");
							$this.addModel = false
							$this.$refs.moontree.addNode(newData)
						}
						else {
							$this.$Message.error("新增钉钉权限失败！");
						}
					}).catch(function(response) {
						console.log(response)
						$this.$Message.error("新增钉钉权限失败，网络故障,请检查网络");
					}).then(function() {
						$this.showLoading = false;
						$this.formRest()
					});
				}
			})
		},
		rightClickId(val) {
			//			 			console.log(val)
			this.rightClickNodeId = val
		},
		addTreeNode() {
			this.addModel = true;
		},
		deleteCancel() {
			this.deleteModel = false;
		},
		deleteOk() {
			let $this = this;
			//当删除根节点时触发提示
			let success = this.$refs.moontree.deleteNode(() => {
				$this.$Message.error("有子钉钉权限，请先删除子钉钉权限")
			});
			if(success) {
				this.rightClickNodeId[tables.permission.colum.dr] = 1;
				this.rightClickNodeId[tables.permission.colum.operator] = $this.username;
				this.rightClickNodeId[tables.permission.colum.ts] = $this.comMethods.formatDate(1);
				let condition = {}
				condition[$this.treeStructure.id] = $this.rightClickNodeId[$this.treeStructure.id]
				this.showLoading = true;
				this.$ajax.get(this.path + '/json/mis_saveUpdateOrInsert', {
					params: {
						tableName: $this.tableName,
						data: this.rightClickNodeId,
						condition: condition
					}
				}).then(function(response) {
					var data = response.data;
					if(data.success) {
						$this.$Message.success("钉钉权限删除成功！");
					}
					else {
						$this.$Message.error("钉钉权限删除失败！");
					}
				}).catch(function(response) {
					console.log(response)
					$this.$Message.error("钉钉权限删除失败，网络故障,请检查网络");
				}).then(function() {
					$this.showLoading = false;
					$this.deleteModel = false;
				});
			}
		},
		deleteTreeNode() {
			this.deleteModel = true
		},
		editTreeNode() {
			this.editModel = true;
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