<style lang="less">
	@import './editable-table.less';
</style>

<template>
	<div>
		<Table ref="tableimport" style="position: relative;" :height="height" size="small" :columns="columnsList"
		 :no-data-text="noDataText" :row-class-name="selectRowClass" :data="thisTableData" border disabled-hover
		 @on-row-click="selectRow">
	 
		</Table>
	</div>
</template>

<script>
	import AsyncValidator from 'async-validator'

	const editButton = (vm, h, currentRow, index) => {
		return h('Button', {
			props: {
				type: currentRow.editting ? 'success' : 'primary',
				loading: currentRow.saving
			},
			style: {
				margin: '0 5px'
			},
			on: {
				'click': () => {
					if(!currentRow.editting) {
						if(currentRow.edittingCell) {
							for(let name in currentRow.edittingCell) {
								currentRow.edittingCell[name] = false;

								vm.edittingStore[index].edittingCell[name] =
									false;
							}
						}
						vm.edittingStore[index].editting = true;
						vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
					}
					else {
						vm.edittingStore[index].saving = true;
						vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
						let edittingRow = vm.edittingStore[index];
						edittingRow.editting = false;
						edittingRow.saving = false;
						vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
						vm.$emit('input', vm.handleBackdata(vm.thisTableData));
						vm.$emit('on-change', vm.handleBackdata(vm.thisTableData),
							index);
					}
				}
			}
		}, currentRow.editting ? '保存' : '编辑');
	};
	const deleteButton = (vm, h, currentRow, index) => {
		return h('Poptip', {
			props: {
				confirm: true,
				title: '您确定要删除这条数据吗?',
				transfer: true
			},
			on: {
				'on-ok': () => {
					vm.thisTableData.splice(index, 1);
					vm.$emit('input', vm.handleBackdata(vm.thisTableData));
					vm.$emit('on-delete', vm.handleBackdata(vm.thisTableData),
						index);
				}
			}
		}, [
			h('Button', {
				style: {
					margin: '0 5px'
				},
				props: {
					type: 'error',
					placement: 'top'
				}
			}, '删除')
		]);
	};
	const incellEditBtn = (vm, h, param) => {
		if(vm.hoverShow) {
			return h('div', {
				'class': {
					'show-edit-btn': vm.hoverShow
				}
			}, [
				h('Button', {
					props: {
						type: 'text',
						icon: 'edit'
					},
					on: {
						click: (event) => {
							vm.edittingStore[param.index].edittingCell[
								param.column.key] = true;
							vm.thisTableData = JSON.parse(JSON.stringify(vm
								.edittingStore));
						}
					}
				})
			]);
		}
		else {
			return h('Button', {
				props: {
					type: 'text',
					icon: 'edit'
				},
				on: {
					click: (event) => {
						vm.edittingStore[param.index].edittingCell[param.column
							.key] = true;
						vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
					}
				}
			});
		}
	};
	const saveIncellEditBtn = (vm, h, param) => {
		return h('Button', {
			props: {
				type: 'text',
				icon: 'checkmark'
			},
			on: {
				click: (event) => {
					vm.edittingStore[param.index].edittingCell[param.column
						.key] = false;
					vm.thisTableData = JSON.parse(JSON.stringify(vm.edittingStore));
					vm.$emit('input', vm.handleBackdata(vm.thisTableData));
					vm.$emit('on-cell-change', vm.handleBackdata(vm.thisTableData),
						param.index, param.column.key);
				}
			}
		});
	};
	const cellInput = (vm, h, param, item) => {
		return h('Input', {
			props: {
				type: 'text',
				value: vm.edittingStore[param.index][item.key]
			},
			on: {
				'on-change' (event) {
					let key = item.key;
					vm.edittingStore[param.index][key] = event.target.value;
				}
			}
		});
	};
	export default {
		name: 'canEditTable',
		props: {
			columnsList: Array,
			value: Array,
			url: String,
			editIncell: {
				type: Boolean,
				default: false
			},
			hoverShow: {
				type: Boolean,
				default: false
			},
			height: {
				type: Number,
				default: 450
			},
			edit: {
				type: Boolean,
				default: false
			},
			noDataText: {
				type: String,
				default: "暂无数据"
			},
			selectRowIndexArray: Array,
			exportConfig: {
				type: Object,
				default: function() {}
			}
		},
		data() {
			return {
				ctrdown: false,
				shiftdown: false,
				add: false,
				columns: [],
				thisTableData: [],
				edittingStore: [],
				selectRowIndex: -1,
				inputValue: [],
				ctrdownInit: false,
				rules: {},
				exportConfig_Clicked: 0

			};
		},
		computed: {
			onkeydown() {
				return this.$store.state.app.onkeydown;
			},
			onkeyup() {
				return this.$store.state.app.onkeyup;
			}
		},
		created() {
			this.init();
		},

		methods: {
			 
			exportData(filename) {
				this.$refs.tableimport.exportCsv({
					filename
				});
			},
			globalSaveButton() {
				let index = this.selectRowIndex;
				if(index == -1) return;
				let rulesuccess = true;
				//数据验证
				if(JSON.stringify(this.rules) != "{}") {
					new AsyncValidator(this.rules).validate(this.edittingStore[index], (errors, fields) => {
						if(!errors && !fields) {
							rulesuccess = true;
						}
						else {
							rulesuccess = false;
							this.$Message.error(errors[0].message);
						}
					})
				}
				if(!rulesuccess) return;
				this.edittingStore[index].editting = false;
				this.edittingStore[index].saving = false;
				this.thisTableData = JSON.parse(JSON.stringify(this.edittingStore));
				//				this.thisTableData[index].editting = false;
				//				this.thisTableData[index].saving = false;
				this.add = false;
				this.$emit('input', this.handleBackdata(this.thisTableData));
				this.$emit('on-save', this.handleBackdata(this.thisTableData)[index], index);
				return true;

			},
			globalCancelButton() {
				if(this.add) {
					this.add = false;
					this.thisTableData.splice(0, 1)
				}
				else {
					let cancelData = this.thisTableData[this.selectRowIndex]
					cancelData.editting = false;
					this.thisTableData.splice(this.selectRowIndex, 1, cancelData);
				}
				this.$emit('input', this.handleBackdata(this.thisTableData));
			},
			globalDeleteButton() {
				let vm = this;
				if(this.selectRowIndexArray.length > 0) {
					let deleteData = [];
					this.selectRowIndexArray.forEach(function(value, index) {
						deleteData.push(vm.thisTableData[value])
					}.bind(this))

					vm.$emit('on-delete', vm.handleBackdata(deleteData), this.selectRowIndexArray);
					this.selectRowIndexArray.splice(0)
					this.selectRowIndex = -1;

				}
				else {
					let index = this.selectRowIndex;
					if(index == -1) return;
					let deleteData = [];
					deleteData.push(vm.thisTableData[index])
					this.selectRowIndex = -1;
					let indexArr = [];
					indexArr.push(index);
					vm.$emit('on-delete', vm.handleBackdata(deleteData), indexArr);
				}
			},
			globalAddButton() {
				this.add = true;
				var add = {};
				this.columnsList.forEach(function(value, index) {
					if(value.key)
						add[value.key] = "";
				})
				this.thisTableData.splice(0, 0, add);
				this.selectRowIndex = 0;

				this.$emit('input', this.handleBackdata(this.thisTableData));
			},
			selectRowClass(row, index) {
				if(this.selectRowIndexArray.length > 0) {
					if(this.selectRowIndexArray.indexOf(index) != -1)
						return "ivu-table-row-highlight"
					else
						return ''
				}
				else {
					if(index == this.selectRowIndex)
						return "ivu-table-row-highlight"
					else
						return ''
				}
			},
			selectRow(value, index) {
				if(!this.edit) {
					if(index == this.selectRowIndex)
						this.selectRowIndex = -1;
					else this.selectRowIndex = index
				}
			},
			init() {
				let vm = this;
				let editableCell = this.columnsList.filter(item => {
					if(item.editable) {
						if(item.editable === true) {
							return item;
						}
					}
				});
				let cloneData = JSON.parse(JSON.stringify(this.value));
				let res = [];
				res = cloneData.map((item, index) => {
					let isEditting = false;
					if(this.thisTableData[index]) {
						if(this.thisTableData[index].editting) {
							isEditting = true;
						}
						else {
							for(const cell in this.thisTableData[index].edittingCell) {
								if(this.thisTableData[index].edittingCell[cell] ===
									true) {
									isEditting = true;
								}
							}
						}
					}
					if(isEditting) {
						return this.thisTableData[index];
					}
					else {
						this.$set(item, 'editting', false);
						let edittingCell = {};
						editableCell.forEach(item => {
							edittingCell[item.key] = false;
						});
						this.$set(item, 'edittingCell', edittingCell);
						return item;
					}
				});

				this.thisTableData = res;
				this.edittingStore = JSON.parse(JSON.stringify(this.thisTableData));
				this.inputValue = JSON.parse(JSON.stringify(this.thisTableData));
				this.columnsList.forEach(item => {
					if(item.rule) {
						this.rules[item.key] = item.rule
					}
					if(item.editable) {
						item.render = (h, param) => {
							let currentRow = this.thisTableData[param.index];
							let inputCurrentRow = this.inputValue[param.index];
							if(!currentRow.editting) {
								if(this.editIncell) {
									return h('Row', {
										props: {
											type: 'flex',
											align: 'middle',
											justify: 'center'
										}
									}, [
										h('Col', {
											props: {
												span: '22'
											}
										}, [!currentRow.edittingCell[param.column.key] ?
											h('span', currentRow[item.key]) :
											cellInput(this, h, param, item)
										]),
										h('Col', {
											props: {
												span: '2'
											}
										}, [
											currentRow.edittingCell[param.column.key] ?
											saveIncellEditBtn(this, h, param) :
											incellEditBtn(this, h, param)
										])
									]);
								}
								else {
									return h('span', currentRow[item.key]);
								}
							}
							else {
								if(item.editrender)
									return item.editrender(vm, h, param, inputCurrentRow, item)
								else
									return h('Row', {
										props: {
											type: "flex",
											justify: "center",
											align: "middle"
										}
									}, [h('Col', {
										props: {
											span: '24'
										}
									}, [h('Input', {
										props: {
											type: 'text',
											value: inputCurrentRow[item.key]
										},
										on: {
											'on-change' (event) {
												let key = param.column.key;
												vm.edittingStore[param.index][key] = event.target.value;
											}
										}
									})])])
							}
						};
					}
					if(item.handle) {
						item.render = (h, param) => {
							let currentRowData = this.thisTableData[param.index];
							let children = [];
							item.handle.forEach(item => {
								if(item === 'edit') {
									children.push(editButton(this, h,
										currentRowData, param.index));
								}
								else if(item === 'delete') {
									children.push(deleteButton(this, h,
										currentRowData, param.index));
								}
							});
							return h('div', children);
						};
					}
				});
			},
			handleBackdata(data) {
				let clonedData = JSON.parse(JSON.stringify(data));
				clonedData.forEach(item => {
					delete item.editting;
					delete item.edittingCell;
					delete item.saving;
				});
				return clonedData;
			}
		},
		watch: {
			exportConfig_Clicked(val) {
				this.exportData(this.exportConfig.name)
			},
			exportConfig: {
				handler(newVal, oldVal) {
					if(newVal && oldVal) {
						if(newVal.clicked > 0)
							this.exportConfig_Clicked = newVal.clicked
					}
				},
				immediate: true,
				deep: true
			},
			onkeyup(e) {
				if(e.keyCode == 16 || e.keyCode == 17) {
					e.preventDefault();
					if(e.keyCode == 16) this.shiftdown = false;
					if(e.keyCode == 17) this.ctrdown = false;
					document.onselectstart = function(event) {
						return true
					}
				}
			},
			onkeydown(e) {
				if(e.keyCode == 16 || e.keyCode == 17) {
					e.preventDefault();
					if(e.keyCode == 16) this.shiftdown = true;
					if(e.keyCode == 17) this.ctrdown = true; // 禁止鼠标选中文字  。   
					document.onselectstart = function(event) {
						event = window.event || event;
						event.returnValue = false;
					}
				}
			},
			value(data) {
				if(data.length == 0) {
					this.selectRowIndex = -1;
				}
				this.init();
			},
			edit(val) {
				if(this.selectRowIndex != -1 && val) {
					this.edittingStore[this.selectRowIndex].editting = true;
					this.thisTableData = JSON.parse(JSON.stringify(this.edittingStore));
				}
			},
			selectRowIndex(val, old) {
				//此乃精髓
				if(this.shiftdown && val != -1 && old != -1 && this.selectRowIndexArray.length == 0) {
					if(old < val)
						for(let i = old; i <= val; i++)
							this.selectRowIndexArray.push(i)
					else
						for(let i = old; i >= val; i--)
							this.selectRowIndexArray.push(i)
				}
				if(this.shiftdown && val != -1 && old != -1 && this.selectRowIndexArray.length > 0) {
					let beg = this.selectRowIndexArray[0]
					this.selectRowIndexArray.splice(0)
					if(val < beg)
						for(let i = beg; i >= val; i--)
							this.selectRowIndexArray.push(i)
					else
						for(let i = beg; i <= val; i++)
							this.selectRowIndexArray.push(i)
				}

				if(this.ctrdown) {
					if(!this.ctrdownInit) {
						if(this.selectRowIndexArray.indexOf(old) == -1 && old != -1)
							this.selectRowIndexArray.push(old)
						this.ctrdownInit = true;
					}
					if(this.selectRowIndexArray.indexOf(val) == -1 && val != -1)
						this.selectRowIndexArray.push(val)
					else if(this.selectRowIndexArray.indexOf(val) != -1) {
						this.selectRowIndexArray.splice(this.selectRowIndexArray.indexOf(val), 1)
						if(this.selectRowIndexArray.length == 0) {
							this.selectRowIndex = -1
						}
					}

				}
				if(!this.shiftdown && !this.ctrdown && this.selectRowIndexArray.length > 0) {
					this.selectRowIndexArray.splice(0)
					this.ctrdownInit = false;
				}
				this.$emit("select-row-index", val);

			}
		}
	};
</script>