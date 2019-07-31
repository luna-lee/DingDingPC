<template>
	<div>
		<moon-loading v-show="showLoading" position-el="body"></moon-loading>
		<div style="width: 100%;" :style="{'height': mainRouterAreaHeight+'px'}">
			<Split v-model="split">
				<div slot="left">

					<Row type="flex" align="top">
						<Col span="24">
						<mytable   @import-file="importFile" :set-buttons="buttons" :no-data-text="noDataText" :data="tableData" :columns="tableColumn"
						 :height="mainRouterAreaHeight-75" @save="saveData" @delete="deleteData" :on-query="onQuery" @editing="onEditing"  ></mytable>
						</Col>
					</Row>
					<Row type="flex" align="top" :style="{'pointer-events': isEditing ?'none':'all','opacity':isEditing ?'0.6':'1'}">
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
										增加{{config.comName.name}}
									</li>
									<li @click="deleteTreeNode" v-show="rightClickNodeId[treeStructure.parentId] != ''">
										<moon-icon name="moon-icon-shanchu" style="width: 13px;height: 13px;"></moon-icon>
										删除{{config.comName.name}}
									</li>
									<li @click="editTreeNode" v-show="rightClickNodeId[treeStructure.parentId] != ''">
										<moon-icon name="moon-icon-edit" style="width: 13px;height: 13px;"></moon-icon>
										修改{{config.comName.name}}名称
									</li>
									<li @click="qrcodeNode" v-show="rightClickNodeId[treeStructure.parentId] != ''">
										<!--<moon-icon name="moon-icon-edit" style="width: 13px;height: 13px;"></moon-icon>-->
										<Icon type="md-qr-scanner" size="13" color="blue" style="margin-left: -10px;" /> 生成二维码
									</li>
								</ul>
							</moon-tree>
						</div>
					</Card>
				</div>
			</Split>
		</div>

		<Modal v-model="openQrcode" :mask-closable="false" :closable="false" @on-ok="qrcodeOk"  
		 ok-text="下载">
			<p slot="header" style="   text-align:center;font-size: 18px;">
				<Icon type="information-circled"></Icon>
				<span>二维码生成器</span>
			</p>
			<div style="text-align:center;">
				<div>
					<canvas id="canvas" ref="canva"></canvas>
				</div>
			</div>
			<!--<div slot="footer">
				<Button type="primary" @click="qrcodeOk">下载</Button>
				<Button type="primary" @click="qrcodeCancel">取消</Button>
			</div>-->
		</Modal>
	</div>
</template>

<script>
	import index from "./index"
	export default index
</script>

<style scoped lang="less">
	@import"./AreaCheckPoint.less";
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