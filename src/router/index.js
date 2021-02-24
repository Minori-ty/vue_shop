import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')

// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')

// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/power/Roles.vue')

// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/goods/Params.vue')

// import GoodsList from '../components/goods/List.vue'
const GoodsList = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/goods/List.vue')
// import Add from '../components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/goods/Add.vue')

// import Order from '../components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/order/Order.vue')
// import Report from '../components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/report/Report.vue')

import TreeTable from 'vue-table-with-tree-grid'

Vue.use(VueRouter)

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
// import 'quill/dist/quill.core.css' // import styles
// import 'quill/dist/quill.snow.css' // for snow theme
// import 'quill/dist/quill.bubble.css' // for bubble theme


const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home, redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome, },
      { path: '/users', component: Users, },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report },
    ]
  },
]

Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

const router = new VueRouter({
  routes
})

// 配置路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login');
  next()
})

export default router
