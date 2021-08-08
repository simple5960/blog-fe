<template>
  <div class="add-article-main">
    <p>请编辑您的文章</p>
    <p v-show="params" class="editPsg">注意这是修改界面</p>
    <el-row :gutter="10">
      <el-col :span="16">
        <el-input
        placeholder="请输入文章标题"
        v-model="titleInput"
        icon="el-icon-search"
        ></el-input>
      </el-col >
      <el-col :span="4">
        <el-select v-model="selecetedType" @change="selectedItemChange($event)">
          <el-option
            v-for="item in typeList"
            :key="item.typeId"
            :value="item.typeId"
            ref="optionElement"
            >
            {{item.typeName}}
          </el-option>
        </el-select>
      </el-col>
      
      <el-col :span="4">
        <el-button type="primary" @click="insertArticleToDatabase" >{{params?'修改':'发布'}}</el-button>
      </el-col>
    </el-row>
    <br>
    <el-row :gutter="20">
      <v-md-editor 
      v-model="contentInput" 
      height="600px"
      ></v-md-editor>
      <!-- <el-col :span="14">
        <el-input
          type="textarea"
          :rows="26"
          placeholder="请输入文章内容"
          v-model="contentInput">
        </el-input>
      </el-col>
      <el-col :span="10" class="markdown-preview">
          

        <p>{{contentInput?contentInput:'Markdown渲染预览'}}</p>
      </el-col> -->
    </el-row>
  </div>
</template>

<script> 
/**
 * ElMessageBox, ElMessageBox.alert, ElMessageBox.confirm 和
 *  ElMessageBox.prompt，调用参数与全局方法相同。
 */
import{defineComponent,onMounted,ref} from 'vue'
import axios from 'axios'
import { useRoute,useRouter} from 'vue-router'
import { ElMessageBox } from 'element-plus';
const baseURL='http://127.0.0.1:7001'
export default defineComponent({
  name:"AddArticle",
  setup()
  {
    const route=useRoute();
    const router=useRouter();
    const articleId=route.params.articleId;
    //根据有没有params来修改一些文字
    const params=articleId?true:false;
    onMounted(()=>{
      
        //添加文章的处理逻辑
        axios({
        url:`${baseURL}/getTypeList`,
        method:"get"
        })
        .then(res=>{
          typeList.value.push(...res.data)
          if(params)
          {
            axios({
            url:`${baseURL}/getEditArticleDetail/${articleId}`,
            method:"get"
            })
            .then(res=>{
              const {articleTitle,articleContent,articleTypeId}=res.data.res[0];
              titleInput.value=articleTitle;
              contentInput.value=articleContent; 
              articleTypeIdREef.value=articleTypeId
              typeList.value.filter(item=>{
                if(item.typeId==articleTypeId)
                {
                    selecetedType.value=item.typeName
                }
            })         
            })
          }
        })
    }
    )
    const typeList=ref([])
    let  selecetedType=ref('')
    const titleInput=ref("")
    const contentInput=ref('')
    const articleTypeIdREef=ref(0)
    const optionElement=ref(null)
    const insertArticleToDatabase=()=>{
      const date=new Date();
      const data={
        articleId:articleId,
        articleTitle:titleInput.value,
        articleTypeId:articleTypeIdREef.value,
        articleContent:contentInput.value,
        articleDate:
        `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      }
      if(!params)
      {
          axios({
            url:`${baseURL}/addArticle`,
            method:"POST",
            withCredentials:true,
            headers:{
              'Access-Control-Allow-Origin':'*'
            },
            data:data
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
            if(res.data.insertSuccess)
            {
              ElMessageBox({
                    center: true,
                    title:"添加文章成功",
                    callback:()=>{
                      titleInput.value='';
                      contentInput.value=""
                      selecetedType.value=""
                    }
              })
              
            }
            else
            {
              ElMessageBox({
                    center: true,
                    title:"添加文章失败"
              })
            }
          }
        })
      }
      else if(params)
      {
        axios({
          url:`${baseURL}/changeArticle/${articleId}`,
          method:"post",
          withCredentials:true,
          headers:{
            'Access-Control-Allow-Origin':'*',
          },
          data:{
            data
          }
        })
        .then(res=>{
          if(res.data.data=='没有登录')
          {
            ElMessageBox({
                    center: true,
                    title:"请登录后再操作"
              })
            .then(()=>{
              router.push("/login")
            })
          }
          else
          {
            if(res.data.updateSuccess)
            {
              ElMessageBox({
                    center: true,
                    title:"修改文章成功",
                    callback:()=>{
                      router.push('/')
                    }
              })
              titleInput.value='';
              contentInput.value=""
              selecetedType.value=""
            }
            else
            {
              ElMessageBox({
                    center: true,
                    title:"修改文章失败"
              })
            }
          }
        })
      }
    }
    const selectedItemChange=(typeId)=>{
      //选项改变的时候传过来一个typeId
      articleTypeIdREef.value=typeId
      typeList.value.filter(item=>{
        if(item.typeId==typeId)
        {
            selecetedType.value=item.typeName
        }
    })
    }
    return {
      titleInput,
      typeList,
      selecetedType,
      contentInput,
      insertArticleToDatabase,
      selectedItemChange,
      optionElement,
      params,
      articleTypeIdREef,
      router
      }
  }
})
</script>

<style lang='scss' scoped>
@import '../static/style/components/addarticle.scss'
</style>