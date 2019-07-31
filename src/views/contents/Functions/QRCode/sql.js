import tables from './tables.js'
var cols = tables.contentTable.colum
var tableName = tables.contentTable.name
//select * from t where a='[h]' and b="[hh]"  params.h=5
function sqlFormat(sql, params) {
	for(var key in params) {
		var reg = new RegExp("(\\[)" + key + "(\\])", "g");
		sql = sql.replace(reg, params[key])
	}
	return sql
}
export default {
	getData(data) {
		let where = "where "
		let item = {} 
		data.forEach(function(val, index) {
			for(let key in val) {
				item[key] = item[key] ? item[key] + ",'" + val[key].trim() + "'" : "'" + val[key].trim() + "'"
			}
		});
		cols.forEach(function(cols_value, cols_index) {
			if(cols_value.sqlNeed) {
				where += cols_value.col + " in (" + item[cols_value.col] + ") and "
			}
		});
		where = where.substr(0, where.lastIndexOf("and"))
		return {
			select: "*",
			from: "{" + tableName + "}",
			where
		}
	}
}