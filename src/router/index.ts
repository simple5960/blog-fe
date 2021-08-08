import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children:[
      {
        path:"/classfiedArticle/:typeName",
        name:"classfiedArticle",
        component:()=>import('../components/Passage.vue')
      }
    ]
  },
  {
    path:"/detail/:articleId",
    name:"detailPassage",
    component:()=>import('../components/DetailPassage.vue')
  },
  {
    path:"/login",
    name:"login",
    component:Login
  },
  {
    path:'/picture',
    name:'picture',
    component:()=>import('../views/Picture.vue')
  },
  {
    path: '/edit',
    name: 'edit',
    component:():any=>import('../components/Edit.vue'),
    children:[
      {
        path: '/edit/addArticle',
        name: 'AddArticle',
        component:():any=>import('../components/AddArticle.vue'),
      },
      {
        path: '/edit/addArticle/:articleId',
        name: 'editArticle',
        component:():any=>import('../components/AddArticle.vue'),
      },
      {
        path: '/edit/articleManage',
        name: 'ArticleManage',
        component:():any=>import('../components/ArticleManage.vue'),
      },
      {
        path: '/edit/articleType',
        name: 'ArticleType',
        component:():any=>import('../components/ArticleType.vue'),
      },
      {
        path: '/edit/userManage',
        name: 'UserManage',
        component:():any=>import('../components/UserManage.vue'),
      }
    ]
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
