export default { 
	getTreeData() {
		 return {
			select: "*",
			from: "{ad_equipck_classname}",
			where: " where dr=0  order by classname"
		}
	} ,
	addTreeNode(insertJson){
		return {
			insertJson:insertJson, 
			tableName:"ad_equipck_classname"
		}
	}
}