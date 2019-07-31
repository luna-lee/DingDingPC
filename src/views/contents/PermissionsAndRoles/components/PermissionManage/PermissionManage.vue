<template>
	<div>
		<moon-loading v-show="showLoading" position-el="body"></moon-loading>
		<div class="treeCadStell" style="width:100%;" :style="{height:mainRouterAreaHeight-44+'px'}">
			<moon-tree ref="moontree" v-model="treeData" @on-selected="onSelected" :tree-structure="treeStructure"
			 rightclick="on" @rightclick="rightClickId" checkbox="on" checkbox-size="large">
				<ul class="moon-tree-rightclick">
					<li @click="addTreeNode">
						<moon-icon name="moon-icon-tianjia" style="width: 13px;height: 13px;"></moon-icon>
						<span v-show="rightClickNodeId[treeStructure.parentId] == ''">增加权限</span>
						<span v-show="rightClickNodeId[treeStructure.parentId] != ''">增加子权限</span>
					</li>
					<li @click="deleteTreeNode" v-show="rightClickNodeId[treeStructure.parentId] != ''">
						<moon-icon name="moon-icon-shanchu" style="width: 13px;height: 13px;"></moon-icon>
						删除权限
					</li>
					<li @click="editTreeNode" v-show="rightClickNodeId[treeStructure.parentId] != ''">
						<moon-icon name="moon-icon-edit" style="width: 13px;height: 13px;"></moon-icon>
						修改权限名称
					</li>
				</ul>
			</moon-tree>
		</div>
		<Modal v-model="addModel" :mask-closable="false" :closable="false">
			<p slot="header" style="text-align:center;font-size: 18px;">
				<Icon type="information-circled"></Icon>
				<span>{{rightClickNodeId[treeStructure.parentId] == '' ? "新增权限" : "在“" + rightClickNodeId[treeStructure.title] +
					"”权限上新增一个子权限"}}</span>
			</p>
			<div style="text-align:center;">
				<Form ref="addForm" :model="formInline" :rules="ruleInline" :label-width="100">
					<FormItem prop="inputValName" label="权限名">
						<Input type="text" v-model="formInline.inputValName" placeholder="填写新增权限名">
						</Input>
					</FormItem>
					<FormItem prop="inputValKey" label="权限键值">
						<Input type="text" v-model="formInline.inputValKey" placeholder="填写新增权限键值">
						</Input>
					</FormItem>
				</Form>
			</div>
			<div slot="footer">
				<Button  @click="addCancel">取消</Button>
				<Button type="primary" @click="addOk">确定</Button>
			</div>
		</Modal>
		<Modal v-model="deleteModel" :mask-closable="false" :closable="false">
			<p slot="header" style=" color:#f60; text-align:center;font-size: 18px;" >
				<Icon type="information-circled"></Icon>
				<span>删除确认</span>
			</p>
			<div style="text-align:center;"> 
				<div>
					<p>确定删除 <span style='font-size: large;font-weight: bold;'>{{rightClickNodeId[treeStructure.title]}}</span>这个权限吗？</p>
				</div>
			</div>
			<div slot="footer">
				<Button @click="deleteCancel">取消</Button>
				<Button type="primary" @click="deleteOk">确定</Button>
			</div>
		</Modal>
		<Modal v-model="editModel" :mask-closable="false" :closable="false">
			<p slot="header" style="text-align:center;font-size: 18px;">
				<Icon type="information-circled"></Icon>
				<span>修改权限</span>
			</p>
			<div>
				<Form ref="editForm" :model="formInline" :rules="ruleInline" :label-width="100">
					<Row type="flex" justify="start" align="middle">
						<Col span="12">
						<FormItem label="当前权限名">
							<Input type="text" v-model="rightClickNodeId[treeStructure.title]" placeholder="修改后的权限名">
							</Input>
						</FormItem>
						<FormItem label="当前权限键值"> 
							<Input type="text" v-model="rightClickNodeId[tables.permission.colum.key]" placeholder="修改后的权限键值">
							</Input>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem prop="inputValName" label="新权限名">
							<Input type="text" v-model="formInline.inputValName" placeholder="修改后的权限名">
							</Input>
						</FormItem>
						<FormItem prop="inputValKey" label="新权限键值">
							<Input type="text" v-model="formInline.inputValKey" placeholder="修改后的权限键值">
							</Input>
						</FormItem>
						</Col>
					</Row>

				</Form>
			</div>
			<div slot="footer">
				<Button  @click="editCancel">取消</Button>
				<Button type="primary" @click="editOk">确定</Button>
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
	
 
	.treeCadStell>>>.moon-checkbox-checked .moon-checkbox-inner:after {
		left: 30%;
		height: 85%;
		width: 45%;
		top: 2%;
	}
	
	.treeCadStell>>>.moon-checkbox-indeterminate .moon-checkbox-inner:after {
		width:75%;
		height: 0px;
		left: 10%;
		top: 45%;
	}
</style>