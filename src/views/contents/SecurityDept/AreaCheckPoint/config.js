const treeNode = {
	need: true,
	rootNode: {
		id: "1",
		title: "场地列表",
		parentId: ""
	}
}
const comName = {
	name: "场地" //公共名
}
const Url = {
	treeNode: {
		get: "/json/mis_getData",
		add: "/json/mis_insertJson",
		delete: "/json/mis_update",
		edit: "/json/mis_update",
		importSave:"/json/mis_insertJsonArray"
	},
	content: {
		get: "/json/mis_getData",
		save: "/json/mis_saveUpdateOrInsert",
		delete: "/json/mis_update",
		importSave:"/json/mis_insertJsonArray"
	}
}
const config = {
	treeNode,
	comName,
	Url
}
export default JSON.parse(JSON.stringify(config).replace(/\s/g, ''));