import tables from './tables.js'
const tableColumn = ($this) => {
	return [{
		title: "序号",
		type: "index",
		width: 70,
		fixed: 'left',
		align: 'center'
	}, {
		title: "场地名称",
		key: tables.leftTable.colum.name,
		align: 'center',
		width: 100
	}, {
		title: "违章明细",
		key: "breakcontent",
		align: 'left',
		render: (h, params) => {
			let item=params.row.breakcontent
			item=item.split("。")
			let dom=[]
			item.forEach(function(value,index){
				dom.push(h('strong', value))
				dom.push(h('br'))
			}) 
			return h('div', dom);
		},
		width: 300
	}, {
		title: "备注内容",
		key: tables.reportTable.colum.remark,
		align: 'center',
		width: 300
	}, {
		title: "检查日期",
		key: "ts",
		align: 'center',
		width: 100
	}, {
		title: "检查人员",
		key: "operator",
		align: 'center',
		width: 100
	}, {
		title: " "
	}]
}
export default tableColumn