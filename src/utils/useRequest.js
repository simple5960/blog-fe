import axios from 'axios'
const baseURL='http://127.0.0.1:7001'

const getTypeList= ()=>{
    let res=[]
    axios({
        url:`${baseURL}/getTypeList`,
        method:'get'
    })
    .then(result=>{  
       //console.log(result.data);
       res.push(...result.data)
    })  
    return res
}
const getArticleListByPage=(currentPage,pageSize)=>{    
    return new Promise((resolve,reject)=>{
        axios({
            url:`${baseURL}/getArticleListByPage`,
            method:"post",
            data:{
                pageSize:pageSize,
                currentPage:currentPage
            }
            })
        .then(result=>{
            resolve(result.data.data)
        })
    })    
}
const getArticleListByTypeIdAndPage=(typeId,currentPage,pageSize)=>{
    return new Promise((resolve,reject)=>{
        axios({
            url:`${baseURL}/getArticleListByTypeIdAndPage`,
            method:"post",
            data:{
                typeId:typeId,
                currentPage:currentPage,
                pageSize:pageSize
            }
            })
        .then(result=>{
            resolve(result.data.data)
        })
    })
}
const incLikeCount=(id,count)=>{
    return new Promise((resolve,reject)=>[
        axios({
            url:`${baseURL}/updateArticleLikeCount`,
            method:"post",
            withCredentials:true,
            headers:{
                'Access-Control-Allow-Origin':'*',
            },
            data:{
                articleId:id,
                articleLikeCount:count+1
            }
        })
        .then(res=>[
            resolve(res.data.likeCount[0].articleLikeCount)
        ])
    ])
}
const loadMoreList=(pageSize,currentPage,id)=>{
    return new Promise((resolve,reject)=>{
        if(!id)
        {
            console.log(currentPage);
            axios({
                url:`${baseURL}/getArticleListByPage`,
                method:"post",
                data:{
                    pageSize:pageSize,
                    currentPage:currentPage
                }
                })
            .then(result=>{
                resolve(result.data.data)
            })
        }
        else
        {
            
            axios({
                url:`${baseURL}/getArticleListByTypeIdAndPage`,
                method:"post",
                data:{
                    typeId:id,
                    currentPage:currentPage,
                    pageSize:pageSize
                }
                })
            .then(result=>{
                resolve(result.data.data)
            })
        }
    })
}
export {
    getTypeList,
    getArticleListByPage,
    getArticleListByTypeIdAndPage,
    incLikeCount,
    loadMoreList
}