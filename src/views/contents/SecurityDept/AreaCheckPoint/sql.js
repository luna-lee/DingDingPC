import tables from './tables.js'
var colum = tables.leftTable.colum
var treeTableName = tables.leftTable.name
var contentTableName = tables.contentTable.name
var columC = tables.contentTable.colum
//select * from t where a='[h]' and b="[hh]"  params.h=5
function sqlFormat(sql, params) {
	for(var key in params) {
		var reg = new RegExp("(\\[)" + key + "(\\])", "g");
		sql = sql.replace(reg, params[key])
	}
	return sql
}
export default {
	getTreeData() {
		let where = "where [c_dr]=0 order by [c_ts] desc";
		let params = {
			where: {
				c_dr: colum.dr,
				c_ts: colum.ts
			}
		}
		where = sqlFormat(where, params.where)
		return {
			select: "*",
			from: "{" + treeTableName + "}",
			where
		}
	},
	addTreeNode(insertJson) {
		return {
			insertJson: insertJson,
			tableName: treeTableName
		}
	},
	deleteTreeNode(operator, ts, nodePk) {
		let set = "set [c_dr]=1,[c_operator]='[operator]',[c_ts]='[ts]'"
		let where = " where [c_pk]='[nodePk]'"
		let params = {
			set: {
				c_dr: colum.dr,
				c_operator: colum.operator,
				c_ts: colum.ts,
				operator,
				ts
			},
			where: {
				c_pk: colum.pk,
				nodePk
			}
		}
		set = sqlFormat(set, params.set)
		where = sqlFormat(where, params.where)
		return {
			tableName: treeTableName,
			set,
			where,
		}
	},
	editTreeNode(newNodeName, operator, ts, oldNodePK) {
		let set = " set [c_name]='[newNodeName]',[c_operator]='[operator]',[c_ts]='[ts]'"
		let where = " where [c_pk]='[oldNodePK]'"
		let params = {
			set: {
				c_name: colum.name,
				c_operator: colum.operator,
				c_ts: colum.ts,
				newNodeName,
				operator,
				ts,
			},
			where: {
				c_pk: colum.pk,
				oldNodePK
			}
		}
		set = sqlFormat(set, params.set)
		where = sqlFormat(where, params.where)
		return {
			tableName: treeTableName,
			set,
			where
		}
	},
	getContentData(left_pk, beginNum, endNum) {
		let select = " a.*,rn,maxrows";
		let from = "(select a.*,rownum rn from ";
		from +=
			"(select a.*,(select count(*) from  [contentTableName] a where a.[c_dr]=0 and a.[c_left_pk]='[left_pk]' ) maxrows ";
		from +=
			"from {[contentTableName]  a} where  a.[c_dr]=0 and a.[c_left_pk]='[left_pk]'  order by [c_ts] desc ) a where rownum <[endNum]) a";
		let where = "where rn>[beginNum]";
		let params = {
			from: {
				c_dr: columC.dr,
				c_left_pk: columC.left_pk,
				c_ts: columC.ts,
				contentTableName,
				left_pk,
				endNum,
				beginNum
			},
			where: {
				beginNum
			}
		}
		from = sqlFormat(from, params.from)
		where = sqlFormat(where, params.where)
		return {
			select,
			from,
			where
		}
	},
	saveContentData(valueData, condition) {
		return {
			tableName: contentTableName,
			data: JSON.stringify(valueData),
			condition: JSON.stringify(condition)
		}
	},
	deleteContentData(operator, ts, pk) {
		let set = "set [c_dr]=1 ,[c_operator]='[operator]'," + "[c_ts]= '[ts]'";
		let where = " where [c_pk] in ([pk])"
		let params = {
			set: {
				c_dr: columC.dr,
				c_operator: columC.operator,
				c_ts: columC.ts,
				operator,
				ts
			},
			where: {
				c_pk: columC.pk,
				pk
			}
		}
		set = sqlFormat(set, params.set)
		where = sqlFormat(where, params.where)
		return {
			tableName: contentTableName,
			set,
			where
		}
	},
	importContentData(impdata) {
		return {
			tableName: contentTableName,
			insertJsonArray: JSON.stringify(impdata)
		}
	},
	importTreeData(impdata) {
		return {
			tableName: treeTableName,
			insertJsonArray: JSON.stringify(impdata)
		}
	}
}