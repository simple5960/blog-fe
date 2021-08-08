<template>
  <div class="article-type-main">
    <p class="type-manage-text">
      文章类型管理
      <el-button type="success " size="small" class="add-type" @click="isShowAddTypeInput=!isShowAddTypeInput">
        增加类型
      </el-button>
    </p>
    <el-row :gutter="10" v-show="isShowAddTypeInput">
      <el-col :span="18">
          <el-input type="text" v-model="addTypeName" placeholder="请输入您想要添加的类型" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="addTypeToDatabase">确认添加</el-button>
      </el-col>
    </el-row>
    <hr>
    <el-table
    :data="tableData.filter(data => !search || data.typeName.toLowerCase().includes(search.toLowerCase()))"
    style="width: 100%">
    <el-table-column
      label="类型id"
      prop="typeId">
    </el-table-column>
    <el-table-column
      label="类型名"
      prop="typeName">
    </el-table-column>
    <el-table-column
      label="文章数"
      prop="typeArticleCount">
    </el-table-column>
  <el-table-column
      align="center">
      <template #header>
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
      <template #default="scope">
        <el-button @click="handleDelete(scope.row)">删除</el-button>
    </template>
  </el-table-column>
  </el-table>
  </div>
</template>

<script>
import { defineComponent,onMounted,onUpdated,ref} from 'vue'
import axios from 'axios'
import { ElMessageBox } from 'element-plus';
import router from '@/router';
const baseURL='http://127.0.0.1:7001'
export default defineComponent({
  name:"ArticleType",
  setup()
  {
    const addTypeToDatabase=()=>{
      const typeName=addTypeName.value;
      axios({
        url:`${baseURL}/addType`,
        method:"POST",
        withCredentials:true,
        headers:{
          'Access-Control-Allow-Origin':'*',
        },
        data:{
          typeName:typeName
        }
      })
      .then(res=>{
        if(res.data.data=='没有登录')
        {
           ElMessageBox({
                  center: true,
                  title:"请登录后再操作!"
            })
            .then(()=>{
              router.push('/login')
            })
        }
        else
        {
          if(res.data.deleteSuccess)
          {
            requestTypeList();
            ElMessageBox({
                  center: true,
                  title:"添加成功"
            })
            isShowAddTypeInput.value=false
            addTypeName.value=""
          }
        }
      })
    }
    const handleDelete=(row)=>{   
      ElMessageBox.confirm("这个操作会将此类型下所有文章级联删除,建议慎重考虑!!!","title",{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          callback:(action, instance)=>{
            if(action=='confirm')
            {
              axios({
                  url:`${baseURL}/deleteType`,
                  method:"post",
                  withCredentials:true,
                  headers:{
                    'Access-Control-Allow-Origin':'*',
                  },
                  data:{
                    typeName:row.typeName
                  }
                })
                .then(res=>{
                 if(res.data.data=='没有登录')
                 {
                   ElMessageBox({
                            center: true,
                            title:"删除成功"
                      })
                    .then(()=>{
                      router.push('/login')
                    })
                 }
                 else
                 {
                    if(res.data.deleteSuccess)
                    {
                      requestTypeList();
                      ElMessageBox({
                            center: true,
                            title:"删除成功"
                      })
                    }
                 }
                  
                })
            }
            else if(action=='cancel')
            {
              ElMessageBox({
                center: true,
                title:"万幸,您保留了它"
              })
            }
          }
        })
             
      
    }
    onMounted(()=>{
      
      requestTypeList();
    })
    const requestTypeList=()=>{
      axios({
          url:`${baseURL}/getTypeList`,
          method:'get'
      })
      .then(result=>{  
        if(result&&result.data)
            tableData.value=result.data
      })  
    }
    const tableData=ref([])
    let addTypeName=ref("")
    let isShowAddTypeInput=ref(false)
    let search=ref('')
    return {
        tableData,
        search,
        isShowAddTypeInput,
        addTypeName,
        addTypeToDatabase,
        handleDelete
      }
  }
  
})
</script>

<style lang='scss' scoped>
@import '../static/style/components/articletype.scss'
</style>