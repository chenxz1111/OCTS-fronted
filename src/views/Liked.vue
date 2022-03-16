<template>
<div>
  <el-menu default-active="1" class="el-menu-demo" mode="horizontal" active-text-color="#EE7947">
      <el-col :offset="0" :span="3">
              <el-image
                :fit="'fill'"
                :src="require('../assets/logo.png')"
                style="margin: 2px"
                @click="$router.push('/')"
              />
            </el-col>
  <div style="float:left; margin:20px; font-size:14px; user-select: none" v-if="isLogin">您好：{{customer_name}}</div>
  <div style="float:left; margin:20px; font-size:14px; user-select: none" @click="exit()" v-if="!isLogin">您好，请登录</div>
  <!-- <el-submenu index="2"> -->
  <template slot="title">您好：{{customer_name}}</template>
  <el-menu-item index="2-1" @click="$router.push('/')" v-if="isLogin">商品列表</el-menu-item>
  <el-menu-item index="2-2" @click="$router.push('/orderlist')" v-if="isLogin">我的订单</el-menu-item>
  <el-menu-item index="1">我的收藏</el-menu-item>
  <el-menu-item index="5" style="float:right" @click="exit()"><font color=#EE7947><strong>
    <span v-if="isLogin">退出登录</span>
    <span v-if="!isLogin">登录 / 注册</span>
    </strong></font></el-menu-item>
  <div style="float:right; margin:15px" v-if="isLogin">
    <el-tag type="warning" effect="dark">余额：￥{{money_display}}</el-tag>
  </div>
  <!-- </el-submenu> -->
</el-menu>
<el-row style="height: 10px"></el-row>
<el-main class="commodity_list">
<el-col :span="12" style="height: 230px" v-for="i in now_list" :key="i">
    <item @statechange='stateChange(i)' :id="i.id" :title="i.title" :now_price="i.now_price" :old_price="i.old_price" :introduction="i.introduction.slice(0,8)+'...'" :sell="i.sell" :store="i.store" :pictures="i.pictures" :liked="i.liked" :averageRating="i.averageRating"/>
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

</div>
</template>

<script>
import axios from 'axios'
import item from '@/components/commodity'
export default {
  name: 'Liked',
  components: {
    item
  },
  props: {},
  data () {
    return {
      itemlist: [],
      customer_name: '',
      isLogin: Boolean,
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
      now_page: 1
    }
  },
  mounted () {
    this.customer_name = localStorage.getItem('name')
    this.token = localStorage.getItem('userToken')
    // this.money = localStorage.getItem('money')
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
    axios.get('api/myfavourites/', {
      params: {
        username: this.customer_name,
        token: this.token
      }
    }).then(res => {
      this.itemlist.length = 0
      for (let i = 0; i < res.data.data.length; i++) {
        console.log(res.data.data[i].pictures)
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
          averageRating: res.data.data[i].average
        })
      }
    })
  },
  methods: {
    currentChange (val) {
      this.now_page = val
    },
    stateChange (i) {
      axios.post('api/favourite/', {
        id: i.id,
        username: this.customer_name,
        token: this.token
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
    // first_list: function () {
    //   if (this.now_page * 20 >= this.itemlist.length) {
    //     const mid = Math.ceil((this.itemlist.length - (this.now_page - 1) * 20) / 2)
    //     return this.itemlist.slice((this.now_page - 1) * 20, (this.now_page - 1) * 20 + mid)
    //   } else {
    //     return this.itemlist.slice((this.now_page - 1) * 20, this.now_page * 20 - 10)
    //   }
    // },
    // second_list: function () {
    //   if (this.now_page * 20 >= this.itemlist.length) {
    //     const mid = Math.ceil((this.itemlist.length - (this.now_page - 1) * 20) / 2)
    //     return this.itemlist.slice((this.now_page - 1) * 20 + mid)
    //   } else {
    //     return this.itemlist.slice((this.now_page - 1) * 20 + 10, this.now_page * 20)
    //   }
    // },
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

</style>
