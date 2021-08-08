<template>
<div class="common-layout">
<el-container>
    <el-header class="header">
        <el-row class="row-wrapper">
            <el-col :xs="0" :sm="24"  :lg="24" :xl="24">
                <div class="grid-content main-nav">
                    <img 
                    src="../assets/avatar.jpg" 
                    alt="avatar" 
                    class="nav-img"
                    @click="turnToHome"
                    >
                    <el-button 
                    class="button" 
                    @click="router.push('/login')"
                    type="success"
                    >后台数据编辑</el-button>
                    <el-button 
                    class="button" 
                    @click="router.push('/picture')"
                    type="primary"
                    >我的图库</el-button>
                    <div class="
                    herizontal 
                    animate__animated 
                    animate__backInDown"></div>
                </div>
            </el-col>

            <el-col :xs="24" :sm="0"  :lg="0" :xl="0">
              <div class="type-nav-wrapper">
                <div 
                class="type-nav"
                @click="router.push('/')"
                >首页</div>
                <div 
                v-for="item in typeList" 
                :key="item.typeId"
                class="type-nav"
                @click="changeClassfiedData(item.typeId,item.typeName)"
                >
                <div class="type-name">{{item.typeName}}</div>
                 <div class="passage-count">{{item.typeArticleCount}}</div>
                </div>
              </div>
              <div class="herizontal  animate__animated 
                    animate__backInDown"></div>
            </el-col>
      </el-row>
    </el-header>
    <el-main class="main-content">
      <el-row  :gutter="10">
        <el-col :xs="0" :sm="4" :lg="4" :xl="8"  >
            <Classify :typeList="typeList" ></Classify>
        </el-col>
        <el-col :xs="24" :sm="20" :lg="20" :xl="16"  >
              <Passage></Passage>
        </el-col>
      </el-row>
    </el-main>
    <el-footer style="height:32px;">Powerd By <a href="https://cn.vuejs.org/" target="blank">Vue.js</a>
    +<a href="https://eggjs.org/zh-cn/" target="blank">Egg.js</a>
    +<a href="https://element-plus.gitee.io/#/zh-CN" target="blank">Element-Plus</a> 
    </el-footer>
</el-container>
</div>

</template>

<script>
import {defineComponent, onMounted,ref} from 'vue'
import {useRouter} from 'vue-router'
import Classify from '../components/Classify.vue'
import Passage from '../components/Passage.vue'
import axios from 'axios'
const baseURL='http://127.0.0.1:7001';
export default defineComponent({
  name:"Home",
  components:{
    Classify,
    Passage
  },
  setup()
  {
    onMounted(()=>{
        //axios合并异步请求
        axios({
          url:`${baseURL}/getTypeList`,
          method:"get"
        })
        .then(res=>{
          typeList.value.push(...res.data);
        })
      })
    const changeClassfiedData=(id,name)=>{
        selectedType.value=name;
        isShowOptions.value=false;
        router.push({name:'Home',query:{typeName:name,typeId:id}});          
    }
    const showOptions=(e)=>{
      e.stopPropagation();
      isShowOptions.value=!isShowOptions.value
    }
    document.addEventListener("click",function(){
        isShowOptions.value=false;
    });
    const turnToHome=()=>{
      router.push('/');
      selectedType.value=""
    }
    let typeList=ref([]);
    const selectedType=ref('')
    const optionElement=ref(null)
    let isShowOptions=ref(false)
    const router=useRouter()
    return{
      router,
    typeList,
    optionElement,
    selectedType,
    isShowOptions,
    changeClassfiedData,
    showOptions,
    turnToHome
    }
  }
})
</script>

<style lang='scss' scoped>
  @import '../static/style/views/home.scss'
</style>