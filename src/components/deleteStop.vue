<template>
    <div>
        <el-autocomplete
                v-model="state"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
        >
        </el-autocomplete> <el-button type="primary" icon="el-icon-search" @click="query">搜索</el-button>
    </div>


</template>

<script>
    export default {
        name: "deleteStop",
        data() {
            return {
                restaurants: [],
                state: '',
                timeout:  null
            };
        },
        methods: {
            loadAll() {
                return [
                    { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
                    { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
                    { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
                    { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
                    { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
                    { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
                    { "value": "阳阳麻辣烫", "address": "天山西路389号" },
                    { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
                ];
            },
            querySearchAsync(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results); //数据准备好后的回调接口
                }, 3000 * Math.random());
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log(item);
            }
        },
        /*query(){
            this.$axios.post("/DelStop",6).then(responseText=>{
                console.log(responseText);
            }).catch((error)=>{
                console.log(error);//这句话必须写，以便于控制端调试代码
            })
        },*/
        mounted() {
            this.restaurants = this.loadAll();
        }
    }
</script>

<style scoped>

</style>