<template>
  <el-input type="text" 
  v-model="articleTitleInput" 
  placeholder="请输入文章标题按下回车进行搜索"  
  :clearable=true
  @change="searchArticle" 
  @clear="recoverArticleList"/>
  <div class="passage animate__animated animate__backInRight" v-for="article in articleList" :key="article.id">
      
      <div class="article-title" @click="incViewCount(article.articleId,article.articleViewCount)">
          {{article.articleTitle}}
          </div>
      <div class="article-cotent">
        <p>📄&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{article.articleContent}}</p>
      </div>
      <el-row>
      <el-col :lg="18" :sm="12" :xs="12">
          <i class="article-date">⏲{{new Date(article.articleDate).toLocaleString()}}</i>
      </el-col>
      <el-col :class="[isDisabled?'disabled':'icons']" :lg="6" :sm="12" :xs="12">
        <i>
              👍({{article.articleLikeCount?article.articleLikeCount:0}})
        </i>
          <i class="el-icon-view">({{article.articleViewCount?article.articleViewCount:0}})</i>
          <i class="el-icon-s-comment">({{article.articleCommentCount?article.articleCommentCount:0}})</i>
      </el-col>
      </el-row>
  </div>
  <el-row>
      <el-col :xs="0" :sm="24" :lg='24' :xl="24">
          <div class="pagination">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[6, 8, 10, 20]"
            :page-size="6"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalArticleCount">
            </el-pagination>
        </div>
      </el-col>
  </el-row>
  <el-row>
      <el-col :xs="24" :sm="0" :lg="0" :xl="0">
        <el-button 
        class="load-more" 
        type="success" 
        size="small"
        :disabled="isDisabledLoadMore"
        @click="loadMoreArticleList"
        >load more
        </el-button>
        <div v-if="isDisabledLoadMore">没有更多了</div>
      </el-col>
  </el-row>
</template>

<script>
import {defineComponent,ref,onMounted, watch} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {getArticleListByPage,getArticleListByTypeIdAndPage,loadMoreList} from '../utils/useRequest'
import axios from 'axios'
import baseURL from '../utils/baseURL'
export default defineComponent({
    name:"Passage",
    setup(){
        onMounted(()=>{
          axios({
            url:`${baseURL}/getArticleList`,
            method:"get",
          })
          .then(res=>{
            totalArticleCount.value=res.data.length;
            curArticleList.value=res.data;
            if(!route.query.typeName)
            {
                getArticleListByPage(1,6)
                .then(res=>{
                articleList.value=res
                })
            }
            else
            {
                axios({
                    url:`${baseURL}/getArticleListByTypeId`,
                    method:"get",
                    params:{
                        typeId:route.query.typeId
                    }
                })
                .then(res=>{
                    curArticleList.value=res.data.data;
                    //拿到分类后每个类别文章的总数
                    totalArticleCount.value=res.data.data.length;
                    getArticleListByTypeIdAndPage(route.query.typeId,1,6)
                    .then(res=>{
                        articleList.value=res
                    })
                })
                    
            }
          })
          
        })
        let articleList=ref([]);
        let curArticleList=ref([])
        const tempArticleList=ref([])
        const router=useRouter();
        const route=useRoute();
        let articleTitleInput=ref('')
        //设置在搜索文章的时候不能进行点赞操作
        const isDisabled=ref(false)
        const totalArticleCount=ref(0);
        const pageSize=ref(6);
        const currentPage=ref(1);
        const loadMoreCount=ref(1);
        const isDisabledLoadMore=ref(false);
        const handleCurrentChange=(val) =>{
            currentPage.value=val;
            if(route.query.typeId)
            {
                getArticleListByTypeIdAndPage(route.query.typeId,currentPage.value,pageSize.value)
                .then(res=>{
                    articleList.value=res
                })
            }
            else
            {
                getArticleListByPage(currentPage.value,pageSize.value)
                .then(res=>{
                    articleList.value=res
                })
            }
        }
        const handleSizeChange=(val)=>{
            pageSize.value=val;
            if(route.query.typeId)
            {
                getArticleListByTypeIdAndPage(route.query.typeId,currentPage.value,pageSize.value)
                .then(res=>{
                    articleList.value=res
                })
            }
            else
            {
                getArticleListByPage(currentPage.value,pageSize.value)
                .then(res=>{
                    articleList.value=res
                })
            }
        }
        const searchArticle=()=>{
            if(articleTitleInput.value)
            {
                //把当前文章数据
                tempArticleList.value=articleList.value;
                isDisabled.value=true
                articleList.value=curArticleList.value.filter(data => 
                {
                    //!articleTitleInput.value || data.articleTitle.includes(articleTitleInput.value)
                    if(data.articleTitle)
                    {
                        return data.articleTitle.includes(articleTitleInput.value)
                    }
                })
            }
            else
            {
                isDisabled.value=false;
                articleList.value=tempArticleList.value;
            }
        }
        const recoverArticleList=()=>{
            articleList.value=tempArticleList.value;
        }
        watch(()=>route.query.typeId,()=>{
            //在路由跳转的时候恢复到可点击状态
            isDisabledLoadMore.value=false
            if(route.query.typeId)
            {
                axios({
                url:`${baseURL}/getArticleListByTypeId`,
                method:"get",
                params:{
                    typeId:route.query.typeId
                }
                })
                .then(res=>{
                curArticleList.value=res.data.data;
                totalArticleCount.value=res.data.data.length;
                getArticleListByTypeIdAndPage(route.query.typeId,currentPage.value,pageSize.value)
                    .then(res=>{
                        articleList.value=res
                    })
                })
            }
            else
            {
                
            axios({
                url:`${baseURL}/getArticleList`,
                method:"get"
                })
                .then(res=>{
                if(res&&res.data)
                {
                    curArticleList.value=res.data;
                    totalArticleCount.value=res.data.length
                    getArticleListByPage(currentPage.value,pageSize.value)
                    .then(res=>{
                        articleList.value=res
                    })
                }
                })
            
            }
        })
        const incViewCount=(id,count)=>{
            router.push({name:'detailPassage',params:{articleId:id}});
            axios({
                url:`${baseURL}/updateArticleViewCount`,
                method:"POST",
                withCredentials:true,
                headers:{
                    'Access-Control-Allow-Origin':'*',
                },
                data:{
                    articleId:id,
                    articleViewCount:count+1
                }
            })
            .then(res=>{
                axios({
                url:`${baseURL}/getArticleList`,
                method:"get"
                }).then(res=>{
                if(res&&res.data)
                {
                    articleList.value=res.data;
                }
                })
            })
        }
        const loadMoreArticleList=()=>{
            const len=articleList.value.length;
            if(len<6)
            {
                loadMoreCount.value=666666;
            }
            else
            {
                if(len%6!=0)
                {
                    loadMoreCount.value=666666;
                }
                else
                {
                    loadMoreCount.value=Math.floor(len/6)+1;
                }
            }
            loadMoreList(6,loadMoreCount.value,route.query.typeId)
            .then(res=>{
                articleList.value.push(...res);
                if(articleList.value.length==len)
                {
                    isDisabledLoadMore.value=true
                }
            })
        }
        return {
        articleList,
        curArticleList,
        router,
        totalArticleCount,
        pageSize,
        incViewCount,
        articleTitleInput,
        searchArticle,
        recoverArticleList,
        isDisabled,
        handleCurrentChange,
        handleSizeChange,
        loadMoreArticleList,
        loadMoreCount,
        isDisabledLoadMore
        }
    }
})

</script>

<style lang='scss' scoped>
@import '../static/style/components/passage.scss'
</style>