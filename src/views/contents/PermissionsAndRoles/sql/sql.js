import tables from '../tables/tables.js'
/*清除测试数据
select * from ad_mis_role where name like '测试%' ;
select * from ad_mis_permission where name like '测试%';
select * from ad_mis_role_permission where pk_role in (select pk_role from ad_mis_role where name like '测试%' );
select * from ad_mis_role_person where pk_role in (select pk_role from ad_mis_role where name like '测试%' );

delete from ad_mis_role where name like '测试%' ;
*/
export default {
	//获取所有角色列表
	getAllRoleSql() {
		return {
			select: '*',
			from: "{" + tables.role.name + "}",
			where: " where dr=0 order by ts "
		}
	},
	//获取所有权限列表
	getAllPermissionSql() {
		return {
			select: '*',
			from: "{" + tables.permission.name + "}",
			where: " where dr=0  order by ts "
		}
	},
	//根据角色获取权限列表
	getPermissionByRoleSql(currentRole) {
		return {
			select: '*',
			from: "{" + tables.permission.name + "}",
			where: " where dr=0  and " + tables.permission.colum.pk + " in (select " + tables.role_permission
				.colum.pkPermission + " from " + tables.role_permission.name + " where  dr=0 and " + tables.role_permission
				.colum.pkRole + "='" + currentRole + "') order by ts"
		}
	},
	//根据帐号获取当前所拥有的角色
	getRoleByCode(code) {
		return {
			select: "c.ssnum, c.pk_psnbasdoc,c.mobile,a.cuserid ,a.user_name,a.user_code,a.user_password ,d.pk_psndoc,d.groupdef10, d.pk_deptdoc as pk_deptdoc ,e.deptname,f.*,g.pk_person,g.uuid",
			from: "{sm_user a} ,{sm_userandclerk b}, {bd_psnbasdoc c},{bd_psndoc d},{bd_deptdoc e},{ad_mis_role f},{ad_mis_role_person g}",
			where: " where  f.dr=0 and g.dr=0 and f.pk_role=g.pk_role and g.pk_person=c.ssnum and a.cuserid=b.userid and c.pk_psnbasdoc=b.pk_psndoc and d.pk_psnbasdoc=c.pk_psnbasdoc  and  instr(trim(a.user_name),trim(c.psnname))>0  and   d.pk_deptdoc=e.pk_deptdoc  and d.dr !=1 and d.psnclscope in (0,5) and  a.user_code='" +
				code + "'"
		}
	},
	//分配权限 ~根据员工帐号获取pk,用于判断更新或添加
	getPersonPkByCode(code) {
		let getICD = "$(select c.ssnum from sm_user a,sm_userandclerk b,bd_psnbasdoc c,bd_psndoc d";
		getICD +=
			" where a.cuserid=b.userid and c.pk_psnbasdoc=b.pk_psndoc and d.pk_psnbasdoc=c.pk_psnbasdoc";
		getICD +=
			"  and rownum=1 and instr(trim(a.user_name),trim(c.psnname))>0  and d.dr !=1 and d.psnclscope in (0,5) and  a.user_code='" +
			code + "')";
		return getICD
	}
}