<template>
	<div>
		<moon-loading v-show="showLoading" position-el="body"></moon-loading>
		<div style="width: 100%;" :style="{'height': mainRouterAreaHeight+'px'}">
			<!--<Split v-model="split">-->
			<!--<div slot="left">-->
			<Row type="flex" align="top">
				<Col span="24">
				<mytable @import-file="importFile" :set-buttons="buttons" :no-data-text="noDataText" :data="tableData"
				 :columns="tableColumn" :height="mainRouterAreaHeight-30" @save="saveData" @delete="deleteData" @editing="onEditing"
				 :on-free01="onFree01">

				</mytable>
				</Col>
			</Row>
			<!--</div>-->
			<!--
				<div slot="right" style="background: white;">
					<Card :padding="0" :style="{'pointer-events': isEditing ?'none':'all','opacity':isEditing ?'0.6':'1'}">
						<Row type="flex" justify="center" :style="{'height': mainRouterAreaHeight-5+'px'}">
							<Col span="24">
							<div style="margin-top: 20px;margin-left: 20px;"> 
								<Button type="primary" @click="qRCode">生成并下载二维码</Button>
							</div>

							</Col>
						</Row>
					</Card>
				</div>-->
			<!--</Split>-->
		</div>
	</div>
</template>

<script>
	import index from "./index"
	export default index
</script>

<style scoped lang="less">
	@import"./QRCode.less";
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