import mytable from '@/views/components/table/my-editTable';
import tableColumn from './tableColumn.js'
import XLSX from 'xlsx';
import Cookies from 'js-cookie';
import sql from './sql.js';
import tables from './tables.js'
import config from './config.js'
import QRCode from 'qrcode'
export default {
	name: 'QRCode',
	mounted: function() {},
	activated: function() {},
	components: {
		mytable
	},
	data() {
		return {
			tables: tables,
			buttons: {
				add: true,
				delete: true,
				import: true,
				edit: true,
				save: true,
				cancel: true,
				free01: {
					status: true,
					name: "生成并下载二维码",
					icon: "md-qr-scanner" ,
					color: "black"
				}
			},
			showLoading: false,
			noDataText: "",
			tableData: [],
			tableColumn: tableColumn(this),
			tableDataCode: this.comMethods.guid(),
			split: 0.8,
			isEditing: false, //是否处于编辑状态
			getSaveStatus: false
		};
	},
	watch: {},
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
		onFree01() {
			this.qRCode()
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
				wb.SheetNames.forEach((value, index) => {
					if(iserror) return;
					let sheetJson = XLSX.utils.sheet_to_json(wb.Sheets[value]);
					let cols = tables.contentTable.colum
					let keys = {}
					sheetJson.forEach((val, ind) => {
						Object.assign(keys, val)
					})
					sheetJson.forEach((val, ind) => {
						if(iserror) return;
						let item = {};
						for(let key in keys) {
							if(iserror) return;
							if(key) {
								cols.forEach(function(cols_value, cols_index) {
									if(cols_value.importNeed && key.indexOf(cols_value.name) != -1) {
										if(val[key] && val[key].trim()) {
											item[cols_value.col] = val[key].trim()
										}
										else {
											let message = {
												content: "导入失败：" + value + "第" + (ind + 1) + "行，点检内容不能为空",
												duration: 0,
												closable: true
											}
											$this.$Message.error(message);
											iserror = true;
										}
									}
								});
							}
						}
						cols.forEach(function(cols_value, cols_index) {
							if(cols_value.importNeed) {
								if(!item[cols_value.col]) {
									let message = {
										content: "导入失败：" + value + "内缺少“" + cols_value.name + "”列",
										duration: 0,
										closable: true
									}
									$this.$Message.error(message);
									iserror = true;
								}
							}
						});
						if(!iserror) impdata.push(item)
					})
				})
				//				$this.tableData = impdata.concat($this.tableData) 
				if(!iserror) {
					$this.getData(impdata)
				}
			};
			reader.readAsBinaryString(file);
		},
		getData(impdata, status, index, triggerStatus) {
			let $this = this;
			$this.showLoading = true;
			let params = sql.getData(impdata)
			$this.$ajax.post($this.path + config.Url.content.get, params).then(function(response) {
				var data = response.data;
				if(data.success) {
					if(status && status == "save") {
						//						$this.tableData = data.obj.concat($this.tableData)
						if(data.obj.length > 0) {
							Object.assign(impdata[0], data.obj[0])
							$this.tableData.splice(index, triggerStatus, impdata[0])
						}
						else {
							//触发视图更新
							$this.tableData = JSON.parse(JSON.stringify($this.tableData))
						}
					}
					else {
						$this.tableData = data.obj.concat($this.tableData)
					}
					impdata.forEach(function(value, index) {
						let flage = true;
						for(let key in value) {
							let inflage = false;
							$this.tableData.forEach(function(val, ind) {
								if((val[key] || val[key] == "") && val[key] == value[key]) inflage = true;
							})
							flage = flage && inflage
						}
						console.log(flage)
						if(!flage) {
							let str = "Execl表第" + (index + 1) + "行，数据错误，系统找不到对应数据！"
							if(status && status == "save") {
								str = "新增数据错误！未能在数据库中找到对应的数据"
							}
							let message = {
								content: str,
								duration: 0,
								closable: true
							}
							$this.$Message.error(message);
						}
					})
				}
				else {
					let message = {
						content: "导入失败！",
						duration: 0,
						closable: true
					}
					$this.$Message.error(message);
				}
			}).catch(function(response) {
				console.log(response)
				let message = {
					content: "导入失败，网络故障,请检查网络！",
					duration: 0,
					closable: true
				}
				$this.$Message.error(message);
			}).then(function() {
				$this.showLoading = false;
			});
		},
		saveData(value, index, triggerStatus) {
			console.log(value)
			//接收待保存的数据，数据下标,和保存状态(修改-1,新增add-0)
			let $this = this;
			let valueData = JSON.parse(JSON.stringify(value))
			let newData = {}
			for(let key in valueData) {
				let cols = tables.contentTable.colum
				cols.forEach(function(cols_value, cols_index) {
					if(cols_value.col == key && cols_value.importNeed) {
						newData[key] = valueData[key]
					}
				});
			}
			let arr = []
			arr.push(valueData)
			this.getData(arr, "save", index, triggerStatus)
			//			$this.tableData.splice(index, triggerStatus, valueData)
		},
		deleteData() {},
		onEditing(val) {
			this.isEditing = val
		},
		qRCode() {
			let $this = this;
			let cols = tables.contentTable.colum
			let qrcode_imgName = []
			let qrcode_label = []
			let qrcode_context = []
			cols.forEach(function(cols_value, cols_index) {
				if(cols_value.qrcode_imgName) {
					qrcode_imgName.splice(cols_value.qrcode_imgName_level, 0, cols_value.col)
				}
				if(cols_value.qrcode_label) {
					qrcode_label.splice(cols_value.qrcode_label_level, 0, cols_value.col)
				}
				if(cols_value.qrcode_context) {
					qrcode_context.splice(cols_value.qrcode_context_level, 0, cols_value.col)
				}
			});
			let qrcode = []
			this.tableData.forEach(function(value, index) {
				let item = {}
				qrcode_imgName.forEach(function(col, ind) {
					let name = item.imgName
					item.imgName = name ? name + "," + value[col] : value[col]
				})
				qrcode_label.forEach(function(col, ind) {
					let label = item.label
					item.label = label ? label + "," + value[col] : value[col]
				})
				qrcode_context.forEach(function(col, ind) {
					let context = item.context
					item.context = context ? context + "," + value[col] : value[col]
				})
				qrcode.push(item)
			});
			qrcode.forEach(function(value, index) {
				$this.useqrcode(value.context, value.label, value.imgName)
			});
		},
		useqrcode(context, label, imgName) {
			let $this = this;
			let canvas = document.createElement("canvas");
			let a = document.createElement("a"); // 生成一个a元素
			let event = new MouseEvent("click"); // 创建一个单击事件
			a.download = imgName || "photo"; // 设置图片名称
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
					ctx.fillText(label, (canvas.width - ctx.measureText(label).width) / 2, canvas.height - 5);
					//				 images.src = canvas.toDataURL('image/jpeg');
					//				 console.log(canvas.toDataURL('image/jpeg'))
					var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
					a.href = url; // 将生成的URL设置为a.href属性
					a.dispatchEvent(event); // 触发a的单击事件
				}
			}).catch(err => {
				console.error(err)
			})
		}
	}
}