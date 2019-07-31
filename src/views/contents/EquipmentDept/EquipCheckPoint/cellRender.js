export const Input_Search = ($this) => {
	return(vm, h, param, inputCurrentRow, currentColumn) => {
		return h('Row', {
			props: {
				type: "flex",
				justify: "center",
				align: "middle"
			}
		}, [h('Col', {
				props: {
					span: '20'
				}
			}, [h('Input', {
				props: {
					type: 'text',
					value: inputCurrentRow[currentColumn.key],
				},
				on: {
					'on-change' (event) {
						let key = param.column.key;
						vm.edittingStore[param.index][key] = event.target.value;
					}
				}
			})]),
			h('Col', {
				props: {
					span: '4'
				}
			}, [h('a', {
				class: {
					'ivu-btn': true, 'ivu-btn-text': true
				},
				props: {
					type: 'text',
				},
				style: {
					'padding': '5px 2px'
				},
				on: {
					click: (event) => {
						//						if(currentColumn.key == 'dailycheck') {
						$this.$Modal.confirm({
							title: '单元节点查询获取数据',
							content: '<p>单元节点查询获取数据</p>',
							onOk: () => {
								//将选择好的数据放入input
								inputCurrentRow[currentColumn.key] = $this.triggerOffset;
								//将选择好的数据放入数据源中
								vm.edittingStore[param.index][currentColumn.key] = $this.triggerOffset;
							},
							onCancel: () => {}
						});
						//						}
					}
				}
			}, [h('moon-icon', {
				props: {
					name: "moon-icon-fangdajing"
				},
				style: {
					width: '15px',
					height: '15px'
				}
			})])])
		]);
	}
}
/*h('Row', {
	props: {
		type: "flex",
		justify: "center",
		align: "middle"
	}
}, [h('Col', {
	props: {
		span: '24'
	}
}, [h('div', [])])]);*/
export const Selecte = ($this) => {
	return(vm, h, param, inputCurrentRow, currentColumn) => {
		let arr = [{
			value: '0',
			label: '0'
		}, {
			value: '1',
			label: '1'
		}];
		let a = vm.edittingStore[param.index][currentColumn.key]
		vm.edittingStore[param.index][currentColumn.key] = a ? a : '1';
		return h('Select', {
			props: {
				value: a ? a : '1',
				placeholder: ""
			},
			on: {
				'on-change' (val) {
					let key = param.column.key;
					vm.edittingStore[param.index][key] = val;
				}
			}
		}, [arr.map(function(item) {
			return h('Option', {
				props: {
					value: item.value
				}
			}, item.value)
		})])
	}
}
export const DatePicker = ($this) => {
	return(vm, h, param, inputCurrentRow, currentColumn) => {
		vm.edittingStore[param.index][currentColumn.key] = $this.comMethods.formatDate(1);
		return h('DatePicker', {
			props: {
				type: 'datetime',
				placeholder: "",
				clearable: false,
				value: new Date()
			},
			on: {
				'on-change' (val) {
					let key = param.column.key;
					vm.edittingStore[param.index][key] = val;
					console.log(JSON.stringify(vm.edittingStore))
				}
			}
		})
	}
}
const editCellRender = {
	Input_Search: Input_Search,
	Selecte: Selecte,
	DatePicker: DatePicker
};
export default editCellRender;