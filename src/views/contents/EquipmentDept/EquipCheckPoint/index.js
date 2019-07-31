import mytable from '@/views/components/table/my-editTable';
import tableColumn from './tableColumn.js'
import XLSX from 'xlsx';
import Cookies from 'js-cookie';
import sql from './sql.js';
export default {
	name: 'EquipCheckPoint',
	mounted: function() {
		this.getTreeData();
		this.timedCount_getTableData();
	},
	activated: function() {},
	methods: {
		onEditing(val) {
			this.isEditing = val
		},
		updataTreeData() {
			let $this = this;
			this.fistClassNum = this.SecondClassNum = this.ThirdClassNum = this.FouthClassNum = this.OtherClassNum =
				0
			this.treeData.forEach(function(value, index) {
				if(value.classtype) {
					if(value.classtype.indexOf("一类设备") != -1) {
						$this.fistClassNum++
					}
					if(value.classtype.indexOf("二类设备") != -1) {
						$this.SecondClassNum++
					}
					if(value.classtype.indexOf("三类设备") != -1) {
						$this.ThirdClassNum++
					}
					if(value.classtype.indexOf("四类设备") != -1) {
						$this.FouthClassNum++
					}
					if(value.classtype.indexOf("待分类设备") != -1) {
						$this.OtherClassNum++
					}
				}
			})
			this.restTreeData()
			this.treeData = JSON.parse(JSON.stringify(this.treeData))
		},
		restTreeData() {
			let $this = this;
			this.treeData.forEach(function(value, index) {
				if(value[this.treeStructure.title].indexOf("一类设备") != -1) {
					value[this.treeStructure.title] = "一类设备(" + $this.fistClassNum + ")";
				}
				if(value[this.treeStructure.title].indexOf("二类设备") != -1) {
					value[this.treeStructure.title] = "二类设备(" + $this.SecondClassNum + ")";
				}
				if(value[this.treeStructure.title].indexOf("三类设备") != -1) {
					value[this.treeStructure.title] = "三类设备(" + $this.ThirdClassNum + ")";
				}
				if(value[this.treeStructure.title].indexOf("四类设备") != -1) {
					value[this.treeStructure.title] = "四类设备(" + $this.FouthClassNum + ")";
				}
				if(value[this.treeStructure.title].indexOf("待分类设备") != -1) {
					value[this.treeStructure.title] = "待分类设备(" + $this.OtherClassNum + ")";
				}
			}.bind(this))
		},
		moveUpdate(newClass, fun) {
			let $this = this;
			this.showLoading = true;
			this.$ajax.get(this.path + '/json/mis_update', {
				params: {
					tableName: 'ad_equipck_classname',
					set: "set classtype='" + newClass + "',operator='" + $this.username + "'," + "ts= '" + $this
						.comMethods.formatDate(1) + "'",
					where: " where classname = '" + $this.rightClickNodeId.classname + "'"
				}
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.$Message.success("设备节点重新分类成功！");
					fun();
				}
				else {
					$this.$Message.error("设备节点分类失败！");
				}
			}).catch(function(response) {
				console.log(response)
				$this.$Message.error("设备节点分类失败，网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
				$this.moveTreeNodeDropShow = false;
			});
		},
		importUpdata() {
			let $this = this;
			this.fistClassNum = this.SecondClassNum = this.ThirdClassNum = this.FouthClassNum = this.OtherClassNum =
				0
			this.treeData.forEach(function(value, index) {
				if(value.classtype) {
					if(value.classtype.indexOf("一类设备") != -1) {
						$this.fistClassNum++
					}
					if(value.classtype.indexOf("二类设备") != -1) {
						$this.SecondClassNum++
					}
					if(value.classtype.indexOf("三类设备") != -1) {
						$this.ThirdClassNum++
					}
					if(value.classtype.indexOf("四类设备") != -1) {
						$this.FouthClassNum++
					}
					if(value.classtype.indexOf("待分类设备") != -1) {
						$this.OtherClassNum++
					}
				}
			}.bind(this))
			this.restTreeData()
			this.treeData = JSON.parse(JSON.stringify(this.treeData))
		},
		moveToFist() {
			let $this = this;
			this.fistClassNum = this.SecondClassNum = this.ThirdClassNum = this.FouthClassNum = this.OtherClassNum =
				0
			this.treeData.forEach(function(value, index) {
				if(value[this.treeStructure.title] == this.rightClickNodeId[this.treeStructure.title]) {
					value.classtype = "一类设备";
					value.parent = "1";
				}
				if(value.classtype) {
					if(value.classtype.indexOf("一类设备") != -1) {
						$this.fistClassNum++
					}
					if(value.classtype.indexOf("二类设备") != -1) {
						$this.SecondClassNum++
					}
					if(value.classtype.indexOf("三类设备") != -1) {
						$this.ThirdClassNum++
					}
					if(value.classtype.indexOf("四类设备") != -1) {
						$this.FouthClassNum++
					}
					if(value.classtype.indexOf("待分类设备") != -1) {
						$this.OtherClassNum++
					}
				}
			}.bind(this))
			this.restTreeData()
			this.treeData = JSON.parse(JSON.stringify(this.treeData))
		},
		moveToSecond() {
			let $this = this;
			this.fistClassNum = this.SecondClassNum = this.ThirdClassNum = this.FouthClassNum = this.OtherClassNum =
				0
			this.treeData.forEach(function(value, index) {
				if(value[this.treeStructure.title] == this.rightClickNodeId[this.treeStructure.title]) {
					value.classtype = "二类设备";
					value.parent = "2";
				}
				if(value.classtype) {
					if(value.classtype.indexOf("一类设备") != -1) {
						$this.fistClassNum++
					}
					if(value.classtype.indexOf("二类设备") != -1) {
						$this.SecondClassNum++
					}
					if(value.classtype.indexOf("三类设备") != -1) {
						$this.ThirdClassNum++
					}
					if(value.classtype.indexOf("四类设备") != -1) {
						$this.FouthClassNum++
					}
					if(value.classtype.indexOf("待分类设备") != -1) {
						$this.OtherClassNum++
					}
				}
			}.bind(this))
			this.restTreeData()
			this.treeData = JSON.parse(JSON.stringify(this.treeData))
		},
		moveToThird() {
			let $this = this;
			this.fistClassNum = this.SecondClassNum = this.ThirdClassNum = this.FouthClassNum = this.OtherClassNum =
				0
			this.treeData.forEach(function(value, index) {
				if(value[this.treeStructure.title] == this.rightClickNodeId[this.treeStructure.title]) {
					value.classtype = "三类设备";
					value.parent = "3";
				}
				if(value.classtype) {
					if(value.classtype.indexOf("一类设备") != -1) {
						$this.fistClassNum++
					}
					if(value.classtype.indexOf("二类设备") != -1) {
						$this.SecondClassNum++
					}
					if(value.classtype.indexOf("三类设备") != -1) {
						$this.ThirdClassNum++
					}
					if(value.classtype.indexOf("四类设备") != -1) {
						$this.FouthClassNum++
					}
					if(value.classtype.indexOf("待分类设备") != -1) {
						$this.OtherClassNum++
					}
				}
			}.bind(this))
			this.restTreeData()
			this.treeData = JSON.parse(JSON.stringify(this.treeData))
		},
		moveToFourth() {
			let $this = this;
			this.fistClassNum = this.SecondClassNum = this.ThirdClassNum = this.FouthClassNum = this.OtherClassNum =
				0
			this.treeData.forEach(function(value, index) {
				if(value[this.treeStructure.title] == this.rightClickNodeId[this.treeStructure.title]) {
					value.classtype = "四类设备";
					value.parent = "4";
				}
				if(value.classtype) {
					if(value.classtype.indexOf("一类设备") != -1) {
						$this.fistClassNum++
					}
					if(value.classtype.indexOf("二类设备") != -1) {
						$this.SecondClassNum++
					}
					if(value.classtype.indexOf("三类设备") != -1) {
						$this.ThirdClassNum++
					}
					if(value.classtype.indexOf("四类设备") != -1) {
						$this.FouthClassNum++
					}
					if(value.classtype.indexOf("待分类设备") != -1) {
						$this.OtherClassNum++
					}
				}
			}.bind(this))
			this.restTreeData()
			this.treeData = JSON.parse(JSON.stringify(this.treeData))
		},
		onSelected(val) {
			this.treeSelect = val
		},
		importFile(file) {
			var wb;
			var $this = this;
			var getFileName = file.name;
			var reader = new FileReader();
			reader.onload = function(e) {
				let impdata = [];
				var data = e.target.result;
				wb = XLSX.read(data, {
					type: 'binary'
				});
				//wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
				//wb.Sheets[Sheet名]获取第一个Sheet的数据. 
				let iserror = false;
				let newTreeNode = []
				wb.SheetNames.forEach((value, index) => {
					let pk_classname = $this.comMethods.guid();
					let repeat = false;
					$this.treeData.forEach(function(v) {
						if(v.classname == value) {
							pk_classname = v.uuid;
							repeat = true;
						}
					})
					if(!repeat) {
						let treeNode = {
							uuid: pk_classname,
							parent: "5",
							classname: value,
							classtype: "待分类设备",
							ts: $this.comMethods.formatDate(1),
							dr: 0,
							operator: $this.username
						}
						newTreeNode.push(treeNode)
					}
					if(iserror) return;
					let sheetJson = XLSX.utils.sheet_to_json(wb.Sheets[value]);
					let keys = {}
					sheetJson.forEach((val, ind) => {
						Object.assign(keys, val)
					})
					sheetJson.forEach((val, ind) => {
						if(iserror) return;
						let f = {
							pk_classname: pk_classname,
							classname: value,
							checkcontent: "",
							dailycheck: "1",
							deptcheck01: "1",
							deptcheck02: "1",
							functioncheck: '1',
							free01: $this.username,
							ts: $this.comMethods.formatDate(1)
						};
						for(let key in keys) {
							if(iserror) return;
							if(key) {
								if(key.indexOf("点检内容") != -1) {
									if(val[key] && val[key].trim()) {
										f.checkcontent = val[key].trim()
									}
									else {
										let message = {
											content: "导入失败：" + value + "第" + (ind + 1) + "行，点检内容不能为空",
											duration: 0,
											closable: true
										}
										$this.$Message.error(message);
										iserror = true;
										break;
									}
								}
								if(key.indexOf("日常") != -1) {
									if(val[key]) {
										if(val[key].trim()) f.dailycheck = 1
										if(val[key].trim() == "1") f.dailycheck = 1
										if(val[key].trim() == "0") f.dailycheck = 0
									}
									else f.dailycheck = 0
								}
								if(key.indexOf("部门") != -1) {
									if(val[key]) {
										if(val[key].trim()) f.deptcheck01 = 1
										if(val[key].trim() == "1") f.deptcheck01 = 1
										if(val[key].trim() == "0") f.deptcheck01 = 0
									}
									else f.deptcheck01 = 0
								}
								if(key.indexOf("设备部") != -1) {
									if(val[key]) {
										if(val[key].trim()) f.deptcheck02 = 1
										if(val[key].trim() == "1") f.deptcheck02 = 1
										if(val[key].trim() == "0") f.deptcheck02 = 0
									}
									else f.deptcheck02 = 0
								}
								if(key.indexOf("职能") != -1) {
									if(val[key]) {
										if(val[key].trim()) f.functioncheck = 1
										if(val[key].trim() == "1") f.functioncheck = 1
										if(val[key].trim() == "0") f.functioncheck = 0
									}
									else f.functioncheck = 0
								}
							}
						}
						if(!f.checkcontent) {
							let message = {
								content: "导入失败：" + value + "内缺少“点检内容”列",
								duration: 0,
								closable: true
							}
							$this.$Message.error(message);
							iserror = true;
						}
						if(!iserror) impdata.push(f)
					})
				})
				if(!iserror) {
					$this.showLoading = true;
					$this.$ajax.post($this.path + '/json/mis_insertJsonArray', {
						tableName: 'ad_equipck_checkcontent',
						insertJsonArray: JSON.stringify(impdata)
					}).then(function(response) {
						var data = response.data;
						if(data.success) {
							$this.timedCount_importData("ad_equipck_classname", newTreeNode)
						}
						else {
							let message = {
								content: "设备点检导入失败！",
								duration: 0,
								closable: true
							}
							$this.$Message.error(message);
						}
					}).catch(function(response) {
						console.log(response)
						let message = {
							content: "设备点检导入失败，网络故障,请检查网络！",
							duration: 0,
							closable: true
						}
						$this.$Message.error(message);
					}).then(function() {
						$this.showLoading = false;
					});
				}
			};
			reader.readAsBinaryString(file);
		},
		onQuery() {
			this.$Modal.confirm({
				title: '依据条件查询获取数据',
				content: '<p>依据查询获取数据</p>',
				onOk: () => {
					this.pageNum = 1;
					this.pageRows = 10;
					this.pageTotal = 0;
					this.selectQueryButton = !this.selectQueryButton
					this.getTableData(this.pageNum, this.pageRows);
				},
				onCancel: () => {}
			});
		},
		timedCount_getTableData() {
			var t = setTimeout(this.timedCount_getTableData, 200)
			if(!this.showLoading) {
				clearTimeout(t)
				this.getTableData(this.pageNum, this.pageRows);
				this.treeSelect = this.treeSelect ? JSON.parse(JSON.stringify(this.treeSelect)) : ""
			}
		},
		timedCount_importData(tableName, insertJsonArray) {
			let $this = this;
			var t = setTimeout(function() {
				$this.timedCount_importData(tableName, insertJsonArray)
			}, 200)
			if(!this.showLoading) {
				clearTimeout(t)
				this.importData_SaveTreeData(tableName, insertJsonArray)
			}
		},
		importData_SaveTreeData(tableName, insertJsonArray) {
			let $this = this;
			$this.showLoading = true;
			$this.$ajax.post($this.path + '/json/mis_insertJsonArray', {
				tableName: tableName,
				insertJsonArray: insertJsonArray
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.$Message.success("设备点检导入成功！");
					insertJsonArray.forEach((value, index) => {
						$this.treeData.push(value)
					})
					$this.importUpdata()
				}
				else {
					let message = {
						content: "设备点检导入失败！",
						duration: 0,
						closable: true
					}
					$this.$Message.error(message);
				}
			}).catch(function(response) {
				console.log(response)
				let message = {
					content: "设备点检导入失败，网络故障,请检查网络！",
					duration: 0,
					closable: true
				}
				$this.$Message.error(message);
			}).then(function() {
				$this.showLoading = false;
			});
		},
		getTreeData() {
			var $this = this;
			if(this.showLoading) {
				return;
			}
			this.showLoading = true;
			let params = sql.getTreeData()
			this.$ajax.post(this.path + '/json/mis_getData', params).then(function(response) {
				var data = response.data;
				if(data.success) {
					var tree = data.obj;
					let defaultSelectF = -1;
					let defaultSelectS = -1;
					let defaultSelectTh = -1;
					let defaultSelectFo = -1;
					let defaultSelectO = -1;
					tree.forEach(function(value, index) {
						if(value.classtype.indexOf("一类设备") != -1) {
							value.parent = "1";
							$this.fistClassNum++;
							if(defaultSelectF == -1) {
								defaultSelectF = index;
							}
						}
						if(value.classtype.indexOf("二类设备") != -1) {
							value.parent = "2";
							$this.SecondClassNum++;
							if(defaultSelectS == -1) {
								defaultSelectS = index;
							}
						}
						if(value.classtype.indexOf("三类设备") != -1) {
							value.parent = "3";
							$this.ThirdClassNum++;
							if(defaultSelectTh == -1) {
								defaultSelectTh = index;
							}
						}
						if(value.classtype.indexOf("四类设备") != -1) {
							value.parent = "4";
							$this.FouthClassNum++;
							if(defaultSelectFo == -1) {
								defaultSelectFo = index;
							}
						}
						if(value.classtype.indexOf("待分类设备") != -1) {
							value.parent = "5";
							$this.OtherClassNum++;
							if(defaultSelectO == -1) {
								defaultSelectO = index;
							}
						}
						value.classname = value.classname
					});
					if(defaultSelectF != -1) {
						tree[defaultSelectF].selected = true
					}
					else if(defaultSelectS != -1) {
						tree[defaultSelectS].selected = true
					}
					else if(defaultSelectTh != -1) {
						tree[defaultSelectTh].selected = true
					}
					else if(defaultSelectFo != -1) {
						tree[defaultSelectFo].selected = true
					}
					else if(defaultSelectO != -1) {
						tree[defaultSelectO].selected = true
					}
					var node = [{
						uuid: "1",
						classname: "一类设备(" + $this.fistClassNum + ")",
						expand: true,
						parent: ""
					}, {
						uuid: "2",
						classname: "二类设备(" + $this.SecondClassNum + ")",
						expand: true,
						parent: ""
					}, {
						uuid: "3",
						classname: "三类设备(" + $this.ThirdClassNum + ")",
						expand: true,
						parent: ""
					}, {
						uuid: "4",
						classname: "四类设备(" + $this.FouthClassNum + ")",
						expand: true,
						parent: ""
					}, {
						uuid: "5",
						classname: "待分类设备(" + $this.OtherClassNum + ")",
						expand: true,
						parent: ""
					}]
					$this.treeData = tree.concat(node);
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
		getTableData(pageNum, pageRows) {
			var $this = this;
			if(this.showLoading) {
				return;
			}
			this.showLoading = true;
			var endNum = pageRows * pageNum + 1;
			var beginNum = (pageNum - 1) * pageRows;
			this.$ajax.get(this.path + '/json/mis_getEquipCheckPoint', {
				params: {
					pk_classname: $this.treeSelect && $this.treeSelect.uuid ? $this.treeSelect.uuid : "",
					beginNum: beginNum,
					endNum: endNum
				}
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.tableData = data.obj
					$this.pageTotal = parseInt($this.tableData[0]["maxrows"]);
				}
				else {
					$this.tableData.splice(0)
					$this.pageTotal = 0;
					$this.noDataText = data.msg.split(":")[1]
				}
			}).catch(function(response) {
				$this.$Message.error("网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		rightClickId(val) {
			this.rightClickNodeId = val
			/*	if(val[this.treeStructure.parentId] != '') {
					this.$refs.moontree.dropShow = false;
				}
				else {
					this.rightClickNodeId = val
				}*/
		},
		addTreeNode() {
			let $this = this;
			let inputVal = ""
			this.$Modal.confirm({
				title: "在“" + this.rightClickNodeId.classname + "”上新增一个设备",
				render: (h) => {
					return h('Input', {
						props: {
							value: inputVal,
							autofocus: true,
							placeholder: '填写新增设备名'
						},
						on: {
							input: (val) => {
								inputVal = val;
							}
						}
					})
				},
				onOk: () => {
					let newData = {}
					newData[$this.treeStructure.id] = $this.comMethods.guid()
					newData[$this.treeStructure.parentId] = $this.rightClickNodeId[$this.treeStructure.id]
					newData[$this.treeStructure.title] = inputVal
					let repeat = false;
					this.treeData.forEach(function(val) {
						if(val.classname == inputVal) {
							repeat = true;
						}
					})
					if(repeat) {
						let message = {
							content: "添加失败！设备名称重复,请重新添加！",
							duration: 0,
							closable: true
						}
						$this.$Message.error(message);
						return;
					}
					newData.classtype = $this.rightClickNodeId.classname.split("(")[0]
					newData.ts = this.comMethods.formatDate(1)
					newData.dr = 0
					newData.operator = this.username
					this.showLoading = true;
					let params = sql.addTreeNode(newData)
					this.$ajax.post(this.path + '/json/mis_insertJson', params).
					then(function(response) {
						var data = response.data;
						if(data.success) {
							$this.$refs.moontree.addNode(newData)
							$this.updataTreeData();
							$this.$Message.success("添加设备成功!");
						}
						else {
							console.log(data.msg)
							let message = {
								content: data.msg,
								duration: 0,
								closable: true
							}
							$this.$Message.error(message);
						}
					}).catch(function(response) {
						console.log(response)
						$this.$Message.error("网络故障,请检查网络");
					}).then(function() {
						$this.showLoading = false;
					});
				},
				onCancel: () => {}
			})
		},
		deleteTreeNode() {
			this.$Modal.confirm({
				content: "<div><p>确定删除 <span style='font-size: large;font-weight: bold;'>“" + this.rightClickNodeId
					.classname + "”</span>这个设备节点吗？</p></div>",
				onOk: () => {
					let $this = this;
					//当删除根节点时触发提示
					let success = this.$refs.moontree.deleteNode(() => {
						$this.$Message.error("有设备子节点，请先删除设备子节点")
					});
					if(success) {
						this.showLoading = true;
						this.$ajax.get(this.path + '/json/mis_update', {
							params: {
								tableName: 'ad_equipck_classname',
								set: "set dr=1 ,operator='" + $this.username + "'," + "ts= '" + $this.comMethods.formatDate(
									1) + "'",
								where: " where classname = '" + $this.rightClickNodeId.classname + "'"
							}
						}).then(function(response) {
							var data = response.data;
							if(data.success) {
								$this.$Message.success("设备节点删除成功！");
								$this.tableData.splice(0)
								$this.updataTreeData();
							}
							else {
								$this.$Message.error("设备节点删除失败！");
							}
						}).catch(function(response) {
							console.log(response)
							$this.$Message.error("设备节点删除失败，网络故障,请检查网络");
						}).then(function() {
							$this.showLoading = false;
						});
					}
				},
				onCancel: () => {}
			})
		},
		moveTreeNode() {
			this.moveTreeNodeDropShow = !this.moveTreeNodeDropShow
		},
		editTreeNode() {
			let inputVal = "";
			this.$Modal.confirm({
				title: "修改设备名称<br/> 当前设备名:“" + this.rightClickNodeId.classname + "”",
				render: (h) => {
					return h('Input', {
						props: {
							value: this.value,
							autofocus: true,
							placeholder: '填写新设备名'
						},
						on: {
							input: (val) => {
								inputVal = val;
							}
						}
					})
				},
				onOk: () => {
					let $this = this;
					inputVal = inputVal.trim();
					if(!inputVal) {
						this.$Message.error("设备名不能为空");
						return;
					}
					let repeat = false;
					this.treeData.forEach(function(val) {
						if(val.classname == inputVal) {
							repeat = true;
						}
					})
					if(repeat) {
						let message = {
							content: "设备名称更新失败,名称已存在!",
							duration: 0,
							closable: true
						}
						$this.$Message.error(message);
						return;
					}
					this.showLoading = true;
					this.$ajax.get(this.path + '/json/mis_update', {
						params: {
							tableName: 'ad_equipck_classname',
							set: " set classname= '" + inputVal + "',operator='" + $this.username + "'," + "ts='" +
								$this.comMethods.formatDate(1) + "'",
							where: "where classname='" + this.rightClickNodeId.classname + "'"
						}
					}).then(function(response) {
						var data = response.data;
						if(data.success) {
							$this.$Message.success("设备名称更新成功！");
							$this.rightClickNodeId[$this.treeStructure.title] = inputVal
							$this.$refs.moontree.editNode($this.rightClickNodeId)
						}
						else {
							console.log(data.msg)
							let message = {
								content: data.msg,
								duration: 0,
								closable: true
							}
							$this.$Message.error(message);
							//	$this.$Message.error("设备节点更新失败！");
						}
					}).catch(function(response) {
						console.log(response)
						$this.$Message.error("设备节点删除失败，网络故障,请检查网络");
					}).then(function() {
						$this.showLoading = false;
					});
				},
				onCancel: () => {}
			})
		},
		pageChange(val) {
			this.pageNum = val;
		},
		pageSizeChange(val) {
			this.pageRows = val;
		},
		saveData(value, index, triggerStatus) {
			//接收待保存的数据，及数据下标
			let $this = this;
			let valueData = JSON.parse(JSON.stringify(value))
			valueData.free01 = $this.username;
			let setUUID = this.comMethods.guid();
			//triggerStatus 1为修改 0 为新增
			let condition = {
				uuid: triggerStatus == 1 ? valueData.uuid : setUUID
			}
			if(triggerStatus == 0) {
				//增加数据时需要补全uuid和classname,classtype
				valueData.uuid = setUUID;
				/*valueData.classname = this.treeSelect.classname
				valueData.classtype = this.treeSelect.classtype*/
				valueData.pk_classname = this.treeSelect.uuid
			}
			this.showLoading = true;
			this.$ajax.get(this.path + '/json/mis_saveUpdateOrInsert', {
				params: {
					tableName: 'ad_equipck_checkcontent',
					data: JSON.stringify(valueData),
					condition: JSON.stringify(condition)
				}
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.$Message.success("保存成功！");
					$this.tableData.splice(index, triggerStatus, valueData)
				}
				else {
					//触发视图更新
					$this.tableData.reverse();
					$this.tableData.reverse();
					$this.$Message.success("保存失败！");
				}
			}).catch(function(response) {
				//触发视图更新
				$this.tableData.reverse();
				$this.tableData.reverse();
				$this.$Message.error("保存失败，网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		deleteData(value, indexArr) {
			//得到确定要删除的对象，与下标数组
			//根据下标数组，变异修改数据源
			let indArr = JSON.parse(JSON.stringify(indexArr));
			let $this = this;
			let uuidArr = [];
			if(this.showLoading) {
				return;
			}
			this.showLoading = true;
			value.forEach(function(val) {
				uuidArr.push("'" + val.uuid + "'")
			})
			let deleteWhere = uuidArr.toString();
			this.$ajax.get(this.path + '/json/mis_update', {
				params: {
					tableName: 'ad_equipck_checkcontent',
					set: "set dr=1 ,free01='" + $this.username + "'," + "ts= '" + $this.comMethods.formatDate(1) +
						"'",
					where: " where uuid in (" + deleteWhere + ")"
				}
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.$Message.success("删除成功！");
					$this.comMethods.ArrayRemoveByIndexArray($this.tableData, indArr)
				}
				else {
					$this.$Message.success("删除失败！");
				}
			}).catch(function(response) {
				$this.$Message.error("删除失败，网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		}
	},
	watch: {
		pageNum(val) {
			this.getTableData(val, this.pageRows);
		},
		pageRows(val) {
			if(!this.showLoading) this.getTableData(1, val);
		},
		treeSelect(newVal, oldVal) {
			if(newVal.selected && (oldVal.classname != newVal.classname || oldVal.uuid != newVal.uuid)) {
				this.pageNum = 1;
				this.pageRows = 10;
				this.pageTotal = 0;
				this.selectQueryButton = !this.selectQueryButton
				this.getTableData(this.pageNum, this.pageRows);
			}
		},
	},
	components: {
		mytable
	},
	data() {
		return {
			buttons: {
				add: true, 
				delete: true,
				import: true,
				edit: true,
				save: true,
				cancel: true
			},
			username: JSON.parse(Cookies.get('user')).user_name,
			selectQueryButton: false,
			split: 0.8,
			pageTotal: 0,
			tableData: [],
			tableColumn: tableColumn(this),
			pageNum: 1,
			pageRows: 10,
			showLoading: false,
			treeSelect: "",
			treeStructure: {
				id: "uuid",
				title: "classname",
				parentId: "parent"
			},
			treeData: [],
			noDataText: "",
			rightClickNodeId: "",
			moveTreeNodeDropShow: false,
			isEditing: false,
			fistClassNum: 0,
			SecondClassNum: 0,
			ThirdClassNum: 0,
			FouthClassNum: 0,
			OtherClassNum: 0
		};
	},
	computed: {
		path() {
			return this.comMethods.projectPath();
		},
		//高度控制
		mainRouterAreaHeight() {
			return this.$store.state.app.mainRouterArea.height
		}
	}
}