<template>
	<div>
		<moon-loading v-show="showLoadingKeeping" position-el="body"></moon-loading>
		<moon-loading v-show="showLoading" position-el="body"></moon-loading>
		<Row type="flex" justify="center" align="middle">
			<Col span="7">
			<Card style="margin: 5px 2px;">
				<role ref="role" :data="roleTreeData" @on-roledata="onRoledata"></role>
			</Card>
			</Col>
			<Col span="7">
			<Card style="margin: 5px 2px;">
				<div class="treeCadStell" style="width:100%;" :style="{height:mainRouterAreaHeight-44+'px'}">
					<moon-tree ref="moontree" v-model="treeDataPermissionOnRole" @on-selected="onSelected" :tree-structure="treeStructure"
					 rightclick="on" @rightclick="rightClickId" checkbox="off" checkbox-size="large">
						<ul class="moon-tree-rightclick">
							<li @click="deletePmsOnRole" v-show="rightClickNodeId[tables.permission.colum.pk] !=root">
								<moon-icon name="moon-icon-shanchu" style="width: 13px;height: 13px;"></moon-icon>
								删除权限
							</li>
						</ul>
					</moon-tree>
				</div>
			</Card>
			</Col>
			<Col span="1">
			<Button size="large" style="background: white;" @click="onButton"><</Button>
			</Col>
			<Col span="8">
			<Card style="margin: 5px 2px;">
				<permission ref="permission" :data="permissionTreeData" @on-permissiondata="onPermissiondata"></permission>
			</Card>
			</Col>

		</Row>
		<Modal v-model="deleteModel" :mask-closable="false" :closable="false">
			<p slot="header" style=" color:#f60; text-align:center;font-size: 18px;">
				<Icon type="information-circled"></Icon>
				<span>删除确认</span>
			</p>
			<div style="text-align:center;">
				<div>
					<p>确定删除 <span style='font-size: large;font-weight: bold;'>{{rightClickNodeId[treeStructure.title]}}</span>这个钉钉权限吗？</p>
				</div>
			</div>
			<div slot="footer">
				<Button @click="deleteCancel">取消</Button>
				<Button type="primary" @click="deleteOk">确定</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
	import index from "./index"
	export default index
</script>

<style scoped>
	.moon-tree-rightclick {
		/*去li前面的点*/
		list-style-type: none;
		/*li顶格*/
		padding: 0px;
		margin: 0px;
		position: relative;
		/*文字缩进*/
		text-indent: 1em;
		font-size: 10px;
		font-family: "宋体";
	}
	
	.moon-tree-rightclick>li {
		border-bottom: 0px solid #D0D0D0;
		/**字母大写   capitalize首字母大写  uppercase大写 lowercase 小写*/
		text-transform: uppercase;
		height: 25px;
		line-height: 25px;
	}
	
	.moon-tree-rightclick>li:hover {
		background: #f3f3f3;
	}
	
	.contentCard>>>.ivu-card-head {
		padding: 2px;
	}
	
	.treeCadStell>>>.moon-tree-last {
		margin-top: 5px;
		font-size: 15px;
		font-family: "宋体";
		margin-left: 2rem;
	}
	
	.treeCadStell>>>.moon-tree-mid {
		margin-top: 5px;
		font-size: 15px;
		font-family: "宋体";
		margin-left: 2rem;
	}
	
	.treeCadStell>>>.moon-tree-root {
		font-size: 18px;
	}
	
	.treeCadStell {
		border-radius: 0 0 3px 3px;
		padding: 10px;
		overflow: auto;
	}
	
	.treeCadStell>>>.moon-tree-td-checkbox {
		width: 1.5rem;
	}
	
	.treeCadStell>>>.moon-dropdown {
		width: 45%;
	}
	
	.treeCadStell>>>.moon-checkbox-checked .moon-checkbox-inner:after {
		left: 30%;
		height: 85%;
		width: 50%;
		top: 2%;
	}
	
	.treeCadStell>>>.moon-checkbox-indeterminate .moon-checkbox-inner:after {
		width: 90%;
		height: 0px;
		left: 10%;
		top: 45%;
	}
</style>