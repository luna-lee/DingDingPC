<template>
	<div>
		<moon-loading v-show="showLoading" position-el="#tableShow"></moon-loading>
		<Row :gutter="16">
			<Col span="18">
			<Card class="contentCard" style="height: 82vh;background: #f7f7f7;" :padding="0" shadow>
				<div slot="title" style=" background: white;">
					<Button type="text" size="small"> <moon-icon name="moon-icon-tianjia"  style="width: 10px;height: 10px; margin-bottom: 2px;"></moon-icon> 增加</Button>
					<Button type="text" size="small"> <moon-icon name="moon-icon-shanchu"  style="width: 10px;height: 10px; margin-bottom: 2px;"></moon-icon> 删除</Button>
					<Button type="text" size="small"> <moon-icon name="moon-icon-fangdajing"  style="width: 10px;height: 10px; margin-bottom: 2px;"></moon-icon> 查询</Button>
					<Button type="text" size="small"> <moon-icon name="moon-icon-edit"  style="width: 10px;height: 10px; margin-bottom: 2px;"></moon-icon>修改</Button>
					<Button style="float: right;" type="text" size="small"><Icon type="ios-download-outline"></Icon> 导出自定义数据</Button>
				</div>
				<Row type="flex" align="top">
					<Col span="24">
					<Table :columns="tableColumn" :data="tableData" size="small" :height="550" id="tableShow" no-data-text=""
					 style="border: 0px solid #f7f7f7;"></Table>
					</Col>
				</Row>
				<Row type="flex" align="bottom">
					<Col span="24">
					<Page :total="pageTotal" :page-size-opts="[10,50]" show-elevator show-sizer show-total style="text-align: center;background: #f7f7f7; margin-top:10px"
					 @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
					</Col>
				</Row>

			</Card>
			</Col>
			<Col span="6">
			<Card :padding="0">
				<div class="treeCadStell" style="height: 82vh;">
					<moon-tree :data="treeData" v-model="treeSelect" :tree-structure="treeStructure" rightclick="on" @rightclick="rightClickId">
						<ul class="moon-tree-rightclick">
							<li @click="addNode">
								<moon-icon name="moon-icon-tianjia" style="width: 13px;height: 13px;"></moon-icon>
								增加子节点
							</li>
							<li @click="deleteNode">
								<moon-icon name="moon-icon-shanchu" style="width: 13px;height: 13px;"></moon-icon>
								删除节点
							</li>
							<li @click="editNode">
								<moon-icon name="moon-icon-edit" style="width: 13px;height: 13px;"></moon-icon>
								修改名称
							</li>
						</ul>
					</moon-tree>
				</div>
			</Card>
			</Col>

		</Row>
	</div>
</template>

<script>
	import index from "./index"
	export default index
</script>

<style scoped lang="less">
	@import"./demo.less";
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
		font-size: 10px;
		font-family: "宋体";
	}
</style>