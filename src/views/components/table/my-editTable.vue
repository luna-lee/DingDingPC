<!--   API:  props:
	
data：表数据，Array
columns：表头数据，Array
height：表高度，Number
onQuery: 相应查询按钮  Function
noDataText：当表没有数据时显示提示内容 String
 

event ：
saveData 返回 待保存的数据({})及index
deleteData 返回 待删除的数据(Array)及index(Array)
 -->

<template>
	<div>
		<Row type="flex" align="top">
			<Col span="24">
			<div style=" background: #f3f3f3;">
				<ButtonGroup>
					<a :class="{displayClass:!buttons.add}" class="ivu-btn ivu-btn-text" type="text" @click="addButton" :disabled="addButtonDisabled"
					 :style="buttonStyle">增加
						<moon-icon name="moon-icon-tianjia" class="moon-icon"></moon-icon>
					</a>
					<a :class="{displayClass:!buttons.delete}" class="ivu-btn ivu-btn-text" type="text" @click="deleteButton"
					 :disabled="deleteButtonDisabled" :style="buttonStyle">删除
						<moon-icon name="moon-icon-shanchu" class="moon-icon"></moon-icon>
					</a>
					<a :class="{displayClass:!buttons.search}" class="ivu-btn ivu-btn-text" type="text" @click="queryButton"
					 :disabled="queryButtonDisabled" :style="buttonStyle">查询
						<moon-icon name="moon-icon-fangdajing" class="moon-icon"></moon-icon>
					</a>
					<a :class="{displayClass:!buttons.edit}" class="ivu-btn ivu-btn-text" type="text" @click="editButton"
					 :disabled="editButtonDisabled" :style="buttonStyle">修改
						<moon-icon name="moon-icon-edit" class="moon-icon"></moon-icon>
					</a>
					<a :class="{displayClass:!buttons.save}" class="ivu-btn ivu-btn-text" type="text" @click="saveButton"
					 :disabled="saveButtonDisabled" :style="buttonStyle">保存
						<moon-icon name="moon-icon-save" class="moon-icon"></moon-icon>
					</a>
					<a :class="{displayClass:!buttons.cancel}" class="ivu-btn ivu-btn-text" type="text" @click="cancelButton"
					 :disabled="cancelButtonDisabled" :style="buttonStyle">取消
						<moon-icon name="moon-icon-cancel" class="moon-icon"></moon-icon>
					</a>
					<!--3个备用按钮-->
					<a :class="{displayClass:!buttons.def01.status}" class="ivu-btn ivu-btn-text" type="text" @click="queryDef01"
					 :disabled="addButtonDisabled" :style="buttonStyle">{{buttons.def01.name}}
						<Icon :type="buttons.def01.icon" size="15" class="defButton" :color="buttons.def01.color" />
					</a>

					<a :class="{displayClass:!buttons.def02.status}" class="ivu-btn ivu-btn-text" type="text" @click="queryDef02"
					 :disabled="addButtonDisabled" :style="buttonStyle">{{buttons.def02.name}}
						<Icon :type="buttons.def02.icon" size="15" class="defButton" :color="buttons.def02.color" />
					</a>
					<a :class="{displayClass:!buttons.def03.status}" class="ivu-btn ivu-btn-text" type="text" @click="queryDef03"
					 :disabled="addButtonDisabled" :style="buttonStyle">{{buttons.def03.name}}
						<Icon :type="buttons.def03.icon" size="15" class="defButton" :color="buttons.def03.color" />
					</a>
				</ButtonGroup>

				<a :class="{displayClass:!buttons.free01.status}" class="ivu-btn ivu-btn-text" style="float: right;"
				 @click="queryFree01" type="text" :style="buttonStyle" :disabled="addButtonDisabled">
					<Icon :type="buttons.free01.icon" :color="buttons.free01.color"></Icon> {{buttons.free01.name}}</a>
				<a :class="{displayClass:!buttons.free02.status}" class="ivu-btn ivu-btn-text" style="float: right;"
				 @click="queryFree02" type="text" :style="buttonStyle" :disabled="addButtonDisabled">
					<Icon :type="buttons.free01.icon" :color="buttons.free02.color"></Icon> {{buttons.free02.name}}</a>
				<a :class="{displayClass:!buttons.free03.status}" class="ivu-btn ivu-btn-text" style="float: right;"
				 @click="queryFree03" type="text" :style="buttonStyle" :disabled="addButtonDisabled">
					<Icon :type="buttons.free01.icon" :color="buttons.free03.color"></Icon> {{buttons.free03.name}}</a>
				<a :class="{displayClass:!buttons.export}" class="ivu-btn ivu-btn-text" style="float: right;" type="text"
				 @click="exportData" :style="buttonStyle" :disabled="addButtonDisabled">
					<Icon type="ios-undo"></Icon> 导出数据</a>
				<label for="xFile" :class="{displayClass:!buttons.import}" class="ivu-btn ivu-btn-text" style="float: right;"
				 type="text" :style="[buttonStyle, {'pointer-events': addButtonDisabled ?'none':'all' }]" :disabled="addButtonDisabled">
					<Icon type="md-download"></Icon> 导入数据   
				</label>
				<form v-form-el="getFormEl">
					<input style="position:absolute;clip:rect(0 0 0 0);" type="file" id="xFile" @change="importFile($event)"
					/>
				</form>

			</div>

			</Col>
		</Row>
		<Row type="flex" align="bottom">
			<Col span="24">
			<Modal width="700" v-model="showInfo" @on-ok="delete_ok" :closable="false" :mask-closable="false" :styles="{top: '20px'}">
				<p slot="header" style="color:#f60;text-align:center;">
					<Icon type="information-circled"></Icon>
					<span>删除确认</span>
				</p>
				<Table :height="250" :columns="columns" :data="deleteingData"></Table>
			</Modal>

			<!--<Table :columns="tableColumn" :data="tableData" size="small"
						 :height="tableHeight" 
						 highlight-row @on-current-change="selectRow"
						 ></Table>-->
			<can-edit-table ref="canEditTable" :no-data-text="noDataText" :height="height" v-model="tableData" :edit="edit"
			 :columns-list="columns" @on-save="saveData" @on-delete="deleteData" @select-row-index="selectRowIndex"
			 :select-row-index-array="selectRowIndexArray" :export-config="exportConfig"></can-edit-table>
			</Col>
		</Row>
		<Modal v-model="exportDialog" :mask-closable="false" :closable="false" @on-ok="exportOk">
			<p slot="header" style="text-align:center;font-size: 18px;">
				<Icon type="information-circled"></Icon>
				<span>导出确认</span>
			</p>
			<div style="text-align:center;">
				<div>
					文件名：
					  <Input v-model="exportConfig.name" placeholder="输入Execl文件名称" style="width: auto" />
				</div>
			</div>

		</Modal> 
	</div>
</template>

<script>
	import canEditTable from "./component/canEditTable";
	export default {
		components: {
			canEditTable
		},
		props: {
			data: Array,
			columns: Array,
			height: {
				type: Number,
				default: 450
			}, 
			onQuery: {
				type: Function,
				default: function() {}
			},
			onDef01: {
				type: Function,
				default: function() {}
			},
			onDef02: {
				type: Function,
				default: function() {}
			},
			onDef03: {
				type: Function,
				default: function() {}
			},
			onFree01: {
				type: Function,
				default: function() {}
			},
			onFree02: {
				type: Function,
				default: function() {}
			},
			onFree03: {
				type: Function,
				default: function() {}
			},
			noDataText: {
				type: String,
				default: "暂无数据"
			},

			deleteStyle: {
				type: String,
				default: "Modal"
			},
			setButtons: {
				type: Object,
				default: function() {}
			}
		},
		mounted() {
			this.tableData = JSON.parse(JSON.stringify(this.data))
//			this.exportConfig.name = this.exportName ? this.exportName : this.exportConfig.name
		},
		watch: { 
			setButtons: {
				handler(newName, oldName) {
					for(let key in newName) {
						this.buttons[key] = newName[key]
					}
					this.buttons = JSON.parse(JSON.stringify(this.buttons))
				},
				immediate: true,
				deep: true
			},
			data(val) {
				if(val.length == 0) {
					this.resetData()
				}
				this.tableData = JSON.parse(JSON.stringify(val))
			},
			saveButtonDisabled(val) {
				this.$emit("editing", !val)
			}
		},
		data() {
			return {
				showInfo: false,
				selectedRowIndex: -1,
				edit: false, //修改按钮  
				add: false, //修改按钮  
				tableData: [],
				deleteingData: [],
				selectRowIndexArray: [],
				formEl: "",
				exportConfig: {
					name: "导出的数据",
					clicked: 0
				}, 
				exportDialog: false,
				buttons: {
					add: false,
					search: false,
					delete: false,
					import: false,
					save: false,
					cancel: false,
					edit: false,
					export: false,
					def01: {
						status: false,
						name: "备用1",
						icon: "ios-search-outline",
						color: "black"
					},
					def02: {
						status: false,
						name: "备用2",
						icon: "ios-search-outline",
						color: "black"
					},
					def03: {
						status: false,
						name: "备用3",
						icon: "ios-search-outline",
						color: "black"
					},
					free01: {
						status: false,
						name: "右备用1",
						icon: "ios-search-outline",
						color: "black"
					},
					free02: {
						status: false,
						name: "右备用2",
						icon: "ios-search-outline",
						color: "black"
					},
					free03: {
						status: false,
						name: "右备用3",
						icon: "ios-search-outline",
						color: "black"
					}

				}
			}
		},
		directives: {
			"form-el": {
				bind(el, binding) {
					if(binding.expression) {
						binding.value(el);
					}
				}
			}

		},
		methods: {
			exportOk() {
				this.exportConfig.clicked = this.exportConfig.clicked + 1;
			},
			exportData() {
				this.exportDialog = true

			},
			queryFree01() {
				this.onFree01()
			},
			queryFree02() {
				this.onFree02()
			},
			queryFree03() {
				this.onFree03()
			},
			queryDef01() {
				this.onDef01()
			},
			queryDef02() {
				this.onDef02()
			},
			queryDef03() {
				this.onDef03()
			},
			resetData() {
				this.selectedRowIndex = -1;
				this.selectRowIndexArray.splice(0);
				this.deleteingData.splice(0);
				this.edit = false; //修改按钮  
				this.add = false; //修改按钮  
			},
			getFormEl(el) {
				this.formEl = el;
			},
			importFile(e) {
				if(!e.target.files) {
					return;
				}
				this.$emit("import-file", e.target.files[0]);
				if(this.formEl)
					this.formEl.reset();

			},
			delete_ok() {
				this.$refs.canEditTable.globalDeleteButton()
			},
			saveData(value, index) {
				let triggerStatus = 0
				if(this.edit) {
					//修改就是替换,splice中对应参数为1
					triggerStatus = 1
				}
				if(this.add) {
					//新增就是插入,splice中对应参数为0//默认新增
					triggerStatus = 0
				}
				this.$emit("save", value, index, triggerStatus)
			},
			deleteData(value, index) {
				this.$emit("delete", value, index)
			},
			selectRowIndex(val) {
				this.selectedRowIndex = val;
			},
			editButton() {
				this.edit = true
			},
			deleteButton() {
				switch(this.deleteStyle.toLowerCase()) {
					case 'modal':
						this.showInfo = true;
						this.deleteingData.splice(0);
						let getselectRowIndexArray = JSON.parse(JSON.stringify(this.selectRowIndexArray));

						this.comMethods.sortQuick(getselectRowIndexArray, 0, getselectRowIndexArray.length - 1)
						if(getselectRowIndexArray.length > 0) {
							getselectRowIndexArray.forEach(function(value, index) {
								this.deleteingData.push(this.tableData[value]);
							}.bind(this))
						}
						else {
							this.deleteingData.push(this.tableData[this.selectedRowIndex]);
						}
						break;
					case 'message':
						this.$Message.success("删除成功");
						this.$refs.canEditTable.globalDeleteButton();
						break;
					default:
						this.$refs.canEditTable.globalDeleteButton();
						break;
				}

			},
			addButton() {
				this.add = true
				this.$refs.canEditTable.globalAddButton()
				this.edit = true
			},
			queryButton() {
				this.onQuery();
			},
			saveButton() {
				if(this.edit) {
					let success = this.$refs.canEditTable.globalSaveButton();
					if(success)
						this.edit = false;
				}
				this.add = false
			},
			cancelButton() {
				this.edit = false;
				this.add = false
				this.$refs.canEditTable.globalCancelButton()
			}
		},
		computed: {
			buttonStyle() {
				return {
					'padding': '4px  5px 2px',
					//					'font-size': '10px'//设置了字体 在不同铜浏览器会显示不不同
					'background': "#F5F5F6"
				}
			},
			editButtonDisabled() {
				return this.edit || this.selectedRowIndex == -1 || this.add || (this.selectRowIndexArray.length >
					0) ? true : false
			},
			deleteButtonDisabled() {
				return this.edit || this.selectedRowIndex == -1 || this.add ? true : false
			},
			addButtonDisabled() {
				return this.edit ? true : false
			},
			queryButtonDisabled() {
				return this.edit || this.add ? true : false
			},
			saveButtonDisabled() {
				return this.edit || this.add ? false : true
			},
			cancelButtonDisabled() {
				return this.edit || this.add ? false : true
			},
			importButtonDisabled() {}
		}

	}
</script>

<style scoped>
	.moon-icon {
		width: 12px;
		height: 12px;
	}
	
	.displayClass {
		display: none;
	}
	
	.defButton {
		margin-top: -2px;
		margin-left: -4px;
	}
</style>