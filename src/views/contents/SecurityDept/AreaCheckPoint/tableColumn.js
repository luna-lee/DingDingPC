import editCellRender from './cellRender.js'
import tables from './tables.js'
const tableColumn = ($this) => {
	return [{
		title: "序号",
		type: "index",
		width:70,
		fixed: 'left',
		align: 'center'
	}, {
		title: "检查项目",
		key: tables.contentTable.colum.content,
		align: 'center',
		width: 500,
//		fixed: 'right',
		editable: true,
		rule: [{
			required: true,
			message: '检查项目不能为空'
		}]
	} , {
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