<template>
  <div class="upload-wrapper">
      <p>点击此处或将图片拖拽至此处上传</p>
      <img class="upload-icon" src="../assets/uploadicon.png" alt="">
      <input id="upload-file" 
       type="file" 
       @change="uploadFile"/>
  </div>
  <div class="big-preview" v-show="isShowBigPic">
       <el-image 
        :src="bigPreviewSrc">
       </el-image>
       <img 
       class="close-preview"
       src='../assets/close.png'
       @click="hideShade"
       />
  </div>
  <div class="container">
      
    <div class="img-wrapper" v-for="item in imageList" 
        :key="item" >
        <div class="imgs animate__animated animate__bounceInLeft">
            <img 
            :src='item.imageURL' 
            alt="图片未加载,请刷新网页"
            @click="showShade(item.imageURL,$event)"
            />
            <div class="shade">
                <div class="icon-wrapper">
                    <img 
                    class="preview" 
                    src="../assets/preview.png" 
                    alt="预览图片"
                    @click="previewPic(item.imageURL,$event)"
                    >
                    <img 
                    class="delete" 
                    src="../assets/delete.png" 
                    alt="删除图片"
                    @click="deletePic(item.imageFileName)"
                    >
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, onMounted,ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'
import baseURL from '../utils/baseURL'
export default defineComponent({
    name:"picture",
    setup(){
        
        const imageList=ref([])
        onMounted(()=>{
            axios({
                method:'get',
                url:`${baseURL}/getImageList`
            })
            .then(res=>{
                imageList.value=res.data.data.sort((a,b)=>{
                    return b.Id-a.Id
                })
                console.log(res.data.data);
                const len=imageList.value.length;
                const row=Math.ceil(len/3);
                document.querySelector('.container').style.gridTemplateRows=`repeat(${row}, 300px)`
            })
            
        })
        let isShowBigPic=ref(false);
        let bigPreviewSrc=ref('');
        let imageURL=ref('xxx')
        const hideShade=()=>{
            isShowBigPic.value=false;
        }
        const previewPic=(item,event)=>
        {
            isShowBigPic.value=true;
            bigPreviewSrc.value=item;
            const top=document.documentElement.scrollTop
            document.querySelector('.big-preview').style.top=`${top+20}px`
        }
        const deletePic=(fileName)=>{
            ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?','提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then((action)=>{
            //这个action是confirm
            //这是按确定的处理逻辑
            axios({
                method:'POST',
                url:`${baseURL}/deleteImage`,
                data:{
                    imageFileName:fileName
                }
            })
            .then(res=>{
                if(res.data.data==1)
                {
                    //重新请求数据
                    axios({
                        method:'get',
                        url:`${baseURL}/getImageList`
                    })
                    .then(result=>{
                        imageList.value=result.data.data.sort((a,b)=>{
                            return b.Id-a.Id
                        })
                        ElMessage.success({
                            message: '删除成功'
                        })
                    })
                }
            })
            })
            .catch(()=>{
                ElMessage.info({
                message: '取消删除'
            })
            })
           
        }
        const uploadFile=()=>{
            var imageFileName="";
            var imgURL=document.querySelector('#upload-file').files[0];
            console.log(imgURL.type);
            imageFileName=`${new Date().getTime()}-${imgURL.name}`
            
            //图片预览部分
            //var img=document.querySelector('#preview-img')
            //这个URL是blob的,仅做展示用
            //img.src= window.URL.createObjectURL(imgURL)

            //转为base64,存储在数据库中
            var reader = new FileReader();
            reader.readAsDataURL(imgURL);//发起异步请求
            reader.onload =function(res){
                //读取完成后，数据保存在对象的result属性中
                // console.log(this.result)
                // console.log(res);
                imageURL.value= this.result
                //这里一定要用promise,不然有可能转码未结束就发数据了
                //后端就拿不到数据
                return new Promise((resolve,reject)=>{
                    resolve(imageURL.value)
                })
                .then(res=>{
                   
                    let data={
                        imageURL:res,
                        imageFileName:imageFileName
                    }
                    //以json形式传比较好获取数据---
                    //如果有错误就改成用base64传
                    axios({
                        method:'POST',
                        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
                        data:data,
                        url:"http://127.0.0.1:7001/saveImage"
                    })
                    .then(res=>{
                        if(res.data.data==1)
                        {
                            //重新请求数据
                             axios({
                                method:'get',
                                url:`${baseURL}/getImageList`
                            })
                            .then(res=>{
                                imageList.value=res.data.data.sort((a,b)=>{
                                    return b.Id-a.Id
                                });
                                ElMessage.success({
                                    message:'上传成功'
                                })
                            })
                        }
                    })
                })
                
            }
            //图片存储部分(只能后端保存图片到文件夹,前端不能保存)
            
        }
        return {
            imageList,
            hideShade,
            previewPic,
            isShowBigPic,
            bigPreviewSrc,
            deletePic,
            uploadFile,
            imageURL
            
        }
    }
})
</script>

<style lang='scss'>
@import '../static/style/views/picture.scss'
</style>