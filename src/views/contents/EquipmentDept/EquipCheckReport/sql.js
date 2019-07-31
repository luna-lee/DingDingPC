var baseCheckedSql = function(checkStatus, begTime, endTime, dept, dayType, classsType, asName,
	isRight) {
	let sql = "$(select count(*)";
	sql +=
		"from (select * from ad_equipck_d a where  a.pk_equip in(select p.pk_equip from pam_equip p  where  p.pk_used_status = (select pk_status from pam_status where status_name='在用') and  p.pk_mandept = '" +
		dept +
		"' and equip_name in ( select   distinct(classname)  from   ad_equipck_classname c  where   c.classtype='" +
		classsType + "'     and c.dr=0  )) and   a.ck4sstatus='" + checkStatus + "' ";
	sql += " and to_char(a.ckdatetime,'yyyy-mm-dd') >= '" + begTime + "'";
	sql += " and to_char(a.ckdatetime,'yyyy-mm-dd') <= '" + endTime + "'";
	sql += "order by ckcpstatus, pk_equip, to_char(ckdatetime,'yyyy-mm-dd') desc ) t ";
	if(isRight) sql += "where t.ckstatus ='[]' and  rownum is not null and t.ckdatetime =";
	else sql += "where   rownum is not null and t.ckdatetime =";
	sql +=
		"(select  Max(e.ckdatetime) from (select * from ad_equipck_d a where  a.pk_equip in(select p.pk_equip from pam_equip p where p.pk_used_status = (select pk_status from pam_status where status_name='在用') and  p.pk_mandept = '" +
		dept +
		"' and equip_name in ( select   distinct(classname)  from   ad_equipck_classname c  where   c.classtype='" +
		classsType + "'     and c.dr=0  ) ) and   a.ck4sstatus='" + checkStatus + "' ";
	sql += " and to_char(a.ckdatetime,'yyyy-mm-dd') >= '" + begTime + "'";
	sql += " and to_char(a.ckdatetime,'yyyy-mm-dd') <= '" + endTime + "'";
	sql +=
		"order by ckcpstatus, pk_equip, to_char(ckdatetime,'yyyy-mm-dd') desc )  e  where  e.pk_equip=t.pk_equip and to_char(e.ckdatetime,'" +
		dayType + "')=to_char(t.ckdatetime,'" + dayType + "'))";
	sql += ")  as " + asName;
	return sql;
}
var baseNumSql = function(dept, classsType, asName) {
	let sql = "$(select  count(*)  from  pam_equip p where ";
	sql +=
		"p.pk_used_status = (select pk_status from pam_status where status_name='在用' )  and p.pk_mandept='" +
		dept + "' and ";
	sql +=
		" p.equip_name in (select distinct(classname) from ad_equipck_classname c where c.classtype='" +
		classsType + "' and c.dr=0)) as " + asName ;
	return sql;
}
export default {
	//获取各个点检类别的设备总数，在指定点检类型和时间区间下的点检次数
	getData(checkStatus, begTime, endTime, type, dept) {
		let dayType = "yyyy-mm-dd"
		if(type == "day") {
			dayType = "yyyy-mm-dd"
		}
		else if(type == "week") {
			dayType = "yyyy-ww"
		}
		else {
			dayType = "yyyy-mm"
		}
		let class01 = "一类设备";
		let class02 = "二类设备";
		let class03 = "三类设备";
		let class04 = "四类设备";
		let asName01 = "equipNum01";
		let asName02 = "equipNum02";
		let asName03 = "equipNum03";
		let asName04 = "equipNum04";
		let CheckedasName01 = "checked_num_01";
		let CheckedasName02 = "checked_num_02";
		let CheckedasName03 = "checked_num_03";
		let CheckedasName04 = "checked_num_04";
		let CheckedRightasName01 = "checked_num_01_right";
		let CheckedRightasName02 = "checked_num_02_right";
		let CheckedRightasName03 = "checked_num_03_right";
		let CheckedRightasName04 = "checked_num_04_right";
		let select = baseNumSql(dept, class01, asName01) +",";
			select += baseNumSql(dept, class02, asName02) +",";
			select +=baseNumSql(dept, class03, asName03) + ",";
			select +=baseNumSql(dept, class04, asName04) +",";
			select +=baseCheckedSql(checkStatus, begTime, endTime, dept, dayType, class01, CheckedasName01, false) +",";
			select +=baseCheckedSql(checkStatus, begTime, endTime, dept, dayType, class01, CheckedRightasName01, true)+ ",";
			select +=baseCheckedSql(checkStatus, begTime, endTime, dept, dayType, class02, CheckedasName02, false) +",";
			select +=baseCheckedSql(checkStatus, begTime, endTime, dept, dayType, class02, CheckedRightasName02, true)+ ",";
			select +=baseCheckedSql(checkStatus, begTime, endTime, dept, dayType, class03, CheckedasName03, false) +",";
			select +=baseCheckedSql(checkStatus, begTime, endTime, dept, dayType, class03, CheckedRightasName03, true)+ ",";
			select +=baseCheckedSql(checkStatus, begTime, endTime, dept, dayType, class04, CheckedasName04, false) +",";
			select +=baseCheckedSql(checkStatus, begTime, endTime, dept, dayType, class04, CheckedRightasName04, true); 
		return {
			select: select,
			from: "{ad_equipck_d}",
			where: " where rownum=1"
		}
	},
	getDept() {
		let select =
			"  ( b.deptname||'('||(case b.pk_corp when '1001' then '新世纪' else  (case b.pk_corp when '1002' then '新时代' else  '钢结构' end ) end )||')') as deptname	,pk_deptdoc";
		let from = "{bd_deptdoc b}";
		let where = " where  b.pk_deptdoc in (select p.pk_mandept from pam_equip p)";
		return {
			select,
			from,
			where,
		}
	}
}