import mytable from '@/views/components/table/my-editTable';
import tableColumn from './tableColumn.js'
import XLSX from 'xlsx';
import sql from './sql.js';
import tables from './tables.js'
import config from './config.js'
import Cookies from 'js-cookie';
export default {
	name: 'AreaCheckReport',
	mounted: function() {
		this.getNameData()
		this.timedCount_getTableData();
		this.endTime = this.comMethods.formatDate(0)
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
				search: true,
				delete: true,
				export: true
			},
			tableData: [],
			tableColumn: tableColumn(this),
			showLoading: false,
			noDataText: "",
			openQrcode: false,
			searchDialog: false,
			conditionName: "",
			name_data: [],
			begTime: '2019-01-01',
			endTime: '',
			user: JSON.parse(Cookies.get('user'))
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
	},
	methods: {
		timedCount_getTableData() {
			var t = setTimeout(this.timedCount_getTableData, 200)
			if(!this.showLoading) {
				clearTimeout(t)
				this.getTableData()
			}
		},
		filterMethod(value, option) {
			return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
		},
		searchOk() {
			let condition = ""
			if(this.begTime) {
				condition += " and substr(r.ts,     0, 10)>='" + this.begTime + "'"
			}
			if(this.endTime) {
				condition += " and substr(r.ts,     0, 10)<='" + this.endTime + "'"
			}
			if(this.conditionName.trim()) {
				condition += " and a.name='" + this.conditionName.trim() + "'"
			}
			this.getTableData(condition)
		},
		begTimeChange(val) {
			this.begTime = this.comMethods.formatDate(val)
		},
		endTimeChange(val) {
			this.endTime = this.comMethods.formatDate(val)
		},
		onQuery() {
			this.searchDialog = true
			/*	this.$Modal.confirm({
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
				});*/
		},
		getTableData(condition) {
			var $this = this;
			this.showLoading = true;
			let params = sql.getContentData(condition)
			this.$ajax.post(this.path + config.Url.content.get, params).then(function(response) {
				var data = response.data;
				if(data.success && data.obj.length > 0) {
					$this.tableData = JSON.parse(JSON.stringify(data.obj))
					$this.tableData.forEach(function(value, index) {
						//导出时 若果字符串中有"," excel会自动下一个单元填写
						value.breakcontent = value.breakcontent.replace(/,/g, "，").replace(/，。/g, "。").replace(
							/。，/g, "。").replace(/，，/g, "。")
					})
				}
				else {
					$this.tableData.splice(0)
					$this.noDataText = data.success ? "暂无数据" : data.msg.split(":")[1]
				}
			}).catch(function(response) {
				console.log(response)
				$this.$Message.error("网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		getNameData() {
			var $this = this;
			this.showLoading = true;
			let params = sql.getNameData()
			this.$ajax.post(this.path + config.Url.content.get, params).then(function(response) {
				var data = response.data;
				if(data.success && data.obj.length > 0) {
					let arr = JSON.parse(JSON.stringify(data.obj))
					arr.forEach(function(value, index) {
						$this.name_data.push(value.name)
					})
				}
			}).catch(function(response) {
				console.log(response)
				$this.$Message.error("网络故障,请检查网络");
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
			this.showLoading = true;
			value.forEach(function(val) {
				uuidArr.push("'" + val[tables.reportTable.colum.pk] + "'")
			})
		
			let deleteWhere = uuidArr.toString();
			let params = sql.deleteContentData($this.user.pk_psnbasdoc, $this.comMethods.formatDate(1), deleteWhere);
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