<template>
  <el-row :gutter="20" class="detail-passage-container">
      <el-col class="blank" :xs="0" :sm="4"     :md="4" :lg="4" :xl="6">
          <div class="back">
              <div class="square animate__animated animate__lightSpeedOutRight "></div>
              <div class="square2 animate__animated animate__lightSpeedOutLeft "></div>
              <div class=" animate__animated   animate__rotateOut  " id="star-six"></div>
          </div>
      </el-col>
      <el-col class="main" :xs="24" :sm="16"    :md="16" :lg="16" :xl="12">
          
          <p class="title animate__animated animate__backInRight ">{{data.articleTitle}}</p>
          <div class="article-information" :class="{fixed:isFixed}">
              <div class="main-page" @click="router.push('/')">首页</div>
              <div class="article-type">&nbsp;&nbsp;{{data.typeName}}&nbsp;&nbsp;</div>
              <div class="article-id">{{data.articleId}}</div>
          </div>
          <v-md-editor class="content" v-model="data.articleContent" mode="preview" ref="content" />
          <div class="operation">
              <i @click="incLike">👍({{articleLikeCount?articleLikeCount:0}})</i>
            <i class="el-icon-view">({{data.articleViewCount?data.articleViewCount:0}})</i>
            <i class="el-icon-s-comment">({{data.articleCommentCount?data.articleCommentCount:0}})</i>
          </div>
          <hr>
          评论
          <div >
            <el-input type="textarea" rows="1" v-model="commentInput" placeholder="在这里输入您的评论"></el-input>
            <el-button type="success" size="small" @click="submitComment">提交</el-button>
          </div>
          <div v-for="item in commentList" :key="item.commentId" class="comment-container">
              <p class="comment-content">{{item.commentContent}}</p>
                <div class="comment-date">
                    {{new Date(item.commentDate).toLocaleString()}}
                    <i 
                    :style="{
                        cursor:'pointer'
                        }"
                    @click="updateCommentLike(item.commentId,item.commentLikeCount)"
                    >👍({{item.commentLikeCount?item.commentLikeCount:0}})</i>
                </div>
                
                <hr>
                
          </div>
      </el-col>
      <el-col class="right-nav" :xs="0" :sm="4" :md="4" :lg="4" :xl="6">
          <div class="navigation-achor">
              <div
                v-for="anchor in titles"
                :key="anchor.lineIndex"
                :style="{ padding: `5px 0 5px ${anchor.indent * 20}px` }"
                @click="handleAnchorClick(anchor,$event)"
            >
            <a class="anchor-title">{{ anchor.title}}</a>
            </div>
          </div>
          <img class=
          "
          backTop
          animate__animated
          
          " 
          v-show="isBackTop" src="../assets/rocket.jpg" @click="backToTop"/>
      </el-col>
  </el-row>
</template>

<script>
import {defineComponent, nextTick, onMounted,ref, watch} from 'vue'
import {useRoute,useRouter} from 'vue-router'
import axios from 'axios'
import {incLikeCount} from '../utils/useRequest'
import { ElMessageBox } from 'element-plus';
import baseURL from '../utils/baseURL'
export default defineComponent({
    name:"detailPassage",
    setup()
    {
        onMounted(()=>{
            axios.all([requestArticleDetail(),requestComment()])
            .then(axios.spread((articleRes,commentListRes)=>{
                data.value=articleRes.data.res[0];
                articleLikeCount.value=articleRes.data.res[0].articleLikeCount;
                content.value=articleRes.data.res[0].articleContent;
                commentList.value=commentListRes.data.res;
            }))
            .then(()=>{
                //注意要在请求完成之后才能去获取dom节点,因为dom节点的生成依赖于请求的数据
               const anchors = document.querySelectorAll('.v-md-editor-preview h1,h2,h3,h4,h5,h6');
            //    anchors.forEach(item=>{
            //        console.log(item.offsetTop);
            //    })
                titles.value = Array.from(anchors).filter((title) => !!title.innerText.trim());
                const hTags = Array.from(new Set(titles.value.map((title) => title.tagName))).sort();
                titles.value = titles.value.map((el) => ({
                    title: el.innerText,
                    lineIndex: el.getAttribute('data-v-md-line'),
                    indent: hTags.indexOf(el.tagName),
                }));
            })
            //监听滚动条滚动事件
            document.addEventListener('scroll',()=>{
                if(document.documentElement.scrollTop>=100)
                {
                    isFixed.value=true
                    if(document.documentElement.scrollTop>500)
                    {
                        isBackTop.value=true;
                    }
                }
                else
                {
                    isFixed.value=false
                    isBackTop.value=false;
                }

            })
        })
        
        const route=useRoute();
        const router=useRouter();
        const imgURL=require('../assets/back.png')
        const articleId=route.params.articleId;
        //getCommentListByArticleId
        const commentInput=ref('');
        const data=ref({});
        const commentList=ref([]);
        const content=ref('');
        const titles=ref([]);
        const articleLikeCount=ref(0)
        let isFixed=ref(false);
        let isBackTop=ref(false);
        const incLike=()=>{
            incLikeCount(data.value.articleId,articleLikeCount.value)
            .then(res=>{
                articleLikeCount.value=res;
            })
        }
        const handleAnchorClick=(anchor,event)=>{
            const navItem=document.querySelector('.v-md-editor-preview');
            var children=event.currentTarget.parentNode.children;
            for(let  item of children)
            {
                
                if(item!=event.currentTarget)
                {
                    item.style.color='white'
                    item.style.fontWeight='unset'
                }
                else
                {
                    event.currentTarget.style.color='rgb(88,165,254)'
                    event.currentTarget.style.fontWeight='bolder'
                }
            }
            
            const { lineIndex } = anchor;
            const heading = navItem.querySelector(
            `.v-md-editor-preview [data-v-md-line="${lineIndex}"]`);
            const top=heading.offsetTop
            let timer=setInterval(()=>{
                if(document.documentElement.scrollTop<top)
                {
                    document.documentElement.scrollTop += 60
                    if(document.documentElement.scrollTop>=top)
                        clearInterval(timer)
                }
                else
                {
                    document.documentElement.scrollTop -= 60
                    if(document.documentElement.scrollTop<=top)
                        clearInterval(timer)
                }
            },20)
        }
        const submitComment=()=>{
            const date=new Date();
            const commentData={
                articleId:data.value.articleId,
                commentDate:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                commentContent:`${commentInput.value}`
            }
            if(commentInput.value)
            {
                axios({
                url:`${baseURL}/updateArticleCommentAndCount`,
                method:"post",
                withCredentials:true,
                headers:{
                    'Access-Control-Allow-Origin':'*',
                },
                data:commentData
                })
                .then(res=>{
                    if(res.data.updateSuccess)
                    {
                        commentInput.value=""
                        axios.all([requestArticleDetail(),requestComment()])
                        .then(axios.spread((articleRes,commentListRes)=>{
                            data.value=articleRes.data.res[0];
                            commentList.value=commentListRes.data.res;
                        }))
                    }
                })
            }
            else
            {
                ElMessageBox({
                    center:true,
                    title:"评论内容不能为空!",
                })
            }
        }
        const updateCommentLike=(id,count)=>{
            //console.log(id,count);
            axios({
                url:`${baseURL}/updateCommentLikeCount`,
                method:"post",
                withCredentials:true,
                headers:{
                    'Access-Control-Allow-Origin':'*',
                },
                data:{
                    commentId:id,
                    commentLikeCount:count+1
                }
            })
            .then(res=>{
                if(res.data.updateSuccess)
                {
                    axios({
                    url:`${baseURL}/getCommentListByArticleId`,
                    method:'get',
                    params:{
                        articleId
                    }
                    }).then(res=>{
                        commentList.value=res.data.res;
                    })
                }
            })
        }
            
        
        const requestArticleDetail=()=>{
            return axios({
            url:`${baseURL}/getArticleById`,
            method:'get',
            params:{
                articleId
            }
            })
        }
        const requestComment=()=>{
            return axios({
                url:`${baseURL}/getCommentListByArticleId`,
                method:'get',
                params:{
                    articleId
                }
            })
        }
        const backToTop=()=>{
            
            let timer=setInterval(()=>{
                if(document.documentElement.scrollTop>=100)
                {
                    
                    document.querySelector(".backTop").classList.add("bounceOutUp")
                    document.documentElement.scrollTop -= 30
                }
                else
                {
                    document.documentElement.scrollTop=0;
                    document.querySelector(".backTop").classList.remove('bounceOutUp')
                    clearInterval(timer);
                }
                
            },20)
        }
        return {
            data,
        commentList,
        commentInput,
        submitComment,
        updateCommentLike,
        imgURL,
        router,
        titles,
        handleAnchorClick,
        articleLikeCount,
        incLike,
        isFixed,
        isBackTop,
        backToTop
        }
    }
})
</script>

<style lang='scss' scoped>
@import '../static/style/components/detailpassage.scss'
</style>