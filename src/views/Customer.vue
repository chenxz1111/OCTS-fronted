<template>
<div>
  <el-menu default-active="1" class="el-menu-demo" mode="horizontal" active-text-color="#EE7947">
      <el-col :offset="0" :span="3">
              <el-image
                :fit="'fill'"
                :src="require('../assets/logo.png')"
                style="margin: 2px"
                @click="backpg1"
              />
            </el-col>
    <div style="float:left; margin:20px; font-size:14px; user-select: none" v-if="isLogin">您好：{{customer_name}}</div>
    <div style="float:left; margin:20px; font-size:14px; user-select: none" @click="exit()" v-if="!isLogin">您好，请登录</div>
    <el-menu-item index="1" >商品列表</el-menu-item>
    <!-- <el-submenu index="2">
    <template slot="title" v-if="isLogin">您好：{{customer_name}}</template>
    <template slot="title" v-if="!isLogin">您好，请登录</template>
    </el-submenu> -->
  <el-menu-item index="3" @click="$router.push('/orderlist')"  v-if="isLogin">我的订单</el-menu-item>
  <el-menu-item index="4" @click="$router.push('/customerliked')"  v-if="isLogin">我的收藏</el-menu-item>
  <!-- <el-menu-item index="5" v-if="isLogin">余额：{{money_display}}</el-menu-item>
  <el-menu-item @click="exit()" index="6" v-if="isLogin">退出登录</el-menu-item>
  <el-menu-item @click="exit()" index="6" v-if="!isLogin">登录 / 注册</el-menu-item> -->
  <el-menu-item index="5" style="float:right" @click="exit()"><font color=#EE7947><strong>
    <span v-if="isLogin">退出登录</span>
    <span v-if="!isLogin">登录 / 注册</span>
    </strong></font></el-menu-item>
  <div style="float:right; margin:15px" v-if="isLogin">
    <el-tag type="warning" effect="dark">余额：￥{{money_display}}</el-tag>
  </div>
</el-menu>
<el-row style="height: 10px"></el-row>
<el-row>
<el-input
  placeholder="快来寻找你中意的商品吧~"
  v-model="searchVal" @keyup.enter.native="onEnterSearch">
  <i slot="prefix" class="el-input__icon el-icon-search"></i>
</el-input>
<el-row style="height: 10px"></el-row>
<el-radio-group v-model="radio1"  @change="sort">
      <el-radio-button label="全部商品"></el-radio-button>
      <el-radio-button label="限时活动"></el-radio-button>
      <el-radio-button label="价格亲民"></el-radio-button>
      <el-radio-button label="销量火爆"></el-radio-button>
      <el-radio-button label="好评率高"></el-radio-button>
      <el-radio-button label="打折力度"></el-radio-button>
      <el-radio-button label="速来秒杀"></el-radio-button>
      <el-radio-button label="名称排序"></el-radio-button>
      <el-radio-button label="描述详细"></el-radio-button>
      <el-radio-button label="图片丰富"></el-radio-button>
      <el-radio-button label="库存富裕"></el-radio-button>
      <el-radio-button label="原始价格"></el-radio-button>
</el-radio-group>
</el-row>
<el-row style="height: 10px"></el-row>
<el-main class="commodity_list">
<el-col :span="12" style="height: 230px" v-for="i in now_list" :key="i">
    <item @statechange='stateChange(i)' :id="i.id" :title="i.title" :now_price="i.now_price" :old_price="i.old_price" :introduction="i.introduction.slice(0,8)+'...'" :sell="i.sell" :store="i.store" :pictures="i.pictures" :liked="i.liked" :averageRating="parseFloat(i.averageRating)" :ppprice='i.ppprice' :ddl='i.ddl'/>
</el-col>
</el-main>

<el-row>
<el-pagination
  background
  layout="prev, pager, next"
  :total="total_page"
  @current-change="currentChange">
</el-pagination>
</el-row>
<el-row style="height: 20px"></el-row>
<el-footer>@JDI2021SE</el-footer>
</div>
</template>

<script>
import axios from 'axios'
import item from '@/components/commodity'
export default {
  name: 'Customer',
  components: {
    item
  },
  props: {},
  data () {
    return {
      isLogin: Boolean,
      itemlist: [],
      customer_name: '',
      token: '',
      money: 0,
      newitem: {
        id: -1,
        title: '山水画卷图',
        now_price: 99.99,
        old_price: 199.99,
        sell: 999,
        available: true,
        store: 9999,
        introduction: '山水画卷图就是一幅画。',
        pictrues: [],
        liked: false,
        averageRating: 3.7
      },
      now_page: 1,
      searchVal: '',
      radio1: '全部商品'
    }
  },
  mounted () {
    this.customer_name = localStorage.getItem('name')
    this.token = localStorage.getItem('userToken')
    // this.money = localStorage.getItem('money')
    // this.isLogin = Boolean(this.customer_name) // temp
    axios.post('api/is_login/', {
      user: 'user',
      token: this.token
    }).then(res => {
      if (res.data.data === 'success') this.isLogin = true
    }).catch(error => {
      console.log(error.response)
      this.isLogin = false
    })
    axios.post('api/display_money/', {
      role: 'user',
      name: this.customer_name,
      token: this.token
    }).then(res => {
      // console.log(res.data)
      this.money = res.data.data
    }).catch(error => {
      console.log(error.response.status)
    })
    axios.post('api/products/', {
      username: this.customer_name,
      type: 0
    }).then(res => {
      // console.log(res.data)
      this.itemlist.length = 0
      for (let i = 0; i < res.data.data.length; i++) {
        // console.log(res.data.data[i].pictures)
        this.itemlist.unshift({
          id: res.data.data[i].id,
          title: res.data.data[i].title,
          now_price: res.data.data[i].now_price,
          old_price: res.data.data[i].old_price,
          introduction: res.data.data[i].introduction,
          sell: res.data.data[i].sell,
          store: res.data.data[i].store,
          pictures: res.data.data[i].pictures,
          liked: res.data.data[i].liked,
          averageRating: (parseFloat(res.data.data[i].average).toFixed(1) - 0.01).toFixed(2),
          ppprice: res.data.data[i].ppprice,
          ddl: res.data.data[i].ddl
        })
      }
    })
  },
  methods: {
    backpg1 () {
      this.now_page = 1
    },
    currentChange (val) {
      this.now_page = val
    },
    stateChange (i) {
      axios.post('api/favourite/', {
        id: i.id,
        username: this.customer_name
      })
      if (i.liked) {
        i.liked = false
      } else {
        i.liked = true
      }
    },
    exit () {
      sessionStorage.clear()
      localStorage.removeItem('name')
      localStorage.removeItem('userToken')
      this.$router.push('/login')
    },
    onEnterSearch: function (e, searchVal) {
      axios.get('api/search/', {
        params: {
          username: this.customer_name,
          keyword: this.searchVal,
          type: 0
        }
      }).then(res => {
        this.itemlist.length = 0
        for (let i = 0; i < res.data.data.length; i++) {
          this.itemlist.unshift({
            id: res.data.data[i].id,
            title: res.data.data[i].title,
            now_price: res.data.data[i].now_price,
            old_price: res.data.data[i].old_price,
            introduction: res.data.data[i].introduction,
            sell: res.data.data[i].sell,
            store: res.data.data[i].store,
            pictures: res.data.data[i].pictures,
            liked: res.data.data[i].liked,
            averageRating: (parseFloat(res.data.data[i].average).toFixed(1) - 0.01).toFixed(2),
            ppprice: res.data.data[i].ppprice,
            ddl: res.data.data[i].ddl
          })
        }
        if (res.data.data.length === 0) {
          this.itemlist = []
        }
      })
    },
    sort (type) {
      switch (type) {
        case '限时活动':
          // console.log(this.itemlist)
          // this.itemlist.sort(function (a, b) {
          //   return a.ddl < b.ddl
          // })
          this.select(1)
          break
        case '价格亲民':
          // console.log(this.itemlist)
          // this.itemlist.sort(function (a, b) {
          //   return a.now_price > b.now_price
          // })
          this.select(2)
          break
        case '销量火爆':
          // this.itemlist.sort(function (a, b) {
          //   return a.sell < b.sell
          // })
          this.select(3)
          break
        case '好评率高':
          // this.itemlist.sort(function (a, b) {
          //   return a.sell / (a.sell + a.store) < b.sell / (b.sell + b.store)
          // })
          this.select(4)
          break
        case '打折力度':
          // this.itemlist.sort(function (a, b) {
          //   return a.now_price / a.old_price > b.now_price / b.old_price
          // })
          this.select(5)
          break
        case '速来秒杀':
          // this.itemlist.sort(function (a, b) {
          //   return a.store > b.store
          // })
          this.select(6)
          break
        case '名称排序':
          // this.itemlist.sort(function (a, b) {
          //   return a.title > b.title
          // })
          this.select(7)
          break
        case '描述详细':
          // this.itemlist.sort(function (a, b) {
          //   return a.introduction.length < b.introduction.length
          // })
          this.select(8)
          break
        case '图片丰富':
          // this.itemlist.sort(function (a, b) {
          //   return a.pictures.length < b.pictures.length
          // })
          this.select(9)
          break
        case '库存富裕':
          // this.itemlist.sort(function (a, b) {
          //   return a.store < b.store
          // })
          this.select(10)
          break
        case '原始价格':
          // this.itemlist.sort(function (a, b) {
          //   return a.old_price < b.old_price
          // })
          this.select(11)
          break
        case '全部商品':
          location.reload()
          break
      }
    },
    select (type) {
      axios.get('api/search/', {
        params: {
          username: this.customer_name,
          keyword: this.searchVal,
          type: type
        }
      }).then(res => {
        this.itemlist.length = 0
        for (let i = 0; i < res.data.data.length; i++) {
          this.itemlist.unshift({
            id: res.data.data[i].id,
            title: res.data.data[i].title,
            now_price: res.data.data[i].now_price,
            old_price: res.data.data[i].old_price,
            introduction: res.data.data[i].introduction,
            sell: res.data.data[i].sell,
            store: res.data.data[i].store,
            pictures: res.data.data[i].pictures,
            liked: res.data.data[i].liked,
            averageRating: (parseFloat(res.data.data[i].average).toFixed(1) - 0.01).toFixed(2),
            ppprice: res.data.data[i].ppprice,
            ddl: res.data.data[i].ddl
          })
        }
        if (res.data.data.length === 0) {
          this.itemlist = []
        }
      })
    }
  },
  computed: {
    now_list: function () {
      if (this.now_page * 20 >= this.itemlist.length) {
        return this.itemlist.slice((this.now_page - 1) * 20)
      } else {
        return this.itemlist.slice((this.now_page - 1) * 20, this.now_page * 20)
      }
    },
    money_display () {
      return parseFloat(this.money).toFixed(2)
    },
    total_page: function () {
      return Math.ceil(this.itemlist.length / 20) * 10
    }
  }
}
</script>

<style>
.el-footer {
  background-color: #EE7947;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 60px;
}
</style>
