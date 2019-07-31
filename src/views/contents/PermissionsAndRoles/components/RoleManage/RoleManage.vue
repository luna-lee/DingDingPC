<template>
	<div>
		<moon-loading v-show="showLoading" position-el="body"></moon-loading>
		<div class="treeCadStell" style="width:100%;" :style="{height:mainRouterAreaHeight-44+'px'}">
			<moon-tree ref="moontree" v-model="treeData" @on-selected="onSelected" :tree-structure="treeStructure"
			 rightclick="on" @rightclick="rightClickId" checkbox="off" checkbox-size="large">
				<ul class="moon-tree-rightclick">
					<li @click="addTreeNode" v-show="rightClickNodeId[treeStructure.id] == 'root'">
						<moon-icon name="moon-icon-tianjia" style="width: 13px;height: 13px;"></moon-icon>
						增加角色
					</li>
					<li @click="onQueryRole" v-show="rightClickNodeId[treeStructure.id] == 'root'">
						<moon-icon name="moon-icon-fangdajing" style="width: 13px;height: 13px;"></moon-icon>
						人员角色查询
					</li>
					<li @click="deleteTreeNode" v-show="rightClickNodeId[treeStructure.id] != 'root'">
						<moon-icon name="moon-icon-shanchu" style="width: 13px;height: 13px;"></moon-icon>
						删除角色
					</li>
					<li @click="editTreeNode" v-show="rightClickNodeId[treeStructure.id] != 'root'">
						<moon-icon name="moon-icon-edit" style="width: 13px;height: 13px;"></moon-icon>
						修改角色名称
					</li>

					<li @click="Distribution" v-show="rightClickNodeId[treeStructure.id] != 'root'">
						<moon-icon name="moon-icon-fenpeijiaose" style="width: 13px;height: 13px;"></moon-icon>
						分配当前角色
					</li>
				</ul>
			</moon-tree>
		</div>
		<Modal v-model="addModel" :mask-closable="false" :closable="false">
			<p slot="header" style="text-align:center;font-size: 18px;">
				<Icon type="information-circled"></Icon>
				<span>{{rightClickNodeId[treeStructure.id] == 'root' ? "新增角色" : "在“" + rightClickNodeId[treeStructure.title] +
					"”角色上新增一个子角色"}}</span>
			</p>
			<div style="text-align:center;">
				<Form ref="addForm" :model="formInline" :rules="ruleInline" :label-width="100">
					<FormItem prop="inputValName" label="角色名">
						<Input type="text" v-model="formInline.inputValName" placeholder="填写新增角色名">
						</Input>
					</FormItem>
				</Form>
			</div>
			<div slot="footer">
				<Button @click="addCancel">取消</Button>
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
					<p>确定删除 <span style='font-size: large;font-weight: bold;'>{{rightClickNodeId[treeStructure.title]}}</span>这个角色吗？</p>
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
				<span>修改角色</span>
			</p>
			<div>
				<Form ref="editForm" :model="formInline" :rules="ruleInline" :label-width="100">
					<Row type="flex" justify="start" align="middle">
						<Col span="12">
						<FormItem label="当前角色名">
							<Input type="text" v-model="rightClickNodeId[treeStructure.title]" placeholder="修改后的角色名">
							</Input>
						</FormItem>
						</Col>
						<Col span="12">
						<FormItem prop="inputValName" label="新角色名">
							<Input type="text" v-model="formInline.inputValName" placeholder="修改后的角色名">
							</Input>
						</FormItem>
						</Col>
					</Row>

				</Form>
			</div>
			<div slot="footer">
				<Button @click="editCancel">取消</Button>
				<Button type="primary" @click="editOk">确定</Button>
			</div>
		</Modal>
		<Modal width="700" style="padding: 0;" v-model="DistributionModal" :closable="false" :mask-closable="false"
		 :styles="{top: '20px'}">
			<p slot="header" style="text-align:center;font-size: 18px;">
				<Icon type="information-circled"></Icon>
				<span>分配“{{rightClickNodeId[treeStructure.title]}}”角色</span>
			</p>
			<div>
				<mytable ref="mytable" @import-file="importFile" :set-buttons="buttons" :data="tableData" :columns="tableColumn"
				 delete-style="message" :height="mainRouterAreaHeight/2" @save="saveData" @delete="deleteData" @editing="onEditing"></mytable>
			</div>
			<div slot="footer">
				<Button :disabled="Disabled" @click="DistributionModaCancel">取消</Button>
				<Button type="primary" :loading="ModalLoading" :disabled="Disabled" @click="DistributionModalOk">确定</Button>
			</div>

		</Modal>
		<Modal width="700" style="padding: 0;" v-model="queryRoleModal" :closable="false" :mask-closable="false"
		 :styles="{top: '20px'}">
			<p slot="header" style="text-align:center;font-size: 18px;">
				<Icon type="information-circled"></Icon>
				<span>人员角色查询</span>
			</p>
			<div>
				<Row>
					<Input v-model="QueryRoleModalInput" placeholder="请输入帐号..." style="width: 200px" />
					<span @click="QueryRoleModalSearch" style="margin: 0 10px;"><Button  type="primary" icon="search">搜索</Button></span>
				</Row>
				<Row style="margin-top: 10px;">
					<Table :loading="QueryRoleModalTableLoading" :height="mainRouterAreaHeight/2" :columns="queryRoleTableColum"
					 :data="queryRoleTableData"></Table>
				</Row>

			</div>
			<div slot="footer">
				<Button type="primary" @click="onQueryRoleModalOk">确定</Button>
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
	
	.moon-dropdown {
		width: 250px;
	}
	
	.treeCadStell>>>.moon-checkbox-checked .moon-checkbox-inner:after {
		left: 20%;
		height: 85%;
		width: 50%;
		top: 2%;
	}
	
	.treeCadStell>>>.moon-checkbox-indeterminate .moon-checkbox-inner:after {
		width: 90%;
		height: 0px;
		left: 5%;
		top: 45%;
	}
</style>