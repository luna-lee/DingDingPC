import mytable from '@/views/components/table/my-editTable';
import tableColumn from './tableColumn.js'
import XLSX from 'xlsx';
import Cookies from 'js-cookie';
import sql from './sql.js';
import tables from './tables.js'
import config from './config.js'
import QRCode from 'qrcode'
export default {
	name: 'AreaCheckPoint',
	mounted: function() {
		this.getTreeData();
		this.timedCount_getTableData();
	},
	activated: function() {},
	components: {
		mytable
	},
	data() {
		return {
			tables: tables,
			config: config,
			buttons: {
				add: true,
				search: false,
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
				id: tables.leftTable.colum.pk,
				title: tables.leftTable.colum.name,
				parentId: tables.leftTable.colum.parentId
			},
			treeData: [],
			noDataText: "",
			rightClickNodeId: "",
			AreaTotal: 0,
			isEditing: false,
			openQrcode: false
		};
	},
	watch: {
		pageNum(val) {
			this.getTableData(val, this.pageRows);
		},
		pageRows(val) {
			if(!this.showLoading) this.getTableData(1, val);
		},
		treeSelect(newVal, oldVal) {
			if(newVal.selected && (oldVal[this.treeStructure.title] != newVal[this.treeStructure.title] ||
					oldVal[this.treeStructure.id] != newVal[this.treeStructure.id])) {
				this.pageNum = 1;
				this.pageRows = 10;
				this.pageTotal = 0;
				this.selectQueryButton = !this.selectQueryButton
				this.getTableData(this.pageNum, this.pageRows);
			}
		},
	},
	computed: {
		path() {
			return this.comMethods.projectPath();
		},
		//高度控制
		mainRouterAreaHeight() {
			return this.$store.state.app.mainRouterArea.height
		}
	},
	methods: {
		onEditing(val) {
			this.isEditing = val
		},
		updataTreeData() {
			let $this = this;
			if(config.treeNode.need) {
				this.AreaTotal = this.treeData.length - 1 //此处包含根节点，需要减一
				this.treeData.forEach(function(value, index) {
					if(value[$this.treeStructure.parentId] == config.treeNode.rootNode.parentId) {
						value[$this.treeStructure.title] = config.treeNode.rootNode.title + "(" + $this.AreaTotal +
							")"
					}
				})
			}
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
					let addTreeNodePk = $this.comMethods.guid();
					let repeat = false;
					$this.treeData.forEach(function(v) {
						if(v[$this.treeStructure.title] == value) {
							addTreeNodePk = v[tables.leftTable.colum.pk]
							repeat = true;
						}
					})
					if(!repeat) {
						let addTreeNode = {}
						addTreeNode[tables.leftTable.colum.pk] = addTreeNodePk
						addTreeNode[tables.leftTable.colum.dr] = 0
						addTreeNode[tables.leftTable.colum.name] = value
						addTreeNode[tables.leftTable.colum.ts] = $this.comMethods.formatDate(1)
						addTreeNode[tables.leftTable.colum.operator] = $this.username
						addTreeNode[tables.leftTable.colum.parentId] = config.treeNode.rootNode.id
						newTreeNode.push(addTreeNode)
					}
					if(iserror) return;
					let sheetJson = XLSX.utils.sheet_to_json(wb.Sheets[value]);
					let keys = {}
					sheetJson.forEach((val, ind) => {
						Object.assign(keys, val)
					})
					sheetJson.forEach((val, ind) => {
						if(iserror) return;
						let item = {};
						item[tables.contentTable.colum.left_pk] = addTreeNodePk;
						item[tables.contentTable.colum.content] = "";
						item[tables.contentTable.colum.operator] = $this.username;
						item[tables.contentTable.colum.ts] = $this.comMethods.formatDate(1);
						for(let key in keys) {
							if(iserror) return;
							if(key) {
								if(key.indexOf("检查项目") != -1) {
									if(val[key] && val[key].trim()) {
										item[tables.contentTable.colum.content] = val[key].trim()
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
							}
						}
						if(!item[tables.contentTable.colum.content]) {
							let message = {
								content: "导入失败：" + value + "内缺少“点检内容”列",
								duration: 0,
								closable: true
							}
							$this.$Message.error(message);
							iserror = true;
						}
						if(!iserror) impdata.push(item)
					})
				})
				if(!iserror) {
					$this.showLoading = true;
					let params = sql.importContentData(impdata)
					$this.$ajax.post($this.path + config.Url.content.importSave, params).then(function(response) {
						var data = response.data;
						if(data.success) {
							$this.timedCount_importData(newTreeNode)
						}
						else {
							let message = {
								content: "" + config.comName.name + "点检导入失败！",
								duration: 0,
								closable: true
							}
							$this.$Message.error(message);
						}
					}).catch(function(response) {
						console.log(response)
						let message = {
							content: "" + config.comName.name + "点检导入失败，网络故障,请检查网络！",
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
		timedCount_importData(insertJsonArray) {
			let $this = this;
			var t = setTimeout(function() {
				$this.timedCount_importData(insertJsonArray)
			}, 200)
			if(!this.showLoading) {
				clearTimeout(t)
				this.importData_SaveTreeData(insertJsonArray)
			}
		},
		importData_SaveTreeData(insertJsonArray) {
			let $this = this;
			$this.showLoading = true;
			let params = sql.importTreeData(insertJsonArray)
			$this.$ajax.post($this.path + config.Url.treeNode.importSave, params).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.$Message.success("" + config.comName.name + "点检导入成功！");
					insertJsonArray.forEach((value, index) => {
						$this.treeData.push(value)
					})
					$this.updataTreeData()
				}
				else {
					let message = {
						content: "" + config.comName.name + "点检导入失败！",
						duration: 0,
						closable: true
					}
					$this.$Message.error(message);
				}
			}).catch(function(response) {
				console.log(response)
				let message = {
					content: "" + config.comName.name + "点检导入失败，网络故障,请检查网络！",
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
			$this.AreaTotal = 0
			this.$ajax.post(this.path + config.Url.treeNode.get, params).then(function(response) {
				var data = response.data;
				if(data.success) {
					var tree = data.obj;
					tree.forEach(function(value, index) {
						if(index == 0) value.selected = true;
						if(config.treeNode.need) {
							value[$this.treeStructure.parentId] = config.treeNode.rootNode.id;
						}
						$this.AreaTotal++;
					});
					var item = {}
					item[$this.treeStructure.parentId] = config.treeNode.rootNode.parentId
					item[$this.treeStructure.id] = config.treeNode.rootNode.id
					item[$this.treeStructure.title] = config.treeNode.rootNode.title + "(" + $this.AreaTotal +
						")"
					item.expand = true
					var node = [];
					if(config.treeNode.need) {
						node.push(item)
					}
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
			let leftPk = this.treeSelect && this.treeSelect[this.treeStructure.id] ? this.treeSelect[this.treeStructure
				.id] : "";
			let params = sql.getContentData(leftPk, beginNum, endNum)
			this.$ajax.post(this.path + config.Url.content.get, params).then(function(response) {
				var data = response.data;
				if(data.success && data.obj.length > 0) {
					$this.tableData = data.obj
					$this.pageTotal = parseInt($this.tableData[0]["maxrows"]);
				}
				else {
					$this.tableData.splice(0)
					$this.pageTotal = 0;
					$this.noDataText = data.success ? "数据尚未录入" : data.msg.split(":")[1]
				}
			}).catch(function(response) {
				console.log(response)
				$this.$Message.error("网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		rightClickId(val) {
			this.rightClickNodeId = val
		},
		addTreeNode() {
			let $this = this;
			let inputVal = ""
			this.$Modal.confirm({
				title: "在“" + this.rightClickNodeId[this.treeStructure.title] + "”上新增一个" + config.comName.name +
					"",
				render: (h) => {
					return h('Input', {
						props: {
							value: inputVal,
							autofocus: true,
							placeholder: '填写新增' + config.comName.name + '名'
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
					let $this = this
					newData[$this.treeStructure.id] = $this.comMethods.guid()
					newData[$this.treeStructure.parentId] = $this.rightClickNodeId[$this.treeStructure.id]
					newData[$this.treeStructure.title] = inputVal
					let repeat = false;
					this.treeData.forEach(function(val) {
						if(val[$this.treeStructure.title] == inputVal) {
							repeat = true;
						}
					})
					if(repeat) {
						let message = {
							content: "添加失败！" + config.comName.name + "名称重复,请重新添加！",
							duration: 0,
							closable: true
						}
						$this.$Message.error(message);
						return;
					}
					newData[tables.leftTable.colum.ts] = this.comMethods.formatDate(1)
					newData[tables.leftTable.colum.dr] = 0
					newData[tables.leftTable.colum.operator] = this.username
					this.showLoading = true;
					let params = sql.addTreeNode(newData)
					this.$ajax.post(this.path + config.Url.treeNode.add, params).
					then(function(response) {
						var data = response.data;
						if(data.success) {
							$this.$refs.moontree.addNode(newData)
							$this.updataTreeData();
							$this.$Message.success("添加" + config.comName.name + "成功!");
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
				content: "<div><p>确定删除 <span style='font-size: large;font-weight: bold;'>“" + this.rightClickNodeId[
					this.treeStructure.title] + "”</span>这个" + config.comName.name + "节点吗？</p></div>",
				onOk: () => {
					let $this = this;
					//当删除根节点时触发提示
					let success = this.$refs.moontree.deleteNode(() => {
						$this.$Message.error("有" + config.comName.name + "子节点，请先删除" + config.comName.name +
							"子节点")
					});
					if(success) {
						this.showLoading = true;
						let params = sql.deleteTreeNode(this.username, this.comMethods.formatDate(1), this.rightClickNodeId[
							this.treeStructure.id])
						this.$ajax.post(this.path + config.Url.treeNode.delete, params).then(function(response) {
							var data = response.data;
							if(data.success) {
								$this.$Message.success(config.comName.name + "节点删除成功！");
								$this.tableData.splice(0)
								$this.updataTreeData();
							}
							else {
								$this.$Message.error(config.comName.name + "节点删除失败！");
							}
						}).catch(function(response) {
							console.log(response)
							$this.$Message.error(config.comName.name + "节点删除失败，网络故障,请检查网络");
						}).then(function() {
							$this.showLoading = false;
						});
					}
				},
				onCancel: () => {}
			})
		},
		downloadIamge(imgsrc, name) { //下载图片地址和图片名
			var image = new Image();
			// 解决跨域 Canvas 污染问题
			image.setAttribute("crossOrigin", "anonymous");
			image.onload = function() {
				var canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				var context = canvas.getContext("2d");
				context.drawImage(image, 0, 0, image.width, image.height);
				var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
				var a = document.createElement("a"); // 生成一个a元素
				var event = new MouseEvent("click"); // 创建一个单击事件
				a.download = name || "photo"; // 设置图片名称
				a.href = url; // 将生成的URL设置为a.href属性
				a.dispatchEvent(event); // 触发a的单击事件
			};
			image.src = imgsrc;
		},
		useqrcode() {
			let canvas = this.$refs.canva;
			let $this = this;
			let context = $this.rightClickNodeId[$this.treeStructure.id];
			let text = $this.rightClickNodeId[$this.treeStructure.title]
			//方法一
			/*QRCode.toCanvas(canvas, $this.rightClickNodeId[$this.treeStructure.id], function(error) {
				if(error) console.error(error)
				console.log('success!');
				var ctx = canvas.getContext("2d")
				ctx.font = "10px 黑体";
				ctx.fillStyle = "Blue";
				ctx.fillText($this.rightClickNodeId[$this.treeStructure.title], 25, canvas.height - 5);
			})*/
			//方法二
			QRCode.toDataURL(context).then(url => {
				var img = new Image();
				img.src = url;
				canvas.width = 200
				canvas.height = 200
				img.onload = function() {
					var ctx = canvas.getContext("2d")
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					ctx.font = "15px 黑体";
					ctx.fillText(text, (canvas.width - ctx.measureText(text).width) / 2, canvas.height - 5);
					//				 images.src = canvas.toDataURL('image/jpeg');
					//				 console.log(canvas.toDataURL('image/jpeg'))
				}
			}).catch(err => {
				console.error(err)
			})
		},
		qrcodeNode() {
			this.useqrcode();
			this.openQrcode = true
		},
		qrcodeOk() {
			let canvas = this.$refs.canva;
			this.downloadIamge(canvas.toDataURL('image/jpeg'), this.rightClickNodeId[this.treeStructure.title])
		},
		editTreeNode() {
			let inputVal = "";
			this.$Modal.confirm({
				title: "修改" + config.comName.name + "名称<br/> 当前" + config.comName.name + "名:“" + this.rightClickNodeId[
					this.treeStructure.title] + "”",
				render: (h) => {
					return h('Input', {
						props: {
							value: this.value,
							autofocus: true,
							placeholder: '填写新' + config.comName.name + '名'
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
						this.$Message.error("" + config.comName.name + "名不能为空");
						return;
					}
					let repeat = false;
					this.treeData.forEach(function(val) {
						if(val[$this.treeStructure.title] == inputVal) {
							repeat = true;
						}
					})
					if(repeat) {
						let message = {
							content: "" + config.comName.name + "名称更新失败,名称已存在!",
							duration: 0,
							closable: true
						}
						$this.$Message.error(message);
						return;
					}
					this.showLoading = true;
					let params = sql.editTreeNode(inputVal, $this.username, this.comMethods.formatDate(1), this
						.rightClickNodeId[this.treeStructure.id])
					this.$ajax.post(this.path + config.Url.treeNode.edit, params).then(function(response) {
						var data = response.data;
						if(data.success) {
							$this.$Message.success("" + config.comName.name + "名称更新成功！");
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
							//	$this.$Message.error(""+config.comName.name+"节点更新失败！");
						}
					}).catch(function(response) {
						console.log(response)
						$this.$Message.error("" + config.comName.name + "节点删除失败，网络故障,请检查网络");
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
			valueData[tables.contentTable.colum.operator] = $this.username;
			let setUUID = this.comMethods.guid();
			//triggerStatus 1为修改 0 为新增
			let condition = {}
			condition[tables.contentTable.colum.pk] = triggerStatus == 1 ? valueData[
				tables.contentTable.colum.pk] : setUUID
			//triggerStatus = 0 为新增
			if(triggerStatus == 0) {
				valueData[tables.contentTable.colum.pk] = setUUID;
				valueData[tables.contentTable.colum.left_pk] = this.treeSelect[tables.leftTable.colum.pk]
			}
			this.showLoading = true;
			let params = sql.saveContentData(valueData, condition)
			this.$ajax.post(this.path + config.Url.content.save, params).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.$Message.success("保存成功！");
					$this.tableData.splice(index, triggerStatus, valueData)
				}
				else {
					//触发视图更新
					$this.tableData = JSON.parse(JSON.stringify($this.tableData))
					$this.$Message.success("保存失败！");
				}
			}).catch(function(response) {
				//触发视图更新
				$this.tableData = JSON.parse(JSON.stringify($this.tableData))
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
				uuidArr.push("'" + val[tables.contentTable.colum.pk] + "'")
			})
			let deleteWhere = uuidArr.toString();
			let params = sql.deleteContentData($this.username, $this.comMethods.formatDate(1), deleteWhere);
			this.$ajax.post(this.path + config.Url.content.delete, params).then(function(response) {
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
	}
}