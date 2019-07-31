<template>
	<div>
		<div style="width: 100%;" :style="{'height': tableHeight+'px'}">
			<split-pane :style="{'height': '100%'}" right :min="20" max="100" direction="horizontal" v-model="triggerOffset">
				<div slot="left" style="height: 100%; position: relative;">
					<moon-loading v-show="showLoading"></moon-loading>
					<mytable :page-total="pageTotal" :data="tableData" :columns="tableColumn" :height="tableHeight-75"
					 @save="saveData" @delete="deleteData" :on-cell-button="onCellButton" :on-query="onQuery"></mytable>
					<Row type="flex" align="top">
						<Col span="24">
						<Page :key="selectQueryButton" :total="pageTotal" :page-size-opts="[10,50]" show-elevator show-sizer
						 show-total style="text-align: center; margin-top:10px" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
						</Col>
					</Row>
				</div>

				<div class="split-pane-right-con" slot="right" style=" height: 100%; margin-top: -2px;">
					<Card :padding="0">
						<div class="treeCadStell" :style="{'height':  tableHeight+'px'}">
							<moon-tree ref="moontree" :data="treeData" v-model="treeSelect" :tree-structure="treeStructure" rightclick="on"
							 @rightclick="rightClickId">
								<ul class="moon-tree-rightclick">
									<li @click="addTreeNode">
										<moon-icon name="moon-icon-tianjia" style="width: 13px;height: 13px;"></moon-icon>
										增加子节点
									</li>
									<li @click="deleteTreeNode">
										<moon-icon name="moon-icon-shanchu" style="width: 13px;height: 13px;"></moon-icon>
										删除节点
									</li>
									<li @click="editTreeNode">
										<moon-icon name="moon-icon-edit" style="width: 13px;height: 13px;"></moon-icon>
										修改名称
									</li>
								</ul>
							</moon-tree>
						</div>
					</Card>
				</div>
			</split-pane>
		</div>

	</div>
</template>

<script>
	import index from "./index"
	export default index
</script>

<style scoped lang="less">
	@import"./demo2.less";
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