import tables from './tables.js'
 
//select * from t where a='[h]' and b="[hh]"  params.h=5
function sqlFormat(sql, params) {
	for(var key in params) {
		var reg = new RegExp("(\\[)" + key + "(\\])", "g");
		sql = sql.replace(reg, params[key])
	}
	return sql
}
export default {
	deleteContentData(operator, ts, pk) {
		let set = "set dr=1 ,operator='[operator]'," + "ts= '[ts]'";
		let where = " where pk_report in ([pk])"
		let params = {
			set: { 
				operator,
				ts
			},
			where: { 
				pk
			}
		}
		set = sqlFormat(set, params.set)
		where = sqlFormat(where, params.where)
		return {
			tableName: 'ad_area_report',
			set,
			where
		}
	},
	getContentData(condition) {
		let select = " r.pk_report as pk_report,  a.name as name,";
		select +=
			"$(select wm_concat( rownum||'.'||c.checkcontent) from ad_area_checkcontents c where  instr(r.pk_checkcontent ,c.pk_checkcontent )>0) as breakcontent";
		select +=
			", r.remark as remark , $(substr(r.ts,0,10)) as ts, $(select b.psnname from bd_psnbasdoc b where b.pk_psnbasdoc = r.operator) as operator ";
		let from = " {ad_area a},{ad_area_report r} ";
		let where = " where r.dr=0 and a.dr=0 and r.pk_area = a.pk_area";
		if(condition) where += condition;
		return {
			select,
			from,
			where
		}
	},
	getNameData() {
		let select = "name";
		let from = " {ad_area}  ";
		let where = " where dr=0";
		return {
			select,
			from,
			where
		}
	}
}