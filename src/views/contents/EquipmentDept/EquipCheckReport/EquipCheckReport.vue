<template>
	<div>
		<moon-loading v-show="showLoading" position-el="#tableData"></moon-loading>
		<Row>
			<Card id="tableData">
				<table cellpadding="0" cellspacing="0" width="100%" slot="title">
					<tr>
						<th>管理部门：</th>
						<td>
							<Select v-model="selectDept" style="width:150px" size="small" filterable>
								<Option v-for="item in Dept" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</td>
						<th>点检类别：</th>
						<td>
							<Select v-model="selectType" style="width:150px" size="small">
								<Option v-for="item in checkType" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</td>
						<th>时间跨度：</th>
						<td>
							<div v-show="selectType=='操作工日常点检'" style="display: inline-block;">
								<DatePicker :value="timeAreaBeg" @on-change="onChangeTimeBeg" :options="disabledDate" split-panels show-week-numbers
								 type="date" placement="bottom-end" placeholder="Select date" style="width: 110px"></DatePicker>
								~
								<DatePicker :value="timeAreaEnd" @on-change="onChangeTimeEnd" :options="disabledDate" split-panels show-week-numbers
								 type="date" placement="bottom-end" placeholder="Select date" style="width: 110px"></DatePicker>

							</div>
							<div v-show="selectType=='部门一级保养'" style="display: inline-block;">
								<DatePicker :value="timeAreaBeg" @on-change="onChangeTimeBeg" :options="disabledMonth" split-panels show-week-numbers
								 type="month" placement="bottom-end" placeholder="Select date" style="width: 110px"></DatePicker>
								~
								<DatePicker :value="timeAreaEnd" @on-change="onChangeTimeEnd" :options="disabledMonth" split-panels show-week-numbers
								 type="month" placement="bottom-end" placeholder="Select date" style="width: 110px"></DatePicker>
							</div>
							<div v-show="selectType=='保障组巡检'" style="display: inline-block;">
								<DatePicker :value="timeAreaBeg" @on-change="onChangeTimeBeg" :options="disabledDate" split-panels show-week-numbers
								 type="month" placement="bottom-end" placeholder="Select date" style="width: 110px"></DatePicker>
								~
								<DatePicker :value="timeAreaEnd" @on-change="onChangeTimeEnd" :options="disabledDate" split-panels show-week-numbers
								 type="month" placement="bottom-end" placeholder="Select date" style="width: 110px"></DatePicker>
							</div>
							<div v-show="selectType=='设备管家'" style="display: inline-block;">
								<DatePicker :value="timeAreaBeg" @on-change="onChangeTimeBeg" :options="disabledMonth" split-panels show-week-numbers
								 type="month" placement="bottom-end" placeholder="Select date" style="width: 110px"></DatePicker>
								~
								<DatePicker :value="timeAreaEnd" @on-change="onChangeTimeEnd" :options="disabledMonth" split-panels show-week-numbers
								 type="month" placement="bottom-end" placeholder="Select date" style="width: 110px"></DatePicker>
							</div>
						</td>
						<!--<th v-show="selectType=='保障组巡检'">周数：</th>-->
						<th v-show="selectType=='操作工日常点检'">天数：</th>
						<th v-show="selectType=='部门一级保养'||selectType=='设备管家'||selectType=='保障组巡检'">月数：</th>
						<td>
							<Input v-model="needCheckNum" readonly style=" width: 35px;"></Input>
						</td>
						<td>
							<Button type="primary" @click="getData"><Icon type="ios-search"></Icon>查询</Button>
						</td>
						<td>
							<Button type="primary" @click="exportData"><Icon type="ios-download-outline"></Icon> 导出数据</Button>
						</td>
					</tr>
					<tr v-show="true">
						<td>&nbsp;</td>
						<td>&nbsp;</td>
						<td>&nbsp;</td>
						<td>&nbsp;</td>
						<td>&nbsp;</td>
						<td style="  color:red;font-size:smaller;">{{warnMeg}}</td>
					</tr>
				</table>
				<Row>
					<Col span="24">
					<Table :height="mainRouterAreaHeight-100" :columns="tableColumns" :data="tableData" size="small" ref="table"></Table>
					</Col>
					</Col>
				</Row>
			</Card>
		</Row>
	</div>
</template>

<script>
	import index from "./index"
	export default index
</script>

<style scoped lang="less">
	@import"./EquipCheckReport.less";
</style>