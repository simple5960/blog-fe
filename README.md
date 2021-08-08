# blog

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# 环境搭建
### 项目初创
```
这是一个vue3+TypeScript+element-plus的项目,在用vue-cli创建项目的时候选择manmully手动创建
需要选择的项目有vue,typescript,vuex,vue-router,css预处理(因为element-plus支持scss).
```
### 下载element-plus
```js
//下载
npm i element-plus --save

//下载完成之后在main.ts中引入
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
createApp(App).use(store).use(router).use(ElementPlus).mount('#app')
```

# 首页导航栏的编写

# [数据库配置](https://blog.csdn.net/yzwdzkn/article/details/99622238)
### id自动变化
>添加操作

```sql
create table content(
id int identity(1,1),
pid int,
datas varchar(50))
---插入操作
declare @rawCount int
set @rawCount=(select count(*)as num from content)
insert into content (pid,datas) values(@rawCount+1,'fff')
select * from content
```
> 删除操作

```sql
declare @delPid int 
set @delPid=2
delete from content where pid=@delPid
update content set pid=pid-1 where pid>@delPid
select * from content
加一个触发器trigger, 在删除一个id的时候, 将比它大的id全部id-1
---拿到每一行的排序数据
select Row_Number() over ( order by getdate() ) as init , * from content
```
## 数据库整体表的设计
### userTable(用户表)
```sql
user_id int
user_name varchar
user_password varchar
```
### coommentTable(评论表)
```sql
comment_id int
use_id int
article_id int
comment_like_count int
comment_date datetime
comment_content text
---parent_comment_id? int
```

### articleTable(文章表)
```sql
article_id int
article_type_id int
article_title text
article_content longtext
article_view_count int
article_comment_count int
article_date datetime
article_like_count int
```
### typeTable(分类表)
```sql
type_id int
type_name varchar
```
## 文章表插入操作
>插入文章

```sql
---insert article into articleTable
declare @articleId int,@articleTypeId int,@articleTitle varchar(60),
@articleContent varchar(60),@articleDate date
---这里的@articleTitle和@articleContent到时候不用声明为varchar,直接用变量
--articleId自增
set @articleId=(select count(*)as num from article)
set @articleTypeId=1
set @articleTitle='我是一个标题'
set @articleContent='我是一个内容'
set @articleDate='2020-12-22'
insert into article (articleId,
articleTypeId,articleTitle,
articleContent,articleDate) values(@articleId+1,@articleTypeId
,@articleTitle,@articleContent,@articleDate)
```
>删除文章

```sql
---delete article from article
declare @delArticleId int
set @delArticleId=2
delete from article where articleId=@delArticleId
update article set articleId=articleId-1 where articleId>@delArticleId
select * from article
```
>点赞、评论量、浏览数量修改

```sql
---文章浏览量修改
declare @articleViewCount int
declare @articleId int
set @articleId=2
set @articleViewCount=666
update article set  articleViewCount=@articleViewCount where articleId=@articleId
select * from article
---文章评论量修改
declare @articleCommentCount int
declare @articleId int
set @articleId=3
set @articleCommentCount=222
update article set  articleCommentCount=@articleCommentCount
where articleId=@articleId
select * from article
---文章点赞量修改
declare @articleLikeCount int
declare @articleId int
set @articleId=2
set @articleLikeCount=66
update article set  articleLikeCount=@articleLikeCount
where articleId=@articleId
select * from article
```
>文章评论插入

```sql
declare @articleId int
declare @commentId int,@commentContent varchar(60),
@commentDate datetime
set @commentId=(select count(*)as num from comment)
set @articleId=2
set @commentContent='test comment'
set @commentDate='2021-03-02'
insert into comment (commentId,articleId,commentDate,commentContent) 
values(@commentId+1,@articleId,@commentDate,@commentContent)
select commentContent,articleContent from comment c join article a
on a.articleId=c.articleId
select * from comment
```
>文章评论删除

```sql
declare @commentId int
set @commentId=2
delete from comment where commentId=@commentId
update comment set commentId=commentId-1 where commentId>@commentId
select * from comment
```
>选取某个文章的评论

```sql
select commentContent from comment join article on 
comment.articleId=article.articleId
where article.articleId=2
```
>文章类型的添加

```sql
declare @typeId int,@typeName varchar(50)
set @typeId=(select count(*) from typeTable)
set @typeName='ES6'
insert into typeTable (typeId,typeName) values
(@typeId+1,@typeName)
select * from typeTable
```
>文章类型的删除

```sql
declare @typeId int
set @typeId=2
delete from typeTable where typeId=@typeId
update typeTable set typeId=typeId-1 where typeId>@typeId
select * from typeTable
```
>article与typeTable之间的关系

```sql
alter table article
add constraint article_typeTable foreign key (articleTypeId) references typeTable(typeId) on delete cascade
```
>commetn与article之间的关系

```sql
alter table comment
add constraint comment_article foreign key (articleId) 
references article(articleId) on delete cascade
```
# 后台接口
## getArticleList
```sql
select * from article
```
## getArticleListByTypeId
```sql
select * from article a join 
typeTable t on a.articleTypeId=t.typeId
```
## getArticleDetail
```sql
select * from article a join 
typeTable t on a.articleTypeId=t.typeId
join comment c on a.articleId=c.articleId
where a.articleId=2
```
### issues
>拿不到dom节点

```js
onMounted(()=>{
        axios.all([requestArticleDetail(),requestComment()])
        .then(axios.spread((articleRes,commentListRes)=>{
            data.value=articleRes.data.res[0];
            content.value=articleRes.data.res[0].articleContent;
            commentList.value=commentListRes.data.res;
        }))
        .then(()=>{
            //注意要在请求完成之后才能去获取dom节点,因为dom节点的生成依赖于请求的数据
            console.log(document.querySelectorAll('.v-md-editor-preview h1'));
        })
        
    })
```