<template>
 <div>
        <Row>
            <Col span="24">
                <span style="font-weight: bold;">违章明细：</span>
                <span>{{ row.cknote }}</span>
            </Col>
 
        </Row> 
    </div>
</template>

<script>
	export default {
		props: {
			row: Object
		}
	};
</script>

<style>

</style>