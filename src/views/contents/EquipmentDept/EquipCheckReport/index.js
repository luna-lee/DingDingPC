import { tableColumns, tableData } from './table2csv.js';
import weekDate from './week.js';
import Cookies from 'js-cookie';
import sql from './sql.js';
export default {
	name: 'EquipCheckReport',
	mounted: function() {
		this.mountedData()
	},
	activated: function() {},
	watch: {
		selectType(val) {
			this.timeAreaBeg = "";
			this.timeAreaEnd = "";
			this.tableData.splice(0);
			this.tableData = JSON.parse(JSON.stringify(tableData));
			this.warnMeg = ""
		}
	},
	components: {},
	data() {
		return {
			warnMeg: "",
			showLoading: false,
			tableColumns: tableColumns,
			tableData: JSON.parse(JSON.stringify(tableData)),
			selectType: "操作工日常点检",
			selectDept: "",
			Dept: [],
			checkType: [{
				value: '操作工日常点检',
				label: '操作工日常点检'
			}, {
				//部门一级保养检查
				value: '部门一级保养',
				label: '部门一级保养'
			}, { //设备部巡查
				value: '保障组巡检',
				label: '保障组巡检'
			}, { //职能一级保养检查
				value: '设备管家',
				label: '设备管家'
			}],
			typeMap: {
				"操作工日常点检": "dailycheck",
				"部门一级保养": "deptcheck01",
				"保障组巡检": "deptcheck02",
				"设备管家": "functioncheck"
			},
			timeAreaBeg: "",
			timeAreaEnd: "",
			disabledDate: {
				disabledDate(date) {
					let formatDate = function(date, fmt) {
						var init;
						try {
							if(date) {
								if(typeof date == "number" || (typeof date == "string" && date.indexOf("yyyy") != -1)) {
									init = new Date();
									fmt = date;
								}
								else init = new Date(date)
							}
							else init = new Date()
						}
						catch(e) {
							init = new Date()
						}
						if(fmt) {
							switch(fmt) {
								case 0:
									fmt = "yyyy-MM-dd";
									break;
								case 1:
									fmt = "yyyy-MM-dd HH:mm:ss";
									break;
								case 2:
									fmt = "yyyy-MM-dd HH:mm:ss.S";
									break;
							}
						}
						else {
							fmt = "yyyy-MM-dd"
						}
						var o = {
							"M+": init.getMonth() + 1, //月份 
							"d+": init.getDate(), //日 
							"H+": init.getHours(), //小时 
							"m+": init.getMinutes(), //分 
							"s+": init.getSeconds(), //秒 
							"q+": Math.floor((init.getMonth() + 3) / 3), //季度 
							"S": init.getMilliseconds() //毫秒 
						};
						if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (init.getFullYear() + "").substr(4 -
							RegExp.$1.length));
						for(var k in o)
							if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
								(o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
						return fmt;
					}
					return date && formatDate(date) > formatDate();
				}
			},
			disabledMonth: {
				disabledDate(date) {
					let formatDate = function(date, fmt) {
						var init;
						try {
							if(date) {
								if(typeof date == "number" || (typeof date == "string" && date.indexOf("yyyy") != -1)) {
									init = new Date();
									fmt = date;
								}
								else init = new Date(date)
							}
							else init = new Date()
						}
						catch(e) {
							init = new Date()
						}
						if(fmt) {
							switch(fmt) {
								case 0:
									fmt = "yyyy-MM-dd";
									break;
								case 1:
									fmt = "yyyy-MM-dd HH:mm:ss";
									break;
								case 2:
									fmt = "yyyy-MM-dd HH:mm:ss.S";
									break;
							}
						}
						else {
							fmt = "yyyy-MM-dd"
						}
						var o = {
							"M+": init.getMonth() + 1, //月份 
							"d+": init.getDate(), //日 
							"H+": init.getHours(), //小时 
							"m+": init.getMinutes(), //分 
							"s+": init.getSeconds(), //秒 
							"q+": Math.floor((init.getMonth() + 3) / 3), //季度 
							"S": init.getMilliseconds() //毫秒 
						};
						if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (init.getFullYear() + "").substr(4 -
							RegExp.$1.length));
						for(var k in o)
							if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
								(o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
						return fmt;
					}
					return date && formatDate(date).substring(0, formatDate().length - 3) > formatDate().substring(
						0, formatDate().length - 3);
				}
			}
		};
	},
	methods: {
		mountedData() {
			var $this = this;
			this.showLoading = true;
			let params = sql.getDept()
			this.$ajax.post(this.path + '/json/mis_getData', params).then(function(response) {
				var data = response.data;
				if(data.success) {
					let dept = data.obj
					$this.selectDept = dept[0].pk_deptdoc
					dept.forEach((value, index) => {
						$this.Dept.push({
							label: value.deptname,
							value: value.pk_deptdoc
						})
					})
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
		getData() {
			if(!this.timeAreaBeg || !this.timeAreaEnd) {
				this.$Message.error("请选择筛选日期");
				return
			}
			if(this.needCheckNum < 0) {
				this.$Message.error("第一个时间不得大于第二个时间");
				return
			}
			if(this.needCheckNum == 0) {
				this.$Message.error("所选日期为法定假日，请重新选择日期");
				return
			}
			var $this = this;
			this.showLoading = true;
			/*	let addOneDay = this.comMethods.formatDate(new Date(new Date(this.timeAreaEnd).getTime() + 1000 *
					60 * 60 * 24));*/
			let dayType = "day"
			if(this.selectType == "操作工日常点检") dayType = "day"
			//			else if(this.selectType == "保障组巡检") dayType = "week"
			else dayType = "month"
			let beg = this.timeAreaBeg;
			let end = this.timeAreaEnd;
			if(this.selectType == "保障组巡检") {
				beg = this.weekBeg[2];
				end = this.weekEnd[3]; //即便本周为结束也依然算在内
				/*if(this.weekEnd[3] <= this.comMethods.formatDate()) {
					end = this.weekEnd[3]
				}
				else {
					end = this.comMethods.formatDate(new Date(new Date(this.weekEnd[2]).getTime() - 1000 * 60 * 60 *
						24))
				}*/
			}
			let params = sql.getData(this.typeMap[this.selectType], beg, end, dayType, this.selectDept);
			this.$ajax.post(this.path + '/json/mis_getData', params).then(function(response) {
				var data = response.data;
				if(data.success) {
					//					console.log(JSON.stringify(data.obj[0]))
					let d = data.obj[0];
					$this.tableData.forEach((value) => {
						if(value.name == '一类设备') {
							value.num = d.equipNum01;
							value.need = $this.needCheckNum * value.num;
							value.none = value.need - d.checked_num_01;
							value.checked = d.checked_num_01;
							value.right = d.checked_num_01_right;
							value.right_v = (d.checked_num_01 != 0 ? ((d.checked_num_01_right / d.checked_num_01) *
								100).toFixed(2) : 0) + "%";
						}
						if(value.name == '二类设备') {
							value.num = d.equipNum02;
							value.need = $this.needCheckNum * value.num;
							value.none = value.need - d.checked_num_02;
							value.checked = d.checked_num_02;
							value.right = d.checked_num_02_right;
							value.right_v = (d.checked_num_02 != 0 ? ((d.checked_num_02_right / d.checked_num_02) *
								100).toFixed(2) : 0) + "%";
						}
						if(value.name == '三类设备') {
							value.num = d.equipNum03;
							value.need = $this.needCheckNum * value.num;
							value.none = value.need - d.checked_num_03;
							value.checked = d.checked_num_03;
							value.right = d.checked_num_03_right;
							value.right_v = (d.checked_num_03 != 0 ? ((d.checked_num_03_right / d.checked_num_03) *
								100).toFixed(2) : 0) + "%";
						}
						if(value.name == '四类设备') {
							value.num = d.equipNum04;
							value.need = $this.needCheckNum * value.num;
							value.none = value.need - d.checked_num_04;
							value.checked = d.checked_num_04;
							value.right = d.checked_num_04_right;
							value.right_v = (d.checked_num_04 != 0 ? ((d.checked_num_04_right / d.checked_num_04) *
								100).toFixed(2) : 0) + "%";
						}
					})
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
		exportData() {
			this.$refs.table.exportCsv({
				filename: '原始数据'
			});
		},
		onChangeTimeBeg(val) {
			this.timeAreaBeg = this.comMethods.formatDate(val);
			/*let week = weekDate.getYearWeekRange(null, null, this.timeAreaBeg)
			console.log(week)*/
		},
		onChangeTimeEnd(val) {
			let endDate = this.comMethods.formatDate(val);
			let endDateLast = this.comMethods.formatDate(weekDate.getLastDay(endDate.split("-")[0], endDate.split(
				"-")[1])); 
			this.warnMeg = "";
			switch(this.selectType) {
				case '操作工日常点检':
					this.timeAreaEnd = this.comMethods.formatDate(val);
					if(this.timeAreaEnd == this.comMethods.formatDate()) this.warnMeg = "注意：本天尚未结束！"
					break;
				case '部门一级保养':
					this.timeAreaEnd = endDateLast 
					if(this.timeAreaEnd > this.comMethods.formatDate()) this.warnMeg = "注意：本月尚未结束！"
					break;
				case '保障组巡检':
					this.timeAreaEnd = endDateLast
					if(this.timeAreaEnd > this.comMethods.formatDate()) this.warnMeg = "注意：本月尚未结束！"
					/*按周计算
					 * this.timeAreaEnd = this.comMethods.formatDate(val);
					let weekEnd = weekDate.getYearWeekRange(null, null, this.timeAreaEnd)
					if(weekEnd[3] > this.comMethods.formatDate()) {
						this.warnMeg = "注意：本周尚未结束！"
					}*/
					break;
				case '设备管家':
					this.timeAreaEnd = endDateLast
					if(this.timeAreaEnd > this.comMethods.formatDate()) this.warnMeg = "注意：本月尚未结束！"
					break;
			}
		}
	},
	computed: {
		path() {
			return this.comMethods.projectPath();
		},
		//高度控制
		mainRouterAreaHeight() {
			return this.$store.state.app.mainRouterArea.height
		},
		datas() {
			return weekDate.timeAreaDays(this.timeAreaBeg, this.timeAreaEnd) + 1;
		},
		months() {
			let monthArea = weekDate.timeAreaMonth(this.timeAreaBeg, this.timeAreaEnd);
			return monthArea < 0 ? monthArea - 1 : monthArea + 1;
		},
		weekBeg() {
			return weekDate.getYearWeekRange(null, null, this.timeAreaBeg);
		},
		weekEnd() {
			return weekDate.getYearWeekRange(null, null, this.timeAreaEnd);
		},
		needCheckNum() {
			if(!this.timeAreaBeg || !this.timeAreaEnd) return 0;
			let sundays = 0
			if(this.timeAreaBeg.substring(0, 4) < this.timeAreaEnd.substring(0, 4)) {
				//				let yearNum = this.timeAreaEnd.substring(0, 4) - this.timeAreaBeg.substring(0, 4);
				let yearBeg = this.timeAreaBeg.substring(0, 4);
				let yearEnd = this.timeAreaEnd.substring(0, 4);
				for(; yearBeg <= yearEnd; yearBeg++) {
					let lastWeekArea = [];
					if(this.timeAreaBeg.substring(0, 4) == yearBeg) {
						lastWeekArea = weekDate.getYearWeekRange(null, null, yearBeg + "-12-31")
						if(lastWeekArea.indexOf((yearBeg + 1) + "-01-01") != -1) {
							sundays += lastWeekArea[1] - this.weekBeg[1]
						}
						else {
							sundays += lastWeekArea[1] - this.weekBeg[1] + 1
						}
					}
					else if(this.timeAreaEnd.substring(0, 4) == yearBeg) {
						sundays += this.weekEnd[1] - 1
					}
					else {
						lastWeekArea = weekDate.getYearWeekRange(null, null, yearBeg + "-12-31")
						if(lastWeekArea.indexOf((yearBeg + 1) + "-01-01") != -1) {
							sundays += lastWeekArea[1]
						}
						else {
							sundays += lastWeekArea[1] + 1
						}
					}
				}
			}
			if(this.timeAreaBeg.substring(0, 4) > this.timeAreaEnd.substring(0, 4)) {
				return -1
			}
			if(this.timeAreaBeg.substring(0, 4) == this.timeAreaEnd.substring(0, 4)) {
				sundays = this.weekEnd[1] - this.weekBeg[1]
				if(sundays < 0) sundays = -2
			}
			switch(this.selectType) {
				case '操作工日常点检':
					if(this.weekEnd[3] == this.timeAreaEnd) {
						sundays++
					}
					if(this.datas <= 0) return -1
					return this.datas - sundays
					break;
				case '部门一级保养':
					return this.months
					break;
				case '保障组巡检':
					/*if(this.weekEnd[3] <= this.comMethods.formatDate()) {
						
					}*/
					/*按周计算
					 * sundays++
					return sundays*/
					return this.months
					break;
				case '设备管家':
					return this.months
					break;
			}
		}
	}
}