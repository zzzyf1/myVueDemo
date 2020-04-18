<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <el-input
                            v-model="searchInput"
                            size="mini"
                            placeholder="输入员工ID"
                            prefix-icon="el-icon-search"
                            clearable
                            class="search"
                    ><el-button slot="append" icon="el-icon-search" @click="queryDriverById"></el-button></el-input>

                   <el-button type="primary"   size="mini" icon="el-icon-plus" @click="addDriver" class="addButton"  >添加</el-button>

                    <el-pagination
                            @current-change="handleCurrentChange"
                            background
                            small
                            layout="prev, pager, next"
                            :current-page="currentPage"
                            :total="Math.ceil(data.length)||1"
                            :page-size="4"
                            class="pagination">
                    </el-pagination>



                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6" v-for="item in dataShow" v-bind:key="item.id" >
                <!--<div class="grid-content bg-purple">
                    <span v-html="item.id"></span>
                </div>-->
                <el-card shadow="hover">
                    <!--"http://localhost:8080/static/img/driver/driver_"+item.driver_id+".jpg?time="+new Date() class="image"-->
                    <!--"https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"-->
                    <!--"http://localhost:8080/static/img/driver/driver_422201.jpg"-->
                    <img v-bind:src="'http://localhost:8080/static/img/driver/driver_'+item.driver_id+'.jpg?time='+currentDate" class="showImg"/>
                    <div style="padding: 14px;">
                        <span>{{item.driver_name}}</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ item.driver_id }} {{item.city}}</time>
                            <el-button type="text" icon="el-icon-edit" class="button" @click="edit(item)"></el-button>
                            <template>
                                <el-popconfirm
                                        confirmButtonText='好的'
                                        cancelButtonText='不用了'
                                        icon="el-icon-info"
                                        iconColor="red"
                                        :title="title"
                                        @onCancel="cancel(item.driver_id)"
                                        @onConfirm="confirm(item.driver_id)"
                                >
                                    <el-button type="text" icon="el-icon-delete" class="button" slot="reference" @click="getTitle(item.driver_name)"></el-button>
                                </el-popconfirm>
                            </template>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <template>
            <el-drawer
            :visible.sync="form_dialog"
            :with-header="false"
            direction="rtl"
            custom-class="demo-drawer"
            ref="drawer">
            <div class="demo-drawer_content">
                <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImg">
                    <img v-if="headerImgUrl" :src="headerImgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div  class="el-upload__tip" slot="tip">只能上传<em style="color: #3a8ee6">jpg / png</em>文件，且不超过<em style="color: #3a8ee6">2MB</em></div>
                <el-form :rules="rules" ref="form" :model="form">
                    <el-form-item label="员工ID" :label-width="formLabelWidth" prop="driver_id">
                        <el-input v-model="form.driver_id" autocomplete="off" clearable maxlength="6" show-word-limit :disabled="idDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="司机姓名" :label-width="formLabelWidth" prop="driver_name">
                        <el-input v-model="form.driver_name" autocomplete="off" clearable  maxlength="3" show-word-limit ></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
                        <el-input v-model="form.phone" autocomplete="off" clearable maxlength="11" show-word-limit ></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
                        <el-select v-model="form.sex" placeholder="请选择性别">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所处城市" :label-width="formLabelWidth" prop="city">
                        <el-select v-model="form.city" placeholder="请选择城市">
                            <el-option label="长春" value="长春"></el-option>
                            <el-option label="北京" value="北京"></el-option>
                            <el-option label="上海" value="上海"></el-option>
                            <el-option label="广州" value="广州"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="demo-drawer__footer">
                    <el-button @click="cancelFormDialog()" style="width: 40%">取 消</el-button>
                    <el-button type="primary"  :loading="loading" style="width: 40%" @click="submit" :disabled="submitDisable">{{ loading ? '提交中' : '提交' }}</el-button>
                </div>
            </div>

            </el-drawer>
        </template>
    </div>
</template>

<script>
    export default {
        name: "driverManagement",
        //Vue的绑定数据
        data(){
            const getData=()=>{
                const data=[];
                /*for(let i=0;i<60;i++){
                    data.push({id:i,name:"A先生"});
                }*/
                this.$axios.post("/getDrivers","长春").then(responseText=>{
                    //查询到的所有公交司机司机信息
                    this.allDrivers=responseText.data;
                    console.log(this.allDrivers);
                    let size=Math.ceil(this.allDrivers.length/4)||1;
                    //数据按页数分组
                    for(let i=0;i<size;i++){
                        this.totalPage[i]=this.allDrivers.slice(i*4,(i+1)*4);
                    }

                    //默认展示第一页数据

                    this.dataShow=this.totalPage[this.currentPage-1];


                    //返回data数据
                    for(let i=0;i<this.allDrivers.length;i++){
                        data.push(
                            {
                                driver_id:this.allDrivers[i].driver_id,
                                driver_name:this.allDrivers[i].driver_name,
                                phone:this.allDrivers[i].phone,
                                city:this.allDrivers[i].city,
                                sex:this.allDrivers[i].sex,
                                url:this.allDrivers[i].url
                            }
                        )
                    }
                }).catch(error=>{
                    console.log(error);
                });
                return data;
            };
            var checkID=((rule,value,callback)=>{
                //ID 为5位数字
                if(!(/[0-9]{6}/.test(value))){
                    callback(new Error("ID格式不正确"));
                }else{
                    return callback();
                }

            });
            var checkPhone=((rule,value,callback)=>{
                //11位电话
                if(!(/[0-9]{11}/.test(value))){
                    callback(new Error("请输入有效的电话号码"));
                }else{
                    return callback();
                }

            });
            return{
                totalPage:[],    //存储每页的数据,每页展示4条记录
                dataShow:[],     //当前页展示的数据
                currentPage:1,    //默认当前是第1页
                searchInput:'',  //搜索输入框
                data:getData(),         //后台传入的数据
                submitDisable:false,
                allDrivers:[],
                title:'',
                form:{
                    driver_id:'',
                    driver_name:'',
                    phone:'',
                    city:'',
                    sex:'',
                    url:''
                },
                form_dialog:false,
                formLabelWidth: '80px',
                currentDate:new Date(),
                loading:false,
                rules:{
                    driver_id:[
                        {required:true,message:'请输入有效的ID',trigger:'change'},
                        {validator:checkID,trigger:'blur'}
                    ],
                    driver_name:[
                        {required:true,message:'请输入司机姓名',trigger:'change'}
                    ],
                    phone:[
                        {required:true,message:'请输入有效的电话号码',trigger:'change'},
                        {validator:checkPhone,trigger:'blur'}
                    ],
                    city:[
                        {required:true,message:'请选择一个城市',trigger:'change'},
                    ],
                    sex:[
                        {required:true,message:'请选择性别',trigger:'change'},
                    ]

                },
                headerImgUrl:'',
                idDisabled:false,
                option:1,//提交按钮的对应的操作是 添加还是更新

            }
        },
        //脚本方法
        methods:{
            queryDriverById(){
                var flag=false;
                for(let i=0;i<this.data.length;i++){
                    if(this.data[i].driver_id==this.searchInput){
                        this.form.driver_id=this.data[i].driver_id;
                        this.form.driver_name=this.data[i].driver_name;
                        this.form.phone=this.data[i].phone;
                        this.form.city=this.data[i].city;
                        this.form.sex=this.data[i].sex;
                        this.headerImgUrl="http://localhost:8080/static/img/driver/driver_"+this.form.driver_id+".jpg?time="+new Date();
                        this.form_dialog=true;
                        this.submitDisable=false;
                        this.idDisabled=true;
                        flag=true;
                        this.option=2;

                        break;
                    }
                }
                if(!flag){
                    this.$message.info({
                        showClose: true,
                        message:"该员工不存在"
                       });
                    this.form_dialog=false;
                }


            },
            addDriver(){
                this.form.sex="";
                this.form.driver_id="";
                this.form.driver_name="";
                this.form.phone="";
                this.form.city="";
                this.headerImgUrl="";
                this.idDisabled=false;
                this.form_dialog=true;
                this.option=1;
            },
            handleCurrentChange(val){
                //当前页改变时重新加载展示数据
                //不需要preClick(val)和nextClick(val)，重复了，只需一个handleCurrentChange(val)即可
                this.currentPage=val;
                this.dataShow=this.totalPage[this.currentPage-1];
                console.log(this.currentPage);
                console.log(this.dataShow);
            },
            cancel(id){
                console.log(id);
            },
            confirm(id){
                console.log(id);
                this.$axios.post("/deleteDriver",id).then(res=>{
                    if(res.status==200&&res.data=="1"){
                        this.refreshData();
                        this.$message.success({
                            showClose:true,
                            message:"删除成功"
                        });
                    }

                    if(res.data=="0"){
                        this.$message.info({
                            showClose:true,
                            message:"删除失败,请稍后重试"
                        });
                    }
                }).catch(error=>{
                    console.log(error);
                    this.$message.error({
                        showClose:true,
                        message:"网络繁忙，稍后重试"
                    });
                })
            },
            getTitle(name){
                this.title="确定要删除司机："+name;
            },
            edit(val){
                this.form.sex=val.sex;
                this.form.driver_id=val.driver_id;
                this.form.driver_name=val.driver_name;
                this.form.phone=val.phone;
                this.form.city=val.city;
                this.headerImgUrl="http://localhost:8080/static/img/driver/driver_"+this.form.driver_id+".jpg?time="+new Date();
                this.idDisabled=true;
                this.form_dialog=true;
                this.option=2;
            },
            cancelFormDialog(){
                this.form_dialog=false;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                let isID=true;

                if (!isJPG) {
                    this.$message.error({
                        showClose:true,
                        message:'上传头像图片只能是 JPG 格式!'
                    });
                }
                if (!isLt2M) {
                    this.$message.error({
                        showClose:true,
                        message:'上传头像图片大小不能超过 2MB!'
                    });
                }
                if(!(/[0-9]{6}/.test(this.form.driver_id))){
                    this.$message.error({
                        showClose:true,
                        message:'请正确填写司机ID'
                    });
                    isID=false;
                }

                return isJPG && isLt2M && isID;
            },
            uploadImg(val){
                const formData=new FormData();
                formData.append('file',val.file);
                formData.append('ID',this.form.driver_id);
                //formData.append('ID',"123");
                this.$axios.post("/upload",formData).then(responseText=>{
                    console.log(responseText.data);
                    if(responseText.data==1){
                        //加一个时间戳，否则当多次更改图片时，因为请求路径不变，是不会重复发起请求的
                        this.headerImgUrl="http://localhost:8080/static/img/driver/driver_"+this.form.driver_id+".jpg?time="+new Date();
                        this.$message.success({
                            showClose:true,
                            message:"图片上传成功,返回页面后手动刷新即可"
                        });
                    }else{
                        this.$message.error({
                            showClose:true,
                            message:"图片上传失败"
                        });
                    }

                }).catch(error=>{
                    console.log(error);
                    this.$message.error({
                        showClose:true,
                        message:"图片上传失败"
                    });
                })

            },
            //添加司机时提交表单
            submit(){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        this.loading=true;
                        //设置url
                        if(!this.headerImgUrl){
                            this.form.url="driver_"+this.form.driver_id;
                        }else{
                            this.form.url="";
                        }
                        //向后台提交信息
                        if(this.option==1){
                            this.$axios.post("/AddDriver",this.form).then(res=>{
                                console.log(res);
                                if(res.status===200&&res.data=="1"){
                                    this.loading=false;
                                    this.form_dialog=false;
                                    this.$message.success({
                                        message:"信息添加成功",
                                        showClose: true
                                    });
                                    this.refreshData();

                                }else{
                                    if(res.data=="3"){
                                        this.loading=false;
                                        this.$message.error({
                                            showClose: true,
                                            message:"该员工ID已经存在"
                                        });
                                    }else{
                                        this.loading=false;
                                        this.$message.error({
                                            showClose: true,
                                            message:"信息添加失败"
                                        });
                                    }

                                }
                            }).catch(error=>{
                                console.log(error);
                            })
                        }else if(this.option==2){
                            //编辑司机信息
                            this.$axios.post("/refreshDriver",this.form).then(res=>{
                                console.log(this.form);
                                if(res.status==200&&res.data=="1"){
                                    this.loading=false;
                                    this.$message.success({
                                        showClose: true,
                                        message:"信息更新成功"
                                    });
                                    this.form_dialog=false;
                                    this.refreshData();
                                }else{
                                    if(res.data==2){
                                        this.$message.error({
                                            showClose: true,
                                            message:"修改失败，请稍后尝试"
                                        });
                                        this.loading=false;
                                    }else{
                                        this.loading=false;
                                        this.$message.error({
                                            showClose: true,
                                            message:"信息更新失败"
                                        })
                                    }
                                }
                            }).catch(error=>{
                                console.log(error);
                            })

                        }

                    }else{
                        this.loading=false;
                    }
                })
            },
            refreshData(){
                this.$axios.post("/getDrivers","XXX").then(responseText=>{
                    //查询到的所有公交司机司机信息
                    this.allDrivers=responseText.data;
                    this.data=responseText.data;
                    console.log(this.allDrivers);
                    let size=Math.ceil(this.allDrivers.length/4)||1;
                    //数据按页数分组
                    for(let i=0;i<size;i++){
                        this.totalPage[i]=this.allDrivers.slice(i*4,(i+1)*4);
                    }
                    //添加信息后展示最后一页数据
                    if(this.option==1){
                        this.dataShow=this.totalPage[size-1];
                        this.currentPage=size;
                    }else if(this.option==2){
                        //更新司机信息
                        //当前页数不变即可
                        //提醒用户手动刷新即可
                        this.$message.info({
                            showClose: true,
                            message:"请手动刷新页面"
                        });
                    }else{
                       // this.dataShow=this.totalPage[0];
                    }
                }).catch(error=>{
                    console.log(error);
                });
            },


        }
    }
</script>

<style scoped>
    .demo-drawer_content{
        float: left;
    }
    .demo-drawer__footer{
        margin-top:50px;

        margin-left: 20%;

    }
    .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 45px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .search{
        width: 300px;
        margin-top: 8px;
        margin-left: 8px;
    }
    .addButton{

        margin-top: 8px;
        margin-right: 8px;

    }
    .pagination{
        float: right;
        margin-right: 5px;
        margin-top: 8px;
    }
    .time {
        font-size: 10px;
        color: #999;
    }

    .bottom {
        margin-top: 13px;
        line-height: 12px;
    }

    .button {
        padding: 0;
        float: right;
    }

    .image {
        width: 100%;
        display: block;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }

    .avatar-uploader {
        margin-left: 38%;
        margin-top: 10px;
        margin-bottom: 10px;
        width: 100px;
        height: 100px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader:hover {
        border-color: #409EFF;
    }
    .el-upload__tip{
        font-size: 8px;
        margin-left: 25%;
        margin-bottom: 18px;


    }
    .el-upload__tip2{
        font-size: 8px;
        margin-left: 40%;
        margin-bottom: 18px;
        cursor: pointer;

    }
    .avatar{
        width: 100px;
        height: 100px;
        display: block;
    }
    .showImg{
        width:100% ;
    }


</style>