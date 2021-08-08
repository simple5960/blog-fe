# 解决跨域携带cookie的问题
+ 前端设置
```js
//在每次请求的时候在加一个withCredential:true
axios({
    url:`${baseURL}/addArticle`,
    method:"POST",
    //一定要设置下面这个headers才可以跨域携带
    headers:{
    'Access-Control-Allow-Origin':'http://localhost:8080/'
    },
    withCredentials:true,
})


//在login的时候也要加withCredential:true
axios({
    url:`${baseURL}/login`,
    method:"post",
    withCredentials:true,
    data:{
        userName:userName.value,
        userPassword:userPassword.value
    },
})
```
+ 后端设置
>set-cookie
```js
ctx.cookies.set("token", token, {
    httpOnly: true, // 默认就是 true
    path:'/',
    maxAge: 0.5 * 3600 * 1000,//有效时间 30分钟
    signed:false,
    encrypt:false//对cookie加密
    });
```
>设置允许跨域访问
```js
config.cors = {
    origin: ctx => ctx.get('origin'),
    credentials: true,  //允许Cookie可以跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
};
```
+ egg.js设置中间件来进行权限验证
```js
//在app文件夹中新建一个middleware文件夹,简历一个adminauth.js文件
module.exports = options =>{
    return async function adminauth(ctx,next){
        //判断传上来的cookie中的token和session中的token一样不
        if(ctx.session.token==ctx.request.header.cookie.split(';')[0].split('=')[1]){
            await next()
        }else{
            ctx.body={data:'没有登录'}
        }
    }
}

//然后在router.js中使用中间件
var adminauth = app.middleware.adminauth()
//这样就有了权限验证
router.post('/addArticle',adminauth,controller.home.addArticle)
```