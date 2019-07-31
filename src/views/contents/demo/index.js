import expandRow from './components/extend_table.vue'
import AsyncValidator from 'async-validator'

function validateData(rule, value, callback) {
	if(value === '') {
		callback('Please enter your password');
	}
	else {
		callback();
	}
}
// 校验规则
const rules = {
	username: [{
		validator: validateData
	}, {
		required: true,
		message: '请填写用户名'
	}, {
		min: 3,
		max: 10,
		message: '用户名长度为3-10'
	}],
	code: [{
		required: true,
		message: '请填写编码'
	}],
	age:[{
		required: true,
		message: '请填写年龄'
	}]
}
// 根据校验规则构造一个 validator
const validator = new AsyncValidator(rules)
const data = {
	username: '1111',
	code: "",
	age: ''
}
validator.validate(data, (errors, fields) => {
	//	验证成功errors==null,fields==null
	console.log(fields)
	console.log(errors)
})
export default {
	name: 'demo_index',
	mounted: function() {
		this.getTreeData();
		this.timedCount_getTableData();
	},
	activated: function() {},
	render: (h) => {
		return h('Select', {
				props: {
					//filterable: true,
					//						value: [0, 1],
				},
				on: {
					'on-change' (val) {
						//						let key = param.column.key;
						//						vm.edittingStore[param.index][key] = val;
					}
				}
			}, [h('Option', {
				props: {
					//					value: $this.selectArr[0].value
					value: "New York",
					label: "New York"
				},
				//				key: $this.selectArr[0].label
			})]
			/*arr.map(function(item) {
								return h('Option ', {
									props: {
										value: item.value
									},
									key: item.label
								})
							})*/
		)
	},
	methods: {
		timedCount_getTableData() {
			var t = setTimeout(this.timedCount_getTableData, 200)
			if(!this.showLoading) {
				clearTimeout(t)
				this.getTableData(this.pageNum, this.pageRows);
			}
		},
		getTreeData() {
			var $this = this;
			this.showLoading = true;
			this.$ajax.get(this.path + '/json/dinguser_testMethod', {
				params: {
					select: "distinct classname as classname",
					from: "{ad_equipck_checkcontent a}",
					where: "order by classname"
				}
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					var tree = data.obj;
					tree.forEach(function(value, index) {
						value.uuid = $this.comMethods.guid();;
						value.parent = "1";
						value.classname = value.classname
					});
					var node = {
						uuid: "1",
						classname: "设备名称",
						parent: ""
					}
					$this.treeData = tree;
					$this.treeData.push(node)
				}
				else {
					$this.$Message.error(data.msg);
				}
			}).catch(function(response) {
				$this.$Message.error("网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		getTableData(pageNum, pageRows) {
			var $this = this;
			this.showLoading = true;
			var rownum = pageRows * pageNum + 1;
			var rn = (pageNum - 1) * pageRows;
			var select =
				"a.*,rn,maxrows, ad.psnname  as workname,deptname,usedeptname,empleadername,projectname,operatekname";
			var from = "(select a.*,rownum rn from (";
			from += "select a.* ,(select count(*) from  ad_psndoc_rp2_bak) maxrows,";
			from += "(select t.deptname from  bd_deptdoc t where t.pk_deptdoc=a.empdept) deptname ,";
			from += "(select t.deptname from  bd_deptdoc t where t.pk_deptdoc=a.empuserdept) usedeptname,";
			from += " (select l.psnname from ad_psntypelist l where l.uuid=a.empleader) empleadername,";
			from += "(select j.jobname from bd_Jobbasfil j where j.pk_jobbasfil=a.project) projectname,";
			from += "(select b.psnname from  bd_psndoc b where b.pk_psndoc=a.operate) operatekname";
			from += " from {ad_psndoc_rp2_bak a} order by create_time desc";
			from += ") a where rownum < " + rownum + ") a  , ad_psnbasdoc ad  , ad_psndoc ab ";
			this.$ajax.get(this.path + '/json/dinguser_testMethod', {
				params: {
					select: select,
					from: from,
					where: "where rn>" + rn +
						"and ab.pk_psnbasdoc=ad.pk_psnbasdoc and a.pk_psndoc= ab.pk_psndoc"
				}
			}).then(function(response) {
				var data = response.data;
				if(data.success) {
					$this.tableData = data.obj;
					$this.pageTotal = parseInt($this.tableData[0]["maxrows"]);
					$this.tableData.filter(function(value) {
						switch(value.type) {
							case '0':
								value.type = '质量巡检';
								break;
							case '1':
								value.type = '安环巡检';
								break;
							case '2':
								value.type = '设备巡检';
								break;
						}
					})
				}
				else {
					$this.$Message.error(data.msg);
				}
			}).catch(function(response) {
				$this.$Message.error("网络故障,请检查网络");
			}).then(function() {
				$this.showLoading = false;
			});
		},
		rightClickId(val) {
			//			console.log(val)
			this.rightClickNodeId = val
		},
		addNode() {
			var add = {};
			add.uuid = this.comMethods.guid();
			add.classname = this.comMethods.guid() + "hello";
			add.parent = this.rightClickNodeId;
			this.treeData.push(add)
		},
		deleteNode() {
			var ind = -1;
			var allow = true;
			this.treeData.forEach(function(value, index) {
				if(value.uuid == this.rightClickNodeId) {
					ind = index;
				}
				if(value.parent == this.rightClickNodeId) {
					allow = false;
				}
			}.bind(this));
			if(allow) this.treeData.splice(ind, 1);
			else this.$Message.error("有子节点，请先删除子节点")
		},
		editNode() {
			var ind = -1;
			var changeVal = "";
			this.treeData.forEach(function(value, index) {
				if(value.uuid == this.rightClickNodeId) {
					ind = index;
					changeVal = value;
				}
			}.bind(this));
			changeVal.classname = "newName"
			this.treeData.splice(ind, 1, changeVal);
		},
		pageChange(val) {
			this.pageNum = val;
		},
		pageSizeChange(val) {
			this.pageRows = val;
		}
	},
	watch: {
		pageNum(val) {
			this.getTableData(val, this.pageRows);
		},
		pageRows(val) {
			if(!this.showLoading) this.getTableData(1, val);
		},
		treeSelect(val) {
			console.log(JSON.stringify(val))
		}
	},
	components: {
		expandRow
	},
	data() {
		return {
			pageTotal: 0,
			tableData: [],
			//			workname,deptname,usedeptname,empleadername,projectname,operatekname
			tableColumn: [
				/*{
					type: 'expand',
					width: 50,
					render: (h, params) => {
						return h(expandRow, {
							props: {
								row: params.row
							}
						})
					}
				}, */
				{
					title: "员工姓名",
					key: "workname",
					width: 100,
					fixed: 'left'
				}, {
					title: "隶属部门",
					key: "deptname",
					width: 100
				}, {
					title: "用工部门",
					key: "usedeptname",
					width: 100
				}, {
					title: "主管领导",
					key: "empleadername",
					width: 100
				}, {
					title: "项目号",
					key: "projectname",
					width: 100
				}, {
					title: "操作员",
					key: "operatekname",
					width: 100
				}, {
					title: "违章类型",
					key: "type",
					width: 100
				}, {
					title: "日期",
					key: "create_time",
					width: 100,
					sortable: true
				}, {
					title: "违章明细",
					key: "cknote",
					width: 200
				}
			],
			pageNum: 1,
			pageRows: 10,
			showLoading: false,
			treeSelect: "",
			treeStructure: {
				id: "uuid",
				title: "classname",
				parentId: "parent"
			},
			treeData: []
		};
	},
	computed: {
		path() {
			return this.comMethods.projectPath();
		}
	}
}