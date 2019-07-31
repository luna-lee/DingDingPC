const tableColumn = ($this) => {
	return [{
		title: "序号",
		type: "index",
		width: 60,
		align: 'center'
	}, {
		title: "帐号",
		key: "id",
		align: 'center',
		editable: true,
		align: 'center',
		rule: [{
			required: true,
			message: '帐号不能为空'
		}]
	}, {
		title: "姓名",
		key: "name",
		align: 'center',
		editable: true,
		rule: [{
			required: true,
			message: '姓名不能为空'
		}]
	}]
}
export default tableColumn