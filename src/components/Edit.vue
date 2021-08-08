<template>
<div class="edit-header">
    <div class="back-to-index" @click="turnToHome">
        &lt;&lt;&lt;&lt;&lt;
        返回首页
        &lt;&lt;&lt;&lt;&lt;
    </div>
    后台管理界面
</div>
<div class="left-nav">
    <el-row>
    <el-col :span="24">
    <el-menu
      :uniqueOpened="true"
      default-active="/edit/addArticle"
      class="el-menu-vertical-demo"
      @select="navSelectChange"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#90d7ec">
      <el-menu-item index="/edit/addArticle" @click="router.push('/edit/addArticle')">
        <template #title>
          <i class="el-icon-document"></i>
          <span>新增文章</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/edit/articleManage" @click="router.push('/edit/articleManage')">
        <i class="el-icon-menu"></i>
        <template #title>文章管理</template>
      </el-menu-item>
      <el-menu-item index="/edit/articleType" @click="router.push('/edit/articleType')">
        <i class="el-icon-location"></i>
        <template #title>文章类型管理</template>
      </el-menu-item>
      <el-menu-item index="/edit/userManage" @click="router.push('/edit/userManage')">
        <i class="el-icon-user"></i>
        <template #title>用户管理</template>
      </el-menu-item>
      
    </el-menu>
    </el-col>
        </el-row>
</div>
    <div class="edit-area">
        <router-view></router-view>
</div>
</template>

<script>
import {useRouter} from 'vue-router'
import {ref,defineComponent} from 'vue'
export default defineComponent({
setup(props,{attrs})
{
    const router=useRouter();
    const navSelectChange=(a,b)=>
    {
      console.log(a,b);
    }
    const turnToHome=()=>{
      router.push('/');
      document.cookie=""
    }
    return  {
        router,
        navSelectChange,
        turnToHome
    };
}

})
</script>

<style lang='scss'>
@import '../static/style/components/edit.scss'
</style>
