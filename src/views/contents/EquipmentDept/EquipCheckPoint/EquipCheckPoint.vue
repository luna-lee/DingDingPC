<template>
	<div>
		<moon-loading v-show="showLoading" position-el="body"></moon-loading>
		<div style="width: 100%;" :style="{'height': mainRouterAreaHeight+'px'}">
			<Split v-model="split">
				<div slot="left">
					<Row type="flex" align="top">
						<Col span="24">
						<mytable @import-file="importFile" :set-buttons="buttons" :no-data-text="noDataText" :data="tableData" :columns="tableColumn"
						 :height="mainRouterAreaHeight-75" @save="saveData" @delete="deleteData" :on-query="onQuery" @editing="onEditing" ></mytable>
						</Col>
					</Row>
					<Row type="flex" align="top"  :style="{'pointer-events': isEditing ?'none':'all','opacity':isEditing ?'0.6':'1'}">
						<Col span="24">
						<Page :key="selectQueryButton" :total="pageTotal" :page-size-opts="[10,50]" show-elevator show-sizer
						 show-total style="text-align: center; margin-top:8px" @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
						</Col>
					</Row>
				</div>

				<div slot="right" style="background: white;">
					<Card :padding="0" :style="{'pointer-events': isEditing ?'none':'all','opacity':isEditing ?'0.6':'1'}">
						<div class="treeCadStell" :style="{'height': mainRouterAreaHeight-4+'px'}">
							<moon-tree ref="moontree" v-model="treeData" @on-selected="onSelected" :tree-structure="treeStructure"
							 rightclick="on" @rightclick="rightClickId">
								<ul class="moon-tree-rightclick">
									<li @click="addTreeNode" v-show="rightClickNodeId[treeStructure.parentId] == ''">
										<moon-icon name="moon-icon-tianjia" style="width: 13px;height: 13px;"></moon-icon>
										增加设备
									</li>
									<li @click="deleteTreeNode" v-show="rightClickNodeId[treeStructure.parentId] != ''">
										<moon-icon name="moon-icon-shanchu" style="width: 13px;height: 13px;"></moon-icon>
										删除设备
									</li>
									<li @click="editTreeNode" v-show="rightClickNodeId[treeStructure.parentId] != ''">
										<moon-icon name="moon-icon-edit" style="width: 13px;height: 13px;"></moon-icon>
										修改设备名称
									</li>
									<li @click="moveTreeNode" v-show="rightClickNodeId[treeStructure.parentId] != ''">
										<moon-icon name="moon-icon-yidong" style="width: 13px;height: 13px;"></moon-icon>
										移动分类
									</li>
									<ul class="moon-tree-rightclick" style="margin-left: 35px;" v-show="moveTreeNodeDropShow">
										<li @click="moveUpdate('一类设备',moveToFist)" v-show="rightClickNodeId.free02!= '一类设备'">1.一类设备</li>
										<li @click="moveUpdate('二类设备',moveToSecond)" v-show="rightClickNodeId.free02!= '二类设备'">2.二类设备</li>
										<li @click="moveUpdate('三类设备',moveToThird)" v-show="rightClickNodeId.free02!= '三类设备'">3.三类设备</li>
										<li @click="moveUpdate('四类设备',moveToFourth)" v-show="rightClickNodeId.free02!= '四类设备'">4.四类设备</li>
									</ul>
								</ul>
							</moon-tree>
						</div>
					</Card>
				</div>
			</Split>
		</div>
	</div>
</template>

<script>
	import index from "./index"
	export default index
</script>

<style scoped lang="less">
	@import"./EquipCheckPoint.less";
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