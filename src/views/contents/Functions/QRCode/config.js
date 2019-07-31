
const Url = {
	content: {
		get: "/json/mis_getData",
		
	}
}
const config = {
	
	Url
}
export default JSON.parse(JSON.stringify(config).replace(/\s/g, ''));