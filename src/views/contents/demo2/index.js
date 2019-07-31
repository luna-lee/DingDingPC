import expandRow from './components/extend_table.vue'
import splitPane from '../../components/split-pane';
import mytable from '../../components/table/my-editTable';
export default {
	name: 'demo_index2',
	mounted: function() {
		this.getTreeData();
		this.timedCount_getTableData(); 
	},
	activated: function() {},
	methods: {
		onQuery() {
			this.$Modal.confirm({
				title: '依据条件查询获取数据',
				content: '<p>依据查询获取数据</p>',
				onOk: () => {
					this.pageNum = 1;
					this.pageRows = 10;
					this.pageTotal = 0;
					this.selectQueryButton = !this.selectQueryButton
					this.getTableData(this.pageNum, this.pageRows);
				},
				onCancel: () => {}
			});
		},
		onCellButton(vm, inputCurrentRow, currentColumn, param) {
			if(currentColumn.key == 'deptname') {
				this.$Modal.confirm({
					title: '单元节点查询获取数据',
					content: '<p>单元节点查询获取数据</p>',
					onOk: () => {
						//将选择好的数据放入input
						inputCurrentRow[currentColumn.key] = "hello";
						//将选择好的数据放入数据源中
						vm.edittingStore[param.index][currentColumn.key] = "hello"
					},
					onCancel: () => {}
				});
			}
		},
		timedCount_getTableData() {
			var t = setTimeout(this.timedCount_getTableData, 200)
			if(!this.showLoading) {
				clearTimeout(t)
				this.getTableData(this.pageNum, this.pageRows);
			}
		},
		getTreeData() {
			var $this = this;
			if(this.showLoading) {
				return;
			}
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
						expand: true,
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
			if(this.showLoading) {
				return;
			}
			this.showLoading = true;
			var rownum = pageRows * pageNum + 1;
			var rn = (pageNum - 1) * pageRows;
			var select =
				"a.*,rn,maxrows, ad.psnname  as workname,deptname,usedeptname,empleadername,projectname,operatekname";
			var from = "(select a.*,rownum rn from (";
			from += "select a.* ,(select count(*) from  ad_psndoc_rp2) maxrows,";
			from += "(select t.deptname from  bd_deptdoc t where t.pk_deptdoc=a.empdept) deptname ,";
			from += "(select t.deptname from  bd_deptdoc t where t.pk_deptdoc=a.empuserdept) usedeptname,";
			from += " (select l.psnname from ad_psntypelist l where l.uuid=a.empleader) empleadername,";
			from += "(select j.jobname from bd_Jobbasfil j where j.pk_jobbasfil=a.project) projectname,";
			from += "(select b.psnname from  bd_psndoc b where b.pk_psndoc=a.operate) operatekname";
			from += " from {ad_psndoc_rp2  a} order by create_time desc";
			from += ") a where rownum < " + rownum + ") a  , ad_psnbasdoc ad  , ad_psndoc ab ";
			this.$ajax.get(this.path + '/json/dinguser_testMethod', {
				params: {
					select: select,
					from: from,
					where: "where rn>" + rn +
						" and ab.pk_psnbasdoc=ad.pk_psnbasdoc and a.pk_psndoc= ab.pk_psndoc"
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
		addTreeNode() {
			let inputVal = ""
			this.$Modal.confirm({
				title: "在节点“" + this.rightClickNodeId.classname + "”上新增一个子节",
				render: (h) => {
					return h('Input', {
						props: {
							value: this.value,
							autofocus: true,
							placeholder: '填写新增节点名'
						},
						on: {
							input: (val) => {
								inputVal = val;
							}
						}
					})
				},
				onOk: () => {
					this.$refs.moontree.addNode(inputVal)
				},
				onCancel: () => {}
			})
		},
		deleteTreeNode() {
			this.$Modal.confirm({
				content: "<div><p>确定删除 <span style='font-size: large;font-weight: bold;'>" + this.rightClickNodeId
					.classname + "</span>这个节点吗？</p></div>",
				onOk: () => {
					let $this = this;
					this.$refs.moontree.deleteNode(() => {
						$this.$Message.error("有子节点，请先删除子节点")
					})
				},
				onCancel: () => {}
			})
		},
		editTreeNode() {
			let inputVal = "";
			this.$Modal.confirm({
				title: "修改节点名称<br/> 当前节点名称:“" + this.rightClickNodeId.classname + "”",
				render: (h) => {
					return h('Input', {
						props: {
							value: this.value,
							autofocus: true,
							placeholder: '填写新节点名称'
						},
						on: {
							input: (val) => {
								inputVal = val;
							}
						}
					})
				},
				onOk: () => {
					this.$refs.moontree.editNode(inputVal)
				},
				onCancel: () => {}
			})
		},
		pageChange(val) {
			this.pageNum = val;
		},
		pageSizeChange(val) {
			this.pageRows = val;
		},
		saveData(value, index) {
			if(value.uuid) this.tableData.splice(index, 1, value)
			else this.tableData.splice(index, 0, value)
			console.log(JSON.stringify(this.tableData[index]))
		},
		deleteData(value, indexArr) {
			//得到确定要删除的对象，与下标数组
			//根据下标数组，变异修改数据源
			this.comMethods.ArrayRemoveByIndexArray(this.tableData, indexArr)
		},
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
		splitPane,
		mytable
	},
	data() {
		return {
			selectQueryButton: false,
			triggerOffset: 20,
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
					editable: true, 
					fixed: 'left'
				}, {
					title: "隶属部门",
					key: "deptname",
					width: 100,
					editable: true, 
				}, {
					title: "用工部门",
					key: "usedeptname",
					width: 100,
					editable: true
				}, {
					title: "主管领导",
					key: "empleadername",
					width: 100,
					editable: true
				}, {
					title: "项目号",
					key: "projectname",
					width: 100,
					editable: true
				}, {
					title: "操作员",
					key: "operatekname",
					width: 100,
					editable: true
				}, {
					title: "违章类型",
					key: "type",
					width: 100,
					editable: true
				}, {
					title: "日期",
					key: "create_time",
					sortable: true,
					width: 100,
					editable: true
				}, {
					title: "违章明细",
					key: "cknote",
					width: 200,
					editable: true
				}, {
					title: " "
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
			treeData: [],
			edit: false //修改按钮
		};
	},
	computed: {
		path() {
			return this.comMethods.projectPath();
		},
		getWindowResize() {
			return this.$store.state.app.windowResize;
		}, //高度控制
		tableHeight() {
			return this.$store.state.app.mainRouterArea;
		}
	}
}