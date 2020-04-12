<template >
    <div id="test">
    <el-form
            :rules="rules"
            ref="loginForm"
            :model="loginForm"
            class="loginContainer">       <!-- rules 表单校验规则 ；model 表单数据对象 ；-->
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">      <!--表单域model对应字段-->
        <el-input size="normal" type="text" v-model="loginForm.username" auto-complete="off"
                  placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input size="normal" type="password" v-model="loginForm.password" auto-complete="off"
                  placeholder="密码" @keydown.enter.native="submitLogin"></el-input>
      </el-form-item>
      <!--<el-checkbox  class="loginRemember" v-model="checked" size="mini">记住密码</el-checkbox>-->
        <el-button type="primary" v-bind:loading="loading"  @click="submitLogin" >登录</el-button>
    </el-form>
    <!--
    <div style="margin-top: 10px">
      <el-button type="primary" icon="el-icon-delete" @click="deleteStopById">删除站点</el-button>
      <el-button type="primary" icon="el-icon-search" @click="queryStopByName">搜索站点</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addStop">增加站点</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refreshStop">更新站点</el-button>
    </div>
      <div style="margin-top: 20px">
        <el-button type="primary" icon="el-icon-search" @click="queryRouteByName" style="background-color: #F56C6C ;border: 0px" >搜索路线</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addRoute" style="background-color: #F56C6C ;border: 0px" >添加路线</el-button>
        <el-button type="primary" icon="el-icon-search" @click="queryDriver" style="background-color: #F56C6C ;border: 0px" >搜索司机</el-button>

      </div>
-->
  </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                loading: false,
                loginForm: {
                    username: '',
                    password: ''
                },
                checked: false,
                rules: {
                    username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
                    password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
                }
            }
        },
        methods: {
            //登陆
            submitLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading=true;     //登陆按钮显示为等待状态
                        this.$axios.post('/user',this.loginForm).then(responseText=>{
                            this.loading=false;
                            console.log(responseText);
                            if(responseText.data.length===0){
                                this.$notify({
                                    message:'账户名或密码错误',
                                    type:'error',
                                    showClose:true,
                                    position:'top-right'
                                });
                            }else{
                                sessionStorage.setItem("token",this.loginForm.username);
                                this.$router.replace("/Home");
                                this.$notify({
                                    message:'登陆成功',
                                    type:'success',
                                    showClose:true,
                                    position:'top-right'
                                })
                            }
                            /**The response for a request contains the following information.
                             * {
                                 // `data` is the response that was provided by the server
                                     data: {},服务器传的json数据会自动转换为javascript对象，不需要自己转换

                                 // `status` is the HTTP status code from the server response
                                     status: 200,

                                 // `statusText` is the HTTP status message from the server response
                                      statusText: 'OK',

                                 // `headers` the headers that the server responded with
                                 // All header names are lower cased
                                     headers: {},

                                 // `config` is the config that was provided to `axios` for the request
                                     config: {},

                                 // `request` is the request that generated this response
                                 // It is the last ClientRequest instance in node.js (in redirects)
                                 // and an XMLHttpRequest instance the browser
                                     request: {}
                                 }*/
                        }).catch((error)=>{
                            console.log(error);//这句话必须写，以便于控制端调试代码
                            this.loading=false;
                        });
                    } else {       //登陆错误提示
                        this.$notify({
                            message:'请输入账户名和密码',
                            type:'error',
                            showClose:true,
                            position:'top-right'
                        });
                        return false;
                    }
                });
            },
            //站点
            deleteStopById(){
                this.$axios.post("/DelStop",6).then(responseText=>{
                    console.log(responseText);
                }).catch((error)=>{
                    console.log(error);//这句话必须写，以便于控制端调试代码
                })
            },
            queryStopByName(){
              this.$axios.post("/queryStop","高新").then(responseType=>{
                  console.log(responseType);
              }).catch(error=>{
                  console.log(error);
              })
            },
            addStop(){
                this.$axios.post("/AddStop",{
                    stop_name:"高新三站",
                    latitude:123.456654,
                    longitude:123.344231
                }).then(responseText=>{
                    console.log(responseText);
                }).catch(error=>{
                    console.log(error);
                })
            },
            refreshStop(){
                this.$axios.post("/UpdStop",{
                    station_id:'7',
                    stop_name:"电台二站",
                    latitude:23.4567888,
                    longitude:123.344388
                }).then(responseText=>{
                    console.log(responseText);
                }).catch(error=>{
                    console.log(error);
                })
            },
            //线路
            queryRouteByName(){
                this.$axios.post("/selectRouteByName","一号").then(responseText=>{
                    console.log(responseText);
                }).catch(error=>{
                    console.log(error);
                })
            },
            addRoute(){
                this.$axios.post("/addRoute",[
                    {station_id:7,route_id:0,position:1,description:"五号线"},
                    {station_id:9,route_id:0,position:2,description:"五号线"},
                    {station_id:10,route_id:0,position:3,description:"五号线"},
                    {station_id:11,route_id:0,position:4,description:"五号线"}
                ]).then(responseText=>{
                    console.log(responseText);
                }).catch(error=>{
                    console.log(error);
                })
            },

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loginContainer {
    border-radius: 5px;
    background-clip: padding-box;
    margin-top: 100px;
    width: 300px;
    padding: 15px 35px 15px 35px;
    background: #1c263a;
    border: 1px solid #eaeaea;
      margin-left: auto;
      margin-right: auto;
  }

  .loginTitle {
    margin: 15px auto 20px auto;
    text-align: center;
    color: #505458;
  }
  #test{
      background: url("../assets/bac.jpg");
      background-size: 100% 100%;
      height: 100%;
      width: 100%;
      position: fixed;
      margin-right: 100px;

  }


  .loginRemember {
    text-align: left;
    color: #505458;
    margin: 0px 0px 15px 0px;
  }
</style>
