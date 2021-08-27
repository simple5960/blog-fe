<template>
  <div class="login-wrapper">
    <el-form>
    <el-form-item>
        <div class="input-wrapper">
    <div class="login-text">用户名</div>
    <el-row>
        <el-col :xs="24" :sm="24" :lg='24' :xl="24">
            <el-input v-model="userName" placeholder="请输入您的用户名" autofocus></el-input>
        </el-col>
    </el-row>
    </div>
    </el-form-item>
   <el-form-item>
       <div class="input-wrapper">
    <div class="login-text">密码</div>
    <el-row>
        <el-col :xs="24" :sm="24" :lg='24' :xl="24">
            <el-input v-model="userPassword" placeholder="请输入您的密码" type="password" ></el-input>
        </el-col>
    </el-row>
   </div>
   </el-form-item>
   <el-form-item>
          <el-button type="primary" @click="submitLogin">登录</el-button>
   </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {defineComponent,onMounted,ref} from 'vue'
import axios from 'axios'
import { useRouter} from 'vue-router'
import baseURL from '../utils/baseURL'
import { ElMessageBox } from 'element-plus';
export default defineComponent({
    name:"login",
    setup(){
        onMounted(()=>{
            if(document.cookie)
            {
                router.push('/edit/addArticle')
            }
        })
        let userName=ref('');
        let userPassword=ref('');
        const router=useRouter();
        const submitLogin=()=>{
            axios({
                url:`${baseURL}/login`,
                method:"post",
                withCredentials:true,
                data:{
                    userName:userName.value,
                    userPassword:userPassword.value
                },
            })
            .then(res=>{
                if(res.data.res)
                {
                    ElMessageBox({
                        type:"success",
                        message:'密码正确,正在跳往后台'
                    }).then(result=>{
                        
                        userName.value="";
                        userPassword.value="";
                        router.push('/edit/addArticle')
                    })
                }
                else
                {
                    
                    ElMessageBox({
                        type:'error',
                        message:'密码错误,请重新输入'
                    })
                    .then(res=>{
                        userName.value="";
                        userPassword.value="";
                    })
                }
            })
            
        }
        return {
            userName,
            userPassword,
            submitLogin
        }
    }
})
</script>
<style lang="scss" scoped>
@import '../static/style/views/login.scss'
</style>