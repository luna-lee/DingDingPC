import tables from '../tables/tables.js'
/* 清除测试数据
select * from ad_role where rolename like '测试%'; 

select * from ad_rolemenu where uuid_role in (select r.uuid_role from ad_role r where rolename like '测试%') ;

select * from ad_menu where type=0 and menuname='test' or menuname='a';

select * from ad_userrole where  uuid_role in (select r.uuid_role from ad_role r where rolename like '测试%') ; 

delete from ad_role where rolename like '测试%';  
*/
export default {
	//获取所有角色列表
	getAllRoleSql() {
		return {
			select: '*',
			from: "{" + tables.role.name + "}",
			where: " where dr=0   and uuid_role in ( select  uuid_role from ad_rolemenu where dr=0 and uuid_menu in (select uuid_menu from ad_menu where dr=0 and menulevel!=0 and  parentid  is  not null and type=0 ) )"
		}
	},
	//获取所有权限列表
	getAllPermissionSql() {
		return {
			select: '*',
			from: "{" + tables.permission.name + "}",
			where: " where dr=0 and type=0 "
		}
	},
	//根据角色获取权限列表
	getPermissionByRoleSql(currentRole) {
		return {
			select: '*',
			from: "{" + tables.permission.name + "}",
			where: " where dr=0 and type=0 and " + tables.permission.colum.pk + " in (select " + tables.role_permission
				.colum.pkPermission + " from " + tables.role_permission.name + " where  dr=0 and " + tables.role_permission
				.colum.pkRole + "='" + currentRole + "')"
		}
	},
	//根据帐号获取当前所拥有的角色
	getRoleByCode(code) {
		return {
			select: " f.rolename ,a.user_name, g.uuid_userrole",
			from: "{ad_userrole g} ,{ad_role f},{sm_user a} ",
			where: " where g.dr=0 and f.dr=0 and a.cuserid= g.cuserid and  g.uuid_role= f.uuid_role and  a.user_code='" +
				code + "'"
		}
	},
	//分配权限 ~根据员工帐号获取pk,用于判断更新或添加
	getPersonPkByCode(code) {
		return "$(select cuserid from sm_user where  user_code='" + code + "')"
	}
}