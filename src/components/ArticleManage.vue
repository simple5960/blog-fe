
<template>
<div class="article-manage-main">
  <p class="psg-manage-text">文章管理</p>
  <el-table
    :data="articleList.filter(data => !search || data.articleTitle.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      label="文章id"
      prop="articleId">
    </el-table-column>
    <el-table-column
      label="文章类型"
      prop="typeName">
    </el-table-column>
     <el-table-column
      label="文章标题"
      prop="articleTitle">
    </el-table-column>
    <el-table-column
      align="right">
      <template #header>
        <el-input
          v-model="search"
          size="mini"
          icon="el-icon-search"
          placeholder="输入文章标题搜索"/>
      </template>
      <template #default="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.row)">Edit</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import {defineComponent,onMounted,ref} from 'vue'
import axios from 'axios'
import {useRouter} from 'vue-router'
import { ElMessageBox } from 'element-plus';
const baseURL='http://127.0.0.1:7001'
export default defineComponent({
  name:"ArticleManage",
  setup() {
    onMounted(()=>{
      requestArticleList();
    })
    let articleList=ref([]);
    let search=ref("")
    const router=useRouter()
    const requestArticleList=()=>{
      axios({
        url:`${baseURL}/getArticleList`,
        method:"get"
      })
      .then(res=>{
        if(res&&res.data)
        {
          articleList.value=res.data
        }
        // if(articleList.value.length)
        // {
        //   //更新数据的操作
        //   articleList.value.splice(0,articleList.value.length);
        //   articleList.value.push(...res.data)
        // }
        // else
        // {
        //   //第一次请求数据的操作
        //   articleList.value.push(...res.data)
        // }
      })
    }
    const handleDelete=(row)=>{
      const articleId=row.articleId;
      //进行文章的删除
      ElMessageBox.confirm('确定要删除这篇文章?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(()=>{
        axios({
          url:`${baseURL}/deleteArticle`,
          method:"post",
          withCredentials:true,
          headers:{
            'Access-Control-Allow-Origin':'*',
          },
          data:{
            articleId:articleId
          }
        })
        .then(res=>{
          if(res.data.data=='没有登录')
          {
            ElMessageBox({
                type:"warning",
                center: true,
                title:"请登录后再操作!"
              })
            .then(()=>{
              router.push('login')
            })
          }
          else
          {
            if(res.data.deleteSuccess)
            {
              //删除数据之后重新请求数据
              requestArticleList();
              ElMessageBox({
                type:"success",
                center: true,
                title:"文章删除成功"
              })
            }
            else
            {
              ElMessageBox({
                type:"warning",
                center: true,
                title:"文章未删除,请重试"
              })
            }
          }
        })
      })
      .catch(()=>{
        ElMessageBox({
          type:"info",
          center: true,
          title:"您已经取消删除此文章"
        })
      })
    }
    const handleEdit=(row)=>{
      const articleId=row.articleId;
      router.push({name:'editArticle',params:{articleId:articleId}})
    }
    return {
      articleList,
      search,
      handleDelete,
      handleEdit
    }
  },
  
})
</script>

<style lang='scss' scoped>
@import '../static/style/components/articlemanage.scss'
</style>
