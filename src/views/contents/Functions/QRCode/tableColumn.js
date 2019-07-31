import editCellRender from './cellRender.js'
import tables from './tables.js'
const tableColumn = ($this) => {
	
	let cols = tables.contentTable.colum

	let arr = [{
		title: "序号",
		type: "index",
		width: 70,
		fixed: 'left',
		align: 'center'
	}]
	cols.forEach(function(value, index) {
		let item = {
			title: value.name,
			key: value.col,
			align: value.align,
			width: value.width,
			editable: value.editable,
			rule: value.rule
		}
		arr.push(item)
	});
	arr.push({
		title: " "
	})
	return arr
}
export default tableColumn