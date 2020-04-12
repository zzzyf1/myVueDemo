<template>
    <div>
        <el-menu
                :default-active="activeIndex2"
                class="el-menu-vertical-demo"
                mode="horizontal"
                @select="handleSelect"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">
            <el-submenu index="1">
                <template slot="title">线路规划</template>
                <el-menu-item index="1-1">线路管理</el-menu-item>
                <el-menu-item index="1-2">添加线路</el-menu-item>
            </el-submenu>
            <el-menu-item index="2">站点管理</el-menu-item>
            <el-menu-item index="3" disabled>站点二维码</el-menu-item>
            <el-menu-item index="4" ><el-link :underline="false" href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">坐标拾取器</el-link></el-menu-item>
        </el-menu>

        <div style="margin-top:10px">
            <transition name="component-fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>



</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                activeIndex2: '2'   //导航栏底部默认显示选中第二个的效果 来配合index.js中的重定向

            };
        },
        mounted:function(){
            if(!sessionStorage.getItem("token")){
                this.$router.push("/");
            }
        },
        methods: {
            //登陆跳转后默认加载/searchStop ,利用index.js中的路由重定向实现
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                switch (key){
                    case '1-1':
                        this.$router.push('/editRoute');
                        break;
                    case '1-2':
                        this.$router.push('/addRoute');
                        break;
                    case '2':
                        this.$router.push('/searchStop');
                        break;

                }
            }

        }
    }
</script>

<style scoped>
    .el-header{
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        width: 150px;
    }
    .el-menu-collapse {
        min-height: 200px;
    }
    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity .3s ease;
    }
    .component-fade-enter, .component-fade-leave-to
        /* .component-fade-leave-active for below version 2.1.8 */ {
        opacity: 0;
    }

</style>