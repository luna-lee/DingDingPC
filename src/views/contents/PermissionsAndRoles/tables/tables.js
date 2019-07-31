//权限表
const permission = {
	name: "ad_mis_permission",
	colum: {
		pk: "pk_pms", //表PK
		dr: "dr", //表删除标记
		ts: "ts", //时间
		operator: "operator", //最近一次操作人员
		name: "name", //权限名称
		key: "key", //名称对应的键值
		parentid: "parentid" //父权限pk
	}
}
//角色对应权限表
const role_permission = {
	name: "ad_mis_role_permission",
	colum: {
		pk: "uuid", //表PK
		dr: "dr", //表删除标记
		ts: "ts", //时间
		operator: "operator ", //最近一次操作人员
		pkRole: "pk_role",
		pkPermission: "pk_pms"
	}
}
//角色表
const role = {
	name: "ad_mis_role",
	colum: {
		pk: "pk_role", //表PK
		dr: "dr", //表删除标记
		ts: "ts", //时间
		operator: "operator ", //最近一次操作人员
		name: "name", //角色名称 
	}
}
const role_person = {
	name: 'ad_mis_role_person',
	colum: {
		pk: "uuid",
		pkPerson: "pk_person",//身份证
		pkRole: "pk_role",
		operator: "operator ",
		dr: "dr",
		ts: "ts"
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