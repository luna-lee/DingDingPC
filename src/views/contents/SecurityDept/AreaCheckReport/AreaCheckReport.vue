<template>
	<div>
		<moon-loading v-show="showLoading" position-el="body"></moon-loading>
		<div style="width: 100%;" :style="{'height': mainRouterAreaHeight+'px'}">
			<Row type="flex" align="top">
				<Col span="24">
				<mytable :set-buttons="buttons" @delete="deleteData" :no-data-text="noDataText" :data="tableData" :columns="tableColumn" :height="mainRouterAreaHeight-30"
				 :on-query="onQuery"></mytable>
				</Col>
			</Row>
		</div>
		<Modal v-model="searchDialog" :mask-closable="false" :closable="false" @on-ok="searchOk">
			<p slot="header" style="text-align:center;font-size: 18px;">
				<Icon type="information-circled"></Icon>
				<span>查询条件</span>
			</p>
			<div style="text-align:center;">
				<div>
					场地名称：
					<AutoComplete v-model="conditionName" :data="name_data" :filter-method="filterMethod" placeholder="输入场地名称"
					 style="width: auto"> </AutoComplete>
					<br /> 开始日期：
					<DatePicker type="date"    placeholder="选择开始日期" format="yyyy/MM/dd":value="begTime" @on-change="begTimeChange"   style="width: 164px"></DatePicker>
					<br /> 结束日期：
					<DatePicker type="date"    placeholder="选择结束日期" format="yyyy/MM/dd":value="endTime" @on-change="endTimeChange"   style="width: 164px"></DatePicker>

				</div>
			</div>

		</Modal>
	</div>
</template>

<script>
	import index from "./index"
	export default index
</script>

<style scoped lang="less">
	@import"./AreaCheckReport.less";
</style>

<style scoped>
	.moon-tree-rightclick>li:hover {
		background: #f3f3f3;
	}
	
	.contentCard>>>.ivu-card-head {
		padding: 2px;
	}
	
	.treeCadStell>>>.moon-tree-last {
		margin-top: 5px;
		font-size: 100%;
		/* 字体大小设置成%*/
		font-family: "宋体";
	}
	
	.treeCadStell>>>.moon-tree-root {
		/*font-size: 15px;*/
		font-size: 100%;
		/* 字体大小设置成%*/
		font-family: "宋体";
	}
	
	.treeCadStell>>>.moon-dropdown {
		width: 150px;
	}
</style>