 
const Url = { 
	content: {
		get: "/json/mis_getData", 
		delete: "/json/mis_update",
	}
}
const config = { 
	Url
}
export default JSON.parse(JSON.stringify(config).replace(/\s/g, ''));