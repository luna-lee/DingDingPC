const leftTable = {
	name: "ad_area",
	colum: {
		pk: "pk_area", //表PK//构建树必备id
		dr: "dr", //表删除标记
		ts: "ts", //时间
		operator: "operator", //最近一次操作人员
		name: "name", //构建树必备title
		parentId: "parentId" //构建树必备parentId
	}
}
const contentTable = {
	name: "ad_area_checkcontents",
	colum: {
		pk: "pk_checkcontent", //表PK
		left_pk: "pk_area", //左表PK
		content: "checkcontent", //内容
		dr: "dr", //表删除标记
		ts: "ts", //时间
		operator: "operator" //最近一次操作人员 
	}
}
const reportTable = {
	name: "ad_area_report",
	colum: {
		pk: "pk_report", //表PK
		left_pk: "pk_area", //左表PK
		content_pk: "pk_checkcontent" ,
		dr: "dr", //表删除标记
		ts: "ts", //时间
		operator: "operator", //最近一次操作人员 
		remark:"remark"//备注
	}
}
const tables = {
	leftTable,
	contentTable,
	reportTable
}
export default JSON.parse(JSON.stringify(tables).replace(/\s/g, ''));