const contentTable = {
	name: "pam_equip",
	colum: [{
		col: "equip_code", //左表PK
		name: "设备编码",
		editable: true,
		align: 'center',
		width: 200,
		importNeed: true,
		qrcode_imgName: true,
		qrcode_imgName_level:1,
		qrcode_label: true,
		qrcode_label_level:1,
		qrcode_context: false,
		qrcode_context_level:0,
		sqlNeed: true,
		rule: [{
			required: true,
			message: "设备编号不能为空"
		}]
	}, {
		col: "equip_name", //左表PK
		name: "设备名称",
		editable: true,
		importNeed: true,
		sqlNeed: true,
		align: 'center',
		qrcode_imgName: true,
		qrcode_imgName_level:0,
		qrcode_label: false,
		qrcode_label_level:0,
		qrcode_context: false,
		qrcode_context_level:0,
		width: 200,
		rule: [{
			required: true,
			message: "设备名称不能为空"
		}]
	}, {
		col: "pk_equip", //表PK
		name: "设备PK",
		editable: false,//是否可以编辑
		importNeed: false,//导入时是否为必须项 
		sqlNeed: false,//查询数据库时是否为必须条件 
		qrcode_imgName: false, //二维码图片保存名
		qrcode_imgName_level:0,//显示的次序
		qrcode_label: false, //二维码图片下标签说明
		qrcode_label_level:0, //显示的次序
		qrcode_context: true, //二维码内容
		qrcode_context_level:0,//显示的次序
		align: 'center',
		width: 200,
		rule: [{
			required: false,
			message: ""
		}]
	}]
}
const tables = {
	contentTable
}
export default JSON.parse(JSON.stringify(tables).replace(/\s/g, ''));