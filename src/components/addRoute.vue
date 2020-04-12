<template>
    <div>
        <template>
            <div align="center" style="margin-top: 15px;">
                <el-steps :active="active" align-center >
                        <el-step title="添加线路名" icon="el-icon-edit"></el-step>
                        <el-step title="添加公交站点" icon="el-icon-map-location"></el-step>
                        <el-step title="添加司机" icon="el-icon-user"></el-step>
                </el-steps>
            </div>
            <!--<el-button style="margin-top: 12px;" @click="next">下一步</el-button>-->
        </template>
        <template v-if="firstSeen">
            <div align="center" style="margin-top: 15px;">
                <el-input placeholder="请输入新线路全称" v-model="search" style="width: 300px" maxlength="10" show-word-limit clearable>
                    <el-button slot="append" icon="el-icon-upload" v-bind:loading="loading" @click="checkValid"></el-button>
                </el-input>
            </div>
        </template>
        <template v-if="secondSeen">
            <div  style="width: 600px;margin: 0px auto">
                <el-transfer
                        v-model="value"
                        :data="data"
                        filterable
                        :titles="['可选站点', '已选站点']"
                        target-order="push"
                >
                    <el-button type="primary" icon="el-icon-arrow-left" slot="left-footer" size="small" style="margin-left: 5px" plain @click="back2">上一步</el-button>
                    <el-button type="primary"  slot="right-footer" size="small" style="margin-left: 5px" plain @click="next2">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>

                </el-transfer>
            </div>
        </template>
        <template v-if="thirdSeen">
            <div  style="width: 600px;margin: 0px auto">
                <el-transfer
                        v-model="value2"
                        :data="driverData"
                        filterable
                        :titles="['可选司机', '已选司机']"
                        target-order="push"
                >
                    <el-button type="primary" icon="el-icon-arrow-left" slot="left-footer" size="small" style="margin-left: 5px" plain @click="back3">上一步</el-button>
                    <el-button type="primary"  slot="right-footer" size="small" style="margin-left: 5px" plain @click="submit">提交</el-button>

                </el-transfer>
            </div>
        </template>
    </div>

</template>

<script>
    export default {
        name: "addRoute",
        data() {
            const generateData = _ => {
                const data = [];
                //向服务端请求数据，渲染data
                this.$axios.post("/queryAllStop","test").then(responseText=>{
                    //返回查询数据
                    this.allStop=responseText.data;
                    for (let i = 0; i <this.allStop.length; i++) {
                        data.push({
                            key: i,
                            label:this.allStop[i].stop_name,
                        });
                    }
                    console.log(data);

                }).catch(error=>{
                    console.log(error);
                });
                return data;
            };
            const generateData2= _=>{
                const data2=[];
                this.$axios.post("/getDrivers","长春").then(responseText=>{
                    //返回查询数据
                    this.allDriver=responseText.data;
                    console.log(this.allDriver);
                    for(let i=0;i<this.allDriver.length;i++){
                        data2.push({
                            key:i,
                            label:this.allDriver[i].driver_name +" ID:"+this.allDriver[i].driver_id
                        });
                    }
                }).catch(error=>{
                    console.log(error);
                });
                return data2;
            };

            return {
                active: 0,
                search:'',
                firstSeen:true,
                secondSeen:false,
                thirdSeen:false,
                loading:false,
                allStop:[],
                allDriver:[],
                data: generateData(),
                value: [],
                driverData:generateData2(),
                value2:[],
                selectedStops:[],
                selectedDrivers:[]
            };
        },
        mounted:function(){
            //防止通过url直接跳过登录，页面加载时执行，和导航守卫的功能重叠了
            if(!sessionStorage.getItem("token")){
                this.$router.push("/");
            }
        },
        methods: {
            next() {
                if (this.active++ > 2) this.active = 0;
            },
            checkValid(){
                if(this.search!==''){
                    this.loading=true;
                    this.$axios.post("/selectRouteByName",this.search).then(responseText=>{
                        if(responseText.data.length>0){
                            this.loading=false;
                            this.$notify.info({
                                title: '提示',
                                message: '线路名称重复，请更换'
                            });

                        }else{
                            this.loading=false;
                            this.firstSeen=false;
                            this.secondSeen=true;
                            if(this.active<=2){
                                this.active++;
                            }
                            console.log(this.active);

                        }
                    }).catch(error=>{
                        console.log(error);
                    })
                }else{
                    this.$notify.info({
                        title: '提示',
                        message: '输入内容不能为空'
                    });
                }

            },
            back2(){
                this.secondSeen=false;
                this.firstSeen=true;
                this.active--;
            },
            back3(){
                this.thirdSeen=false;
                this.secondSeen=true;
                this.active--;
            },
            next2(){
                //this.secondSeen=false;
                if(this.active<3){
                    if(this.value.length>=2){
                        this.active++;
                        this.secondSeen=false;
                        this.thirdSeen=true;
                    }else{
                        this.$notify.info({
                            title: '提示',
                            message: '线路至少包括2个站点'
                        });
                    }

                }

            },
            test(){
                if(this.value2.length>0){
                    console.log(this.value2);
                    console.log(this.value);
                    console.log(this.search);
                }else{
                    this.$notify.info({
                        title: '提示',
                        message: '至少为此线路选择一位司机'
                    });
                }


            },
            submit(){
                if(this.value2.length>0){
                    //先清空
                    if(this.selectedStops.length>0){
                        this.selectedStops.splice(0,this.selectedStops.length);
                    }
                    if(this.selectedDrivers.length>0){
                        this.selectedDrivers.splice(0,this.selectedDrivers.length);
                    }
                    //初始化已选择的站点和已选择的司机
                    //route_id后端自动生成后修改，默认为0

                    for(let i=0;i<this.value.length;i++){
                        this.selectedStops.push({
                            station_id:this.allStop[this.value[i]].station_id,
                            route_id:0,
                            position:i+1,
                            description:this.search

                        })
                    }
                    for(let i=0;i<this.value2.length;i++){
                        this.selectedDrivers.push({
                            driver_id:this.allDriver[this.value2[i]].driver_id,
                            route_id:0,
                            description:this.search
                        });
                    }
                    console.log(this.selectedStops);

                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    //同步至数据库
                    this.$axios.post("/addRoute",this.selectedStops).then(responseText=>{
                        console.log(responseText);
                        //添加对应线路的司机
                        this.$axios.post("/addDriverRoute",this.selectedDrivers).then(responseText=>{
                            console.log("-----------------------");
                            console.log(responseText);
                            if(responseText.data===1){
                                this.$notify({
                                    title: '成功',
                                    message: '新线路添加成功',
                                    type: 'success'
                                });
                            }else{
                                this.$notify.error({
                                    title: '错误',
                                    message: '系统繁忙，请稍后再试'
                                });
                            }

                        }).catch(error=>{
                            console.log(error);
                        })
                    }).catch(error=>{
                        console.log(error);
                    });
                }else{
                    this.$notify.info({
                        title: '提示',
                        message: '至少为此线路选择一位司机'
                    });
                }

            }

        }
    }
</script>

<style scoped>

</style>