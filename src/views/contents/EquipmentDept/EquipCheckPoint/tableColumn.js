import editCellRender from './cellRender.js'
const tableColumn = ($this) => {
	return [{
		title: "序号",
		type: "index",
		width: 70,
		fixed: 'left',
		align: 'center'
	}, {
		title: "日常点检",
		key: "dailycheck",
		width: 100,
		editable: true,
		editrender: editCellRender.Selecte($this),
		align: 'center'
	}, {
		title: "部门一级保养检查",
		key: "deptcheck01",
		width: 100,
		align: 'center',
		editrender: editCellRender.Selecte($this),
		editable: true
	}, {
		title: "设备部巡查",
		key: "deptcheck02",
		editrender: editCellRender.Selecte($this),
		width: 100,
		align: 'center',
		editable: true
	}, {
		title: "职能一级保养检查",
		editrender: editCellRender.Selecte($this),
		key: "functioncheck",
		width: 100,
		align: 'center',
		editable: true
	}, {
		title: "点检内容",
		key: "checkcontent",
		align: 'center',
		width: 300,
//		fixed: 'right',
		editable: true,
		rule: [{
			required: true,
			message: '点检内容不能为空'
		}]
	}, {
		title: "日期",
		key: "ts",
		editrender: editCellRender.DatePicker($this),
		align: 'center',
		width: 300,
		editable: true,
		rule: [{
			required: true,
			message: '日期不能为空'
		}, {
			validator: (rule, value, callback) => {
				let nowtime = $this.comMethods.formatDate(1);
				if(value > nowtime) callback("日期时间不能超过当前日期时间")
				else callback()
			}
		}]
	}, {
		title: " "
	}]
}
export default tableColumn