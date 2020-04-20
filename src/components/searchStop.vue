<template>
    <div>
        <template>

                <el-table
                        v-bind:data="tableData"
                        stripe
                        :default-sort = "{prop: 'station_id', order: 'ascending'}"
                        max-height="500"
                        style="width: 100%">
                    <el-table-column

                            prop="station_id"
                            label="站点标识"
                            sortable
                            width="160"
                            align="center">
                    </el-table-column>
                    <el-table-column

                            prop="stop_name"
                            label="站点名称"
                            width="160">
                    </el-table-column>
                    <el-table-column

                            label="站点二维码"
                            width="160">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="info"
                                    @click="get_qr_code(scope.row)" icon="el-icon-view">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column

                            prop="latitude"
                            label="所处纬度"
                            width="160">
                    </el-table-column>
                    <el-table-column

                            prop="longitude"
                            label="所处经度"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            align="right">
                        <template slot="header" slot-scope="scope">

                            <el-input
                                    v-model="searchInput"
                                    size="mini"
                                    placeholder="输入关键字搜索"
                                    prefix-icon="el-icon-search"
                                    clearable
                                    @input="queryStopByName"
                                    style="width: 65%;"
                            >

                            </el-input>
                            <el-button type="primary"  size="mini" icon="el-icon-circle-plus" @click="Add" >添加</el-button>


                        </template>
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="Edit(scope.row)" icon="el-icon-edit">编辑</el-button>
                            <el-popconfirm
                                    confirmButtonText='确认'
                                    cancelButtonText='不用了'
                                    icon="el-icon-info"
                                    @onConfirm="confirm(scope.row)"
                                    @onCancel="cancel(scope.row)"
                                    v-bind:title="title"
                            >
                                <el-button slot="reference" size="mini" type="danger" @click="getTitle(scope.row)" icon="el-icon-delete" round>删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>


            <!--<div align="center"><el-button type="primary"  style="margin-top: 10px" size="mini" icon="el-icon-circle-plus" @click="Add" >添加站点</el-button></div>-->

        </template>
        <template>
          <el-dialog title="" :visible.sync="dialogFormVisible">
                <span slot="title" class="dialog-title">
                    <el-tag type="success">编辑站点信息</el-tag>
                </span>
                <el-form :rules="rules" ref="form" :model="form"   style="align-items: center;">
                    <el-form-item label="站点名称" :label-width="formLabelWidth" prop="stop_name">
                        <el-input v-model="form.stop_name" autocomplete="off" style="width: 360px" clearable prefix-icon="el-icon-position"></el-input>
                    </el-form-item>
                    <el-form-item label="所处纬度" :label-width="formLabelWidth" prop="latitude">
                        <el-input v-model="form.latitude" autocomplete="off" style="width: 360px" clearable prefix-icon="el-icon-place"></el-input>
                    </el-form-item>
                    <el-form-item label="所处经度" :label-width="formLabelWidth" prop="longitude">
                        <el-input v-model="form.longitude" autocomplete="off" style="width: 360px" clearable prefix-icon="el-icon-place"></el-input>
                    </el-form-item>
                    <el-form-item label="所处街道" :label-width="formLabelWidth" prop="street">
                        <el-input v-model="form.street" autocomplete="off" style="width: 360px" clearable prefix-icon="el-icon-place"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="dialogFormVisible = false" icon="el-icon-close">取 消</el-button>
                    <el-button type="primary" @click="refreshStop" icon="el-icon-refresh" v-bind:loading="loading">更新</el-button>
                </div>
            </el-dialog>
        </template>
        <template>
            <el-dialog title="" :visible.sync="AddDialogFormVisible">
                <span slot="title" class="dialog-title">
                    <el-tag type="success">添加站点信息</el-tag>
                </span>
                <el-form :model="form" :rules="rules" ref="form" style="align-items: center;">
                    <el-form-item label="站点名称" :label-width="formLabelWidth" prop="stop_name">
                        <el-input v-model="form.stop_name" autocomplete="off" style="width: 360px" clearable prefix-icon="el-icon-position"></el-input>
                    </el-form-item>
                    <el-form-item label="所处纬度" :label-width="formLabelWidth" prop="latitude">
                        <el-input v-model="form.latitude" autocomplete="off" style="width: 360px" clearable prefix-icon="el-icon-place"></el-input>
                    </el-form-item>
                    <el-form-item label="所处经度" :label-width="formLabelWidth" prop="longitude">
                        <el-input v-model="form.longitude" autocomplete="off" style="width: 360px" clearable prefix-icon="el-icon-place"></el-input>
                    </el-form-item>
                    <el-form-item label="所处街道" :label-width="formLabelWidth" prop="street">
                        <el-input v-model="form.street" autocomplete="off" style="width: 360px" clearable prefix-icon="el-icon-place"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="AddDialogFormVisible = false" icon="el-icon-close">取 消</el-button>
                    <el-button type="primary" v-bind:loading="loading" @click="addStop" icon="el-icon-upload2">添加</el-button>
                </div>
            </el-dialog>
        </template>
        <template>
            <el-dialog
                    title=""
                    :visible.sync="QRDialogVisible"
                     width="30%"
                    align="center"
                    >
                <span slot="title" class="dialog-title" >
                    <el-tag type="info">{{Message}}</el-tag>
                </span>
                <img :src="src" alt="图片丢失" style="width: 250px" />
            </el-dialog>
        </template>
    </div>
</template>

<script>
    export default {
        name: "searchStop",
        data() {
            //坐标值暂时这样粗略检查
            var checkLatitude=((rule, value, callback,)=>{
                if(!(/[1-9][0-9][0-9]?.[0-9]{6}/g.test(value))){
                    callback(new Error('纬度格式非法'));
                }else{
                    return callback();//成功也必须返回callback，否则this.$refs.form.validate不执行
                }
            });
            var checkLongitude=((rule, value, callback,)=>{
                if(!(/[1-9][0-9][0-9]?.[0-9]{6}/g.test(value))){
                    callback(new Error('经度格式非法'));
                }else{
                    return callback();
                }
            });
            const generateTableData= _ =>{
                const dataIni=[];
                this.$axios.post("/queryAllStop","test").then(responseText=>{
                    console.log(responseText);
                    for(let i=0;i<responseText.data.length;i++){
                        dataIni.push(responseText.data[i]);
                    }

                }).catch(error=>{
                    console.log(error);
                });
                return dataIni;
            };
            return {
                loading:false,
                tableData: generateTableData(),
                searchInput:'',
                title :'',
                dialogFormVisible: false,
                AddDialogFormVisible:false,
                QRDialogVisible:false,
                formLabelWidth: '100px',
                src:'',
                Message:'二维码信息',
                form:{
                    station_id:0,
                    stop_name:'',
                    latitude:1,
                    longitude:1,
                    street:'',

                },
                rules:{
                    stop_name:[
                        {required: true, message: '请输入站点名称', trigger: 'change'}
                        ],
                    latitude:[
                        {required: true, message: '请输入纬度坐标', trigger: 'change'},
                        {validator: checkLatitude, trigger: 'blur'}

                    ],
                    longitude:[
                        {required: true, message: '请输入纬度坐标', trigger: 'change'},
                        {validator: checkLongitude, trigger: 'blur'}
                    ],
                    street:[
                        {required: true, message: '请输入街道名称', trigger: 'change'},
                    ]

                }
            }
        },
        mounted:function(){
            //防止通过url直接跳过登录，页面加载时执行，和导航守卫的功能重叠了
            if(!sessionStorage.getItem("token")){
                this.$router.push("/");
            }
        },
        methods:{
            confirm(row){
                console.log(row);
                this.deleteStopById(row.station_id);
            },
            cancel(row){
                console.log(row);
            },
            Edit(row){
                //打开编辑框
                this.dialogFormVisible=true;
                //传入待修改的信息
                this.form.stop_name=row.stop_name;
                this.form.station_id=row.station_id;
                this.form.latitude=row.latitude;
                this.form.longitude=row.longitude;
            },
            Add(){
                //打开添加站点编辑框
                console.log(this.tableData);
                this.AddDialogFormVisible=true;
                //先清空绑定的form表单数据
                this.form.stop_name='';
                this.form.latitude=undefined;
                this.form.longitude=undefined;
                this.form.station_id=0;

            },
            get_qr_code(row3){
                console.log(row3);
                this.QRDialogVisible=true;
                //this.headerImgUrl="http://localhost:8080/static/img/driver/driver_"+this.form.driver_id+".jpg?time="+new Date();
                this.src='http://localhost:8080/static/img/driver/stop_'+row3.station_id+'.jpg?time='+new Date();
                this.Message=row3.stop_name;
                //this.data.Message=row3.stop_name;
            },
            getTitle(row){
               // this.title="确定要删除标识为 "+row.station_id+" 的站点？";
                this.title="确定要删除站点“ "+row.stop_name+" ”";
            },

            queryStopByName(){
                if(this.searchInput !==''){
                    this.$axios.post("/queryStop",this.searchInput).then(responseText=>{
                        console.log(responseText);
                        this.tableData=responseText.data;
                    }).catch(error=>{
                        console.log(error);
                    })
                }else{
                    //默认展示全部站点
                    this.$axios.post("/queryAllStop","test").then(responseText=>{
                        console.log(responseText);
                        this.tableData=responseText.data;
                    }).catch(error=>{
                        console.log(error);
                    });
                }

            },
            refreshStop(){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        this.loading=true;
                        this.$axios.post("/UpdStop",this.form).then(responseText=>{
                            console.log(responseText);
                            if(responseText.status===200){
                                this.loading=false;
                                this.dialogFormVisible=false;
                                this.queryStopByName();
                                this.$message.success({
                                    showClose:true,
                                    message: '更新数据已同步',
                                });
                            }else{
                                this.loading=false;
                                this.dialogFormVisible=false;
                                this.$message.error({
                                    showClose:true,
                                    message: '数据同步失败',

                                });
                            }
                        }).catch(error=>{
                            console.log(error);
                        })
                    }else{
                        /*this.$notify.error({
                            title: '错误',
                            message: '填写信息不正确',
                            type: 'error'
                        });*/
                        return false;
                    }
                });

            },
            deleteStopById(ID){
                this.$axios.post("/DelStop",ID).then(responseText=>{
                    console.log(responseText);
                    if(responseText.status===200){
                        this.queryStopByName();
                        this.$message.success({
                            showClose:true,
                            message: '删除数据已同步',

                        });
                    }else{
                        this.dialogFormVisible=false;
                        this.$message.error({
                            showClose:true,
                            message: '数据同步失败',
                        });
                    }
                }).catch((error)=>{
                    console.log(error);//这句话必须写，以便于控制端调试代码
                })
            },
            addStop(){

                this.$refs.form.validate((valid)=>{
                    if(valid){
                        this.loading=true;
                        this.$axios.post("/AddStop",this.form).then(responseText=>{
                            console.log(responseText);
                            if(responseText.status===200){
                                this.loading=false;
                                this.AddDialogFormVisible=false;
                                this.searchInput=this.form.stop_name;
                                this.queryStopByName();
                                this.$message.success({
                                    showClose:true,
                                    message: '添加数据已同步',

                                });
                            }else{
                                this.loading=false;
                                this.dialogFormVisible=false;
                                this.$message.error({
                                    showClose:true,
                                    message: '数据同步失败',

                                });
                            }
                        }).catch(error=>{
                            console.log(error);
                        })
                    }else{
                        return false;
                    }
                })

            },
        }
    }
</script>

<style scoped>

</style>