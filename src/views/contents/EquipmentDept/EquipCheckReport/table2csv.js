export const tableData = [{
	"name": "一类设备", //设备类别
	"num": 0, //设备数量
	"need": 0, //应点检数
	"none": 0, //未点检数
	"checked": 0, //已点检数
	"right": 0, //合格数
	"right_v": "0%" //合格率
}, {
	"name": "二类设备",
	"num": 0,
	"need": 0,
	"none": 0,
	"checked": 0, //已点检数
	"right": 0,
	"right_v": "0%"
}, {
	"name": "三类设备",
	"num": 0,
	"need": 0,
	"none": 0,
	"checked": 0, //已点检数
	"right": 0,
	"right_v": "0%"
}, {
	"name": "四类设备",
	"num": 0,
	"need": 0,
	"none": 0,
	"checked": 0, //已点检数
	"right": 0,
	"right_v": "0%"
}];
export const tableColumns = [{
	'title': '设备类别',
	'key': 'name',
	align: 'center',
	'width': 200
}, {
	'title': '数量',
	'key': 'num',
	align: 'center',
	'width': 150
}, {
	'title': '应点检数',
	'key': 'need',
	align: 'center',
	'width': 150,
}, {
	'title': '未点检数',
	align: 'center',
	'key': 'none',
	'width': 150
}, {
	'title': '已点检数',
	align: 'center',
	'key': 'checked',
	'width': 150
}, {
	'title': '合格数',
	align: 'center',
	'key': 'right',
	'width': 150
}, {
	'title': '合格率',
	align: 'center',
	'key': 'right_v'
}];