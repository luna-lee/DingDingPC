//权限表
const permission = {
	name: "ad_menu",
	colum: {
		pk: "uuid_menu", //表PK
		dr: "dr", //表删除标记
		ts: "create_time", //时间
		operator: "operator", //最近一次操作人员
		name: "menuname", //权限名称
		key: "action", //名称对应的键值
		parentid: "parentid" //父权限pk
	}
}
//角色对应权限表
const role_permission = {
	name: "ad_rolemenu",
	colum: {
		pk: "uuid_rolemenu", //表PK
		dr: "dr", //表删除标记
		ts: "create_time", //时间
		operator: "operator ", //最近一次操作人员
		pkRole: "uuid_role",
		pkPermission: "uuid_menu"
	}
}
//角色表
const role = {
	name: "ad_role",
	colum: {
		pk: "uuid_role", //表PK
		dr: "dr", //表删除标记
		ts: "create_time", //时间
		operator: "operator ", //最近一次操作人员
		name: "rolename", //角色名称 
	}
}

const role_person = {
	name: 'ad_userrole',
	colum: {
		pk: "uuid_userrole",
		pkPerson: "cuserid",//身份证
		pkRole: "uuid_role",
		operator: "operator ",
		dr: "dr",
		ts: "create_time"
	}
}
const tables = {
	permission,
	role_permission,
	role,
	role_person
}
//去空格 
export default JSON.parse(JSON.stringify(tables).replace(/\s/g, ''));