//创建表  ad_mis_role ,ad_mis_role_role
import Cookies from 'js-cookie';
import tables from '../../tables/tables.js'
import mytable from '@/views/components/table/my-editTable'
import tableColumn from './tableColumn.js'
import XLSX from 'xlsx';
import sql from '../../sql/sql.js'
export default {
	name: 'RoleManage',
	props: {
		data: {
			type: Array,
			default: []
		}
	},
	components: {
		mytable
	},
	data() {
		return {
			buttons: {
				add: true,
				search: false,
				delete: true,
				import: true,
				edit: true,
				save: true,
				cancel: true,
				exprot: false
			},
			ModalLoading: false,
			DistributionModal: false,
			tableData: [],
			tableColumn: tableColumn(this),
			treeStructure: {
				id: tables.role.colum.pk,
				title: tables.role.colum.name,
				parentId: "parentId"
			},
			tableName: tables.role.name,
			username: JSON.parse(Cookies.get('user')).user_name,
			treeSelect: "",
			showLoading: false,
			treeData: JSON.parse(JSON.stringify(this.data)),
			rightClickNodeId: "",
			addModel: false,
			editModel: false,
			deleteModel: false,
			formInline: {
				inputValName: ''
			},
			ruleInline: {
				inputValName: [{
					required: true,
					message: '角色名称不能为空',
					trigger: 'blur'
				}]
			},
			Disabled: false,
			queryRoleModal: false,
			queryRoleTableColum: [{
				title: "序号",
				type: "index",
				width: 60,
				align: 'center'
			}, {
				title: "人员姓名",
				key: "user_name",
				align: 'center'
			}, {
				title: "角色名",
				key: tables.role.colum.name,
				align: 'center'
			}, {
				title: '操作',
				key: 'action',
				width: 150,
				align: 'center',
				render: (h, params) => {
					return h('div', [
						h('Button', {
							props: {
								type: 'error',
								size: 'small'
							},
							on: {
								click: () => {
									this.removePersonRole(params)
								}
							}
						}, '移除')
					]);
				}
			}],
			queryRoleTableData: [],
			QueryRoleModalInput: "",
			QueryRoleModalTableLoading: false
		}
	},
	watch: {
		data(val) {
			this.treeData = JSON.parse(JSON.stringify(val))
		},
		treeData(val) {}
	},
	methods: {
		removePersonRole(val) {
			console.log(JSON.stringify(val.row));
			let $this = this;
			this.showLoading = true;
			this.$ajax.get(this.path + '/json/mis_update', {
				params: {
					tableName: tables.role_person.name,
					set: "set dr=1",
					where: " where " + tables.role_person.colum.pk + " = '" + val.row[tables.role_person.colum.pk] +
						"'"
				}
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.$Message.success("角色移除成功！");
					$this.queryRoleTableData.splice(val.index, 1)
				}
				else {
					$this.$Message.error("角色移除失败！");
				}
			}).catch(function(response) {
				console.log(response)
				$this.$Message.error("角色移除失败，网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		QueryRoleModalSearch() {
			if(!this.QueryRoleModalInput) {
				this.$Message.error("请输入查询帐号");
				return
			}
			let $this = this;
			this.QueryRoleModalTableLoading = true;
			$this.$ajax.get($this.path + '/json/mis_getData', {
				params: sql.getRoleByCode($this.QueryRoleModalInput.trim())
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.queryRoleTableData = data.obj
				}
				else {
					$this.$Message.error("查询失败！");
				}
			}).catch(function(response) {
				console.log(response)
				$this.$Message.error("查询失败，网络故障,请检查网络");
			}).then(function() {
				$this.QueryRoleModalTableLoading = false;
			});
		},
		onQueryRole() {
			this.queryRoleModal = true
		},
		onQueryRoleModalOk() {
			this.queryRoleModal = false
			this.queryRoleTableData.splice(0)
			this.QueryRoleModalInput = ""
		},
		Distribution() {
			this.DistributionModal = true;
		},
		onSelected(val) {
			this.treeSelect = val
			this.$emit('on-roledata', val)
		},
		formRest() {
			this.formInline = {
				inputValName: ''
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
					$this.rightClickNodeId[tables.role.colum.name] = $this.formInline.inputValName
					$this.rightClickNodeId[tables.role.colum.operator] = $this.username;
					$this.rightClickNodeId[tables.role.colum.ts] = $this.comMethods.formatDate(1);
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
							$this.$Message.success("角色更新成功！");
							$this.$refs.moontree.editNode($this.rightClickNodeId)
							$this.editModel = false
						}
						else {
							$this.$Message.error("角色更新失败！");
						}
					}).catch(function(response) {
						console.log(response)
						$this.$Message.error("角色更新失败，网络故障,请检查网络");
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
					newData[tables.role.colum.pk] = $this.comMethods.guid()
					newData[tables.role.colum.name] = $this.formInline.inputValName
					newData[tables.role.colum.operator] = $this.username;
					newData[tables.role.colum.ts] = $this.comMethods.formatDate(1);
					newData[$this.treeStructure.parentId] = $this.rightClickNodeId[$this.treeStructure.id]
					let condition = {}
					condition[$this.treeStructure.id] = newData[$this.treeStructure.id]
					console.log(JSON.stringify(newData))
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
							$this.$Message.success("新增角色成功！");
							$this.addModel = false
							$this.$refs.moontree.addNode(newData)
						}
						else {
							$this.$Message.error("新增角色失败！");
						}
					}).catch(function(response) {
						console.log(response)
						$this.$Message.error("新增角色失败，网络故障,请检查网络");
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
				$this.$Message.error("有子角色，请先删除子角色")
			});
			if(success) {
				this.rightClickNodeId[tables.role.colum.dr] = 1;
				this.rightClickNodeId[tables.role.colum.operator] = $this.username;
				this.rightClickNodeId[tables.role.colum.ts] = $this.comMethods.formatDate(1);
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
						$this.$Message.success("角色删除成功！");
					}
					else {
						$this.$Message.error("角色删除失败！");
					}
				}).catch(function(response) {
					console.log(response)
					$this.$Message.error("角色删除失败，网络故障,请检查网络");
				}).then(function() {
					$this.deleteModel = false;
					$this.showLoading = false;
				});
			}
		},
		deleteTreeNode() {
			this.deleteModel = true
		},
		editTreeNode() {
			this.editModel = true;
		},
		DistributionModaCancel() {
			this.DistributionModal = false
			this.tableData.splice(0)
		},
		DistributionModalOk() {
			if(this.tableData.length == 0) {
				this.$Message.warning("请先填写或导入数据！");
				return;
			}
			let data = []
			let $this = this
			$this.ModalLoading = true;
			let pkRole = this.rightClickNodeId[tables.role.colum.pk];
			this.tableData.forEach((value) => {
				let getICD = sql.getPersonPkByCode(value.id)
				let SetInsertValue = {}
				SetInsertValue[tables.role_person.colum.pk] = this.comMethods.guid();
				SetInsertValue[tables.role_person.colum.pkRole] = pkRole;
				SetInsertValue[tables.role_person.colum.pkPerson] = getICD;
				SetInsertValue[tables.role_person.colum.ts] = $this.comMethods.formatDate(1);
				SetInsertValue[tables.role_person.colum.operator] = this.username;
				SetInsertValue[tables.role_person.colum.dr] = 0;
				let Condition = {}
				Condition[tables.role_person.colum.pkRole] = pkRole
				Condition[tables.role_person.colum.pkPerson] = getICD;
				data.push({
					SetInsertValue: SetInsertValue,
					Condition: Condition
				})
			})
			$this.$ajax.post($this.path + '/json/mis_saveUpdateOrInsertArray', {
				tableName: tables.role_person.name,
				data: JSON.stringify(data)
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.$Message.success("角色分配成功！");
					$this.DistributionModal = false;
					$this.tableData.splice(0)
				}
				else {
					let message = {
						content: "角色分配失败，第" + data.msg + "行，帐号不存在",
						duration: 0,
						closable: true
					}
					$this.$Message.error(message);
				}
			}).catch(function(response) {
				console.log(response)
				let message = {
					content: "角色分配失败，网络故障,请检查网络！",
					duration: 0,
					closable: true
				}
				$this.$Message.error(message);
			}).then(function() {
				$this.ModalLoading = false;
			});
		},
		importFile(file) {
			var wb;
			var $this = this;
			var getFileName = file.name;
			var reader = new FileReader();
			reader.onload = function(e) {
				var data = e.target.result;
				wb = XLSX.read(data, {
					type: 'binary'
				});
				//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
				//wb.Sheets[Sheet名]获取第一个Sheet的数据.  
				let newTreeNode = []
				let iserror = false;
				wb.SheetNames.forEach((value, index) => {
					let sheetJson = XLSX.utils.sheet_to_json(wb.Sheets[value]);
					let keys = {}
					sheetJson.forEach((val, ind) => {
						Object.assign(keys, val)
					})
					sheetJson.forEach((val, ind) => {
						if(iserror) return;
						let f = {
							uuid: $this.comMethods.guid(),
							id: "",
							name: "",
						};
						for(let key in keys) {
							if(iserror) return;
							if(key) {
								if(key.indexOf("姓名") != -1) {
									if(val[key] && val[key].trim()) {
										f.name = val[key].trim()
									}
									else {
										let message = {
											content: "导入失败：" + value + "第" + (ind + 1) + "行，姓名不能为空",
											duration: 0,
											closable: true
										}
										$this.$Message.error(message);
										iserror = true;
										break;
									}
								}
								if(key.indexOf("帐号") != -1) {
									if(val[key] && val[key].trim()) f.id = val[key].trim()
									else {
										let message = {
											content: "导入失败：" + value + "第" + (ind + 1) + "行，帐号不能为空",
											duration: 0,
											closable: true
										}
										$this.$Message.error(message);
										iserror = true;
										break;
									}
								}
							}
						}
						if(!f.id) {
							let message = {
								content: "导入失败：" + value + "内缺少“帐号”列",
								duration: 0,
								closable: true
							}
							$this.$Message.error(message);
							iserror = true;
						}
						if(!f.name) {
							let message = {
								content: "导入失败：" + value + "内缺少“姓名”列",
								duration: 0,
								closable: true
							}
							$this.$Message.error(message);
							iserror = true;
						}
						if(!iserror) $this.tableData.push(f)
					})
				})
			};
			reader.readAsBinaryString(file);
		},
		saveData(value, index) {
			//接收待保存的数据，及数据下标
			let $this = this;
			let valueData = JSON.parse(JSON.stringify(value))
			valueData.free01 = $this.username;
			let setUUID = this.comMethods.guid();
			//此处需要更具数据源判断是修改后保存的还是新增后保存的，修改保存的则是删除插入，新增的则是插入
			let condition = {
				uuid: valueData.uuid ? valueData.uuid : setUUID
			}
			if(!valueData.uuid) {
				//增加数据时需要补全uuid和classname
				valueData.uuid = setUUID;
				valueData.classname = this.treeSelect.classname
			}
			if(valueData.uuid != setUUID) {
				//修改数据
				$this.tableData.splice(index, 1, valueData)
			}
			else {
				//新增数据
				$this.tableData.splice(index, 0, valueData)
			}
		},
		deleteData(value, indexArr) {
			//得到确定要删除的对象，与下标数组
			//根据下标数组，变异修改数据源  
			this.comMethods.ArrayRemoveByIndexArray(this.tableData, indexArr)
		},
		onEditing(val) {
			this.Disabled = val
		 
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