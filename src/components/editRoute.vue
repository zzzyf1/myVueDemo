<template>
    <div>
        <template>
            <div align="center" style="margin-top: 15px;margin-bottom: 10px;">
                <el-input placeholder="请输入线路全称" v-model="searchRouteInput" style="width: 300px" clearable>
                    <el-button slot="append" icon="el-icon-search" @click="queryRouteByName"></el-button>
                </el-input>
            </div>
        </template>
        <template v-if="seen">
            <el-collapse accordion>
                <el-collapse-item>
                    <template slot="title">
                        <span style="margin-left: 10px">线路简介</span> <i class="header-icon el-icon-info" style="margin-left: 10px"></i>
                    </template>
                    <div>
                        <el-tag style="margin-top: 15px;margin-left: 10px">线路名称</el-tag> <span style="margin-left: 5px">{{routeStops[0].description}}</span>
                        <!--<span>  起始站 {{routeStops[0].stop_name}} 终到 {{routeStops[routeStops.length-1].stop_name}}</span>-->
                    </div>
                    <div style="margin-top: 10px ;margin-left: 10px">
                        <el-tag type="info">起始站</el-tag><span style="margin-left: 5px">{{routeStops[0].stop_name}}</span><el-tag type="info" style="margin-left: 10px">终到</el-tag><span style="margin-left: 5px">{{routeStops[routeStops.length-1].stop_name}}</span>
                    </div>


                </el-collapse-item>
                <el-collapse-item>
                    <template slot="title">
                        <span style="margin-left: 10px">途径站点详情</span><i class="header-icon el-icon-s-promotion" style="margin-left: 10px"></i>
                    </template>
                    <div>
                        <el-container style="height: 400px; border: 1px solid #eee">
                            <template>
                                <el-main style="border:1px solid #eee">
                                    <div style="margin-left: 10px">
                                        <el-tag type="success">途径站数</el-tag><span style="margin-left: 10px">共 {{routeStops.length}} 站</span>
                                    </div>
                                    <el-timeline style="margin-top: 8px">
                                        <el-timeline-item
                                                v-for="(routeStop, index) in routeStops"
                                                :key="index"
                                                color="#0bbd87"
                                                :timestamp="'N:'+routeStop.latitude+' , E:'+routeStop.longitude"
                                        >
                                            {{routeStop.stop_name}}
                                        </el-timeline-item>
                                    </el-timeline>
                                </el-main>
                            </template>

                            <el-footer>
                                <div align="right" style="margin-top: 10px">
                                    <el-button-group>
                                        <!--<el-button type="primary" icon="el-icon-edit"></el-button>
                                        <el-button type="danger" icon="el-icon-delete" @click="deleteRoute" ></el-button>-->
                                        <template>
                                            <el-popconfirm
                                                    confirmButtonText='好的'
                                                    cancelButtonText='不用了'
                                                    icon="el-icon-info"
                                                    iconColor="red"
                                                    :title="title"
                                                    @onConfirm="deleteRoute()"
                                            >
                                                <el-button type="danger" icon="el-icon-delete" class="button" slot="reference" @click="getRouteTitle"></el-button>
                                            </el-popconfirm>
                                        </template>
                                    </el-button-group>
                                </div>
                            </el-footer>
                        </el-container>
                    </div>

                </el-collapse-item>
                <el-collapse-item >
                    <template slot="title">
                        <span style="margin-left: 10px">司机详情</span><i class="header-icon el-icon-s-custom" style="margin-left: 10px"></i>
                    </template>
                </el-collapse-item>
            </el-collapse>
        </template>
    </div>
</template>

<script>
    export default {
        name: "editRoute",
        data(){
            return{
                searchRouteInput:'',
                seen:false,
                routeStops:[],
                title:''
            }
        },
        mounted:function(){
            //防止通过url直接跳过登录，页面加载时执行，和导航守卫的功能重叠了
            if(!sessionStorage.getItem("token")){
                this.$router.push("/");
            }
        },
        methods:{
            queryRouteByName(){
                if(this.searchRouteInput!==''){
                    this.$axios.post("/selectRouteByName",this.searchRouteInput).then(responseText=>{
                        if(responseText.data.length>0){
                            console.log(responseText);
                            this.seen=true;
                            this.routeStops=responseText.data;
                        }else{
                            console.log(responseText);
                            this.seen=false;
                            this.$message.info({
                                showClose:true,
                                message: '未查询到关于 “'+this.searchRouteInput+' ”的信息'
                            });
                        }
                    }).catch(error=>{
                        console.log(error);
                    })
                }else{
                    console.log("搜索内容为空");
                }

            },
            deleteRoute(){
                this.$axios.post("/deleteRoute",this.routeStops[0].route_id).then(res=>{
                    if(res.status==200&&res.data=="1"){
                        this.$message.success({
                            showClose:true,
                            message:"已经成功删除线路 ："+this.routeStops[0].description
                        });
                        this.queryRouteByName();
                    }
                    if(res.data==2){
                        this.$message.info({
                            showClose:true,
                            message:"网络繁忙，请稍后再试"
                        })
                    }

                }).catch(error=>{
                    console.log(error);
                    this.$message.error({
                        showClose:true,
                        message:"系统维护中，请稍后再试"
                    })

                })


            },
            getRouteTitle(){
                this.title="确定要删除 ："+this.routeStops[0].description;
            }
        }

    }
</script>

<style scoped>

</style>