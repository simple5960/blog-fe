<template>
<div class="classify-item">
  <div class="nav-to-classified animate__animated animate__backInLeft" v-for="item in typeList" :key="item.typeId" @click="changeClassfiedData(item.typeId,item.typeName)">
      <div class="type-name">{{item.typeName}}</div>
      <div class="passage-count">{{item.typeArticleCount}}</div>
  </div>
</div>
</template>

<script>
import {useRouter} from 'vue-router'
import {defineComponent,onMounted,ref} from 'vue'
export default  defineComponent({
    name:"Classify",
    props:['typeList'],
    setup(props)
    {
        const router=useRouter();
        const changeClassfiedData=(id,name)=>{
            router.push({name:'Home',query:{typeName:name,typeId:id}})            
        }
        return {
            typeList:props.typeList,
            changeClassfiedData
        }
    }
})
</script>

<style lang='scss'  scoped>
@import '../static/style/components/classify.scss'
</style>