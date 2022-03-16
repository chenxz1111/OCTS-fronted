import Vue from 'vue'
import VueRouter from 'vue-router'
import StartPage from '../views/StartPage.vue'
import Customer from '../views/Customer.vue'
import Commodity from '../views/Commodity.vue'
import Merchant from '../views/Merchant.vue'
import Order from '../views/Order.vue'
import OrderList from '../views/OrderList.vue'
import OrderListMerchant from '../views/OrderListMerchant.vue'
import Liked from '../views/Liked.vue'
import MerchantDraft from '../views/MerchantDraft.vue'
import NotFound from '../views/error_404/NotFound.vue'
import InternalServerError from '../views/error_500/InternalServerError.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'StartPage',
    component: StartPage,
    meta: { title: '登录' }
  },
  {
    path: '/',
    name: 'Customer',
    component: Customer,
    meta: { title: '首页' }
  },
  {
    path: '/commodity',
    name: 'Commodity',
    component: Commodity,
    meta: { title: '商品详情' }
  },
  {
    path: '/merchant',
    name: 'Merchant',
    component: Merchant,
    meta: { title: '商家' }
  },
  {
    path: '/order',
    name: 'Order',
    component: Order,
    meta: { title: '下单' }
  },
  {
    path: '/orderlist',
    name: 'OrderList',
    component: OrderList,
    meta: { title: '我的订单' }
  },
  {
    path: '/customerliked',
    name: 'Liked',
    component: Liked,
    meta: { title: '我的收藏' }
  },
  {
    path: '/orderlistmerchant',
    name: 'OrderListMerchant',
    component: OrderListMerchant,
    meta: { title: '商户订单列表' }
  },
  {
    path: '/merchantdraft',
    name: 'MerchantDraft',
    component: MerchantDraft,
    meta: { title: '草稿箱' }
  },
  {
    path: '/500',
    name: '500',
    component: InternalServerError
  },
  {
    path: '/404',
    name: '404',
    component: NotFound
  },
  { // * must be the last
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('Authorization')
    if (token === 'null' || token === '') {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
