//@ts-ignore
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//@ts-ignore
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
//@ts-ignore
import animated from 'animate.css' // npm install animate.css --save安装，在引入
import '../src/static/style/global.css'
//@ts-ignore
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
//@ts-ignore
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
//@ts-ignore
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
//@ts-ignore
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
//@ts-ignore
import serviceWorker from "./utils/service.js";
VMdPreview.use(githubTheme);
VueMarkdownEditor.use(vuepressTheme);
serviceWorker('./sw.js')
createApp(App).use(store).use(router).use(ElementPlus).use(animated).use(VueMarkdownEditor).use(VMdPreview).mount('#app')
