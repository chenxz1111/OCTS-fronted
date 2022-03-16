<template>
  <div class="block">
    <el-menu class="el-menu-demo" default-active="1" mode="horizontal" active-text-color="#EE7947">
        <el-col :offset="0" :span="3">
              <el-image
                :fit="'fill'"
                :src="require('../assets/logo.png')"
                style="margin: 2px"
                @click="mainpage()"
              />
            </el-col>
      <!-- <el-submenu index="2"> -->
      <div style="float:left; margin:20px; font-size:14px; user-select: none" v-if="isLogin">您好：{{customer_name}}</div>
      <div style="float:left; margin:20px; font-size:14px; user-select: none" @click="exit()" v-if="!isLogin">您好，请登录</div>
      <el-menu-item index="2-1" @click="mainpage()" >商品列表</el-menu-item>
      <el-menu-item index="2-2" @click="orderpage()"  v-if="isLogin">我的订单</el-menu-item>
      <el-menu-item index="2-3" @click="likedpage()"  v-if="isLogin">我的收藏</el-menu-item>
      <el-menu-item index="1">商品详情</el-menu-item>
      <el-menu-item index="5" style="float:right" @click="exit()"><font color=#EE7947><strong>
        <span v-if="isLogin">退出登录</span>
        <span v-if="!isLogin">登录 / 注册</span>
        </strong></font></el-menu-item>
      <div style="float:right; margin:15px" v-if="isLogin">
        <el-tag type="warning" effect="dark">余额：￥{{money_display}}</el-tag>
      </div>
      <!-- </el-submenu> -->
    </el-menu>
    <el-row style="height: 40px"></el-row>
    <el-main class="single commodity">
      <el-container>
        <el-aside width="600px">
          <el-carousel height="500px">
            <el-carousel-item :key="pic" v-for="pic in actual_pictures">
              <el-image :src="pic" fit="cover" style="width: 600px; height: 500px"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-aside>
        <el-container>
          <el-main>
            <el-card class="box-card">
              <div class="clearfix" slot="header">
                <span>{{title}}
                <el-rate v-model="averageRating" disabled show-score text-color="#ff9900"> </el-rate>
                </span>
              </div>
              <el-tooltip :content="'评价已' + comment_status" placement="top">
  <el-switch
    v-model="comment_status"
    active-color="#13ce66"
    inactive-color="#ff4949"
    active-value="打开"
    inactive-value="关闭"
    @change="poll">
  </el-switch>
</el-tooltip>
<div style="font-size:10px;color:rgb(140, 140, 140)">已有 {{this.comments.length}} 人评价</div>
              <el-row style="height: 18px"></el-row>
              <div style="color:#04B404"><b><i v-if="this.datestr!=''" class="el-icon-present"></i>{{this.datestr}} </b></div>
              <el-row style="height: 8px"></el-row>
              <div v-if="this.datestr==''" style="color:rgb(255, 51, 0);">
                <b>现价:￥{{now_price}}</b>
              </div>
               <div v-if="this.datestr!=''" style="font-size:14px;color:rgb(140, 140, 140);text-decoration:line-through">
                <b>现价:￥{{now_price}}</b>
              </div>
              <el-row style="height: 10px"></el-row>
              <div
                style="font-size:14px;color:rgb(140, 140, 140);text-decoration:line-through"
              >原价:￥{{old_price}}</div>
              <el-row style="height: 10px"></el-row>
              <div style="font-size:14px;color:rgb(140, 140, 140)">描述信息:{{introduction}}</div>
              <el-row style="height: 59px"></el-row>
              <div style="font-size:10px;color:rgb(140, 140, 140)">销量: {{sell}} 库存: {{store}}</div>
              <div>
                <el-input-number
                  :max="store"
                  :min="1"
                  @change="handleChange"
                  label="购买数量"
                  v-model="num"
                ></el-input-number>
              </div>
              <el-row style="height: 10px"></el-row>
              <div>
                <el-button @click="makeOrder()" type="danger">{{state}}</el-button>
              </div>
            </el-card>
          </el-main>
        </el-container>
      </el-container>
    </el-main>
    <el-dialog :visible.sync="alertDialog.dialogVisible" style="text-align: center" width="40%">
      <el-row style="height: 20px"></el-row>
      <font size="4">{{alertDialog.text}}</font>
      <el-row style="height: 100px"></el-row>
      <div>
        <el-row>
          <el-col :offset="5" :span="5">
            <el-button @click="$router.push('/login')" type="primary">前往登录</el-button>
          </el-col>
          <el-col :offset="4" :span="5">
            <el-button @click="$router.push('/')">逛逛商品</el-button>
          </el-col>
        </el-row>
        <el-row style="height: 100px"></el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
// import item from '@/components/commodity'
// import editDialog from '@/components/buyDialog'
export default {
  name: 'Commodity',
  components: {
    // item,
    // editDialog
  },
  props: {
    pictures: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      ddl: '',
      ppprice: '',
      customer_name: '',
      token: '',
      isLogin: false,
      money: 0,
      num: 1,
      id: -1,
      title: '',
      now_price: 0,
      old_price: 0,
      introduction: '',
      sell: 0,
      store: 0,
      warn: 0,
      newitem: {
        title: '山水画卷图',
        now_price: 99.99,
        old_price: 199.99,
        sell: 9999,
        available: true,
        store: 9999,
        introduction: '山水画卷图就是一幅画。',
        pictures: []
      },
      alertDialog: {
        text: '',
        dialogVisible: false
      },
      // 浏览器宽度
      creenWidth: 0,
      comment_status: '关闭',
      comment_id: 0,
      comments: [
        { username: 'x', comment: '好棒啊！', rating: 5 },
        { username: 'c', comment: '好啊！', rating: 4 }
      ],
      averageRating: 3.7
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.datetime = new Date().getTime()
    }, 1000)
    this.id = this.$route.query.id
    this.customer_name = localStorage.getItem('name')
    this.token = localStorage.getItem('userToken')
    this.money = localStorage.getItem('money')
    // this.isLogin = Boolean(this.customer_name)
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
    axios.get('api/details/' + (this.id + '')).then(res => {
      if (res.data.code === 200 && res.data.data.available === true) {
        this.title = res.data.data.title
        this.now_price = res.data.data.now_price
        this.old_price = res.data.data.old_price
        this.introduction = res.data.data.introduction
        this.sell = res.data.data.sell
        this.store = res.data.data.store
        this.pictures = res.data.data.pictures
        this.comments = res.data.data.comments
        this.averageRating = parseFloat(parseFloat(res.data.data.average).toFixed(1) - 0.01).toFixed(2)
        this.ppprice = res.data.data.ppprice
        this.ddl = res.data.data.ddl
      }
      // console.log(this.comments)
    })
  },
  created () {
    this.datetime = new Date().getTime()
  },
  computed: {
    actual_pictures: function () {
      const tmp = this.pictures
      for (let i = 0; i < tmp.length; i++) {
        tmp[i] = 'api' + tmp[i]
      }
      return tmp
    },
    state: function () {
      if (this.store > 0) {
        return '立即抢购'
      } else {
        return '已售罄'
      }
    },
    money_display () {
      return parseFloat(this.money).toFixed(2)
    },
    datestr: function () {
      var rightTime = this.ddl - this.datetime
      if (rightTime > 0) {
        return '秒杀价￥' + this.ppprice
      } else {
        return ''
      }
    }
  },
  methods: {
    mainpage () {
      clearInterval(this.myInterval)
      this.$router.push('/')
    },
    orderpage () {
      clearInterval(this.myInterval)
      this.$router.push('/orderlist')
    },
    likedpage () {
      clearInterval(this.myInterval)
      this.$router.push('/customerliked')
    },
    exit () {
      clearInterval(this.myInterval)
      sessionStorage.clear()
      localStorage.removeItem('name')
      localStorage.removeItem('userToken')
      this.$router.push('/login')
    },
    handleChange (value) {
      console.log(value)
    },
    makeOrder () {
      if (this.state === '立即抢购') {
        if (this.isLogin) {
          this.$router.push({ path: '/order', query: { id: this.id, buy_num: this.num } })
          clearInterval(this.myInterval)
        } else {
          this.alertDialog.text = '你好，请登录！'
          this.alertDialog.dialogVisible = true
          clearInterval(this.myInterval)
        }
      }
    },
    star (rating) {
      var s = ''
      for (let i = 0; i < rating; i++) {
        s += '★'
      }
      return s
    },
    open (comment) {
      this.$notify({
        title: comment.username + '⋆⋆:',
        message: '<strong>' + comment.comment + '</strong>' + '<font size="3" color="#FFA340">' + this.star(comment.rating) + '</font>',
        offset: 100,
        dangerouslyUseHTMLString: true
      })
    },
    poll () {
      if (this.comment_status === '打开') {
        this.myInterval = window.setInterval(() => {
          setTimeout(() => {
            if (this.comment_id >= 0 && this.comment_id < this.comments.length) {
              this.open(this.comments[this.comment_id])
            }
            this.comment_id += 1
            if (this.comment_id >= this.comments.length) {
              this.comment_id = 0
            }
          }, 1)
        }, 2250)
      } else {
        clearInterval(this.myInterval)
      }
    }
  }

}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
