<template>
  <div>
    <el-menu class="el-menu-demo" default-active="1" mode="horizontal" active-text-color="#EE7947">
      <el-col :offset="0" :span="3">
              <el-image
                :fit="'fill'"
                :src="require('../assets/logo.png')"
                style="margin: 2px"
                @click="$router.push('/')"
              />
          </el-col>
      <div style="float:left; margin:20px; font-size:14px; user-select: none" v-if="isLogin">您好：{{username}}</div>
      <div style="float:left; margin:20px; font-size:14px; user-select: none" @click="exit()" v-if="!isLogin">您好，请登录</div>
      <el-menu-item index="2-1" @click="$router.push('/')">商品列表</el-menu-item>
      <el-menu-item index="2-2" @click="toOrderList()" v-if="isLogin">我的订单</el-menu-item>
      <el-menu-item index="2-3" @click="$router.push('/customerliked')" v-if="isLogin">我的收藏</el-menu-item>
      <el-menu-item index="1">订单确认</el-menu-item>
      <el-menu-item index="5" style="float:right" @click="exit()"><font color=#EE7947><strong>
        <span v-if="isLogin">退出登录</span>
        <span v-if="!isLogin">登录 / 注册</span>
        </strong></font></el-menu-item>
      <div style="float:right; margin:15px" v-if="isLogin">
        <el-tag type="warning" effect="dark">余额：￥{{money_display}}</el-tag>
      </div>
    </el-menu>
    <el-row style="height: 40px"></el-row>
    <el-row style="height: 80px">
      <font size="5">确认订单信息</font>
    </el-row>
    <el-container>
      <el-col :offset="4" :span="16">
        <el-card>
          <el-row style="height: 300px">
            <el-table :data="tableData" :header-cell-style="{background:'#FDEDDD'}">
              <el-table-column align="center" label="商品名称" prop="title"></el-table-column>
              <el-table-column align="center" label="单价" prop="unitPrice" width="100"></el-table-column>
              <!-- 商品数量最好改为可修改 -->
              <el-table-column align="center" label="数量" prop="quantity" width="150"></el-table-column>
              <el-table-column align="center" label="总价" prop="totalPrice" width="100"></el-table-column>
            </el-table>
            <el-row style="height: 80px"></el-row>
            <el-col :offset="16" :span="8">
              <el-button round type="primary" v-on:click="placeOrder">立即抢购</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-container>
    <el-row style="height: 150px"></el-row>
    <el-footer>@JDI2021SE</el-footer>
    <el-dialog :visible.sync="alertDialog.dialogVisible" style="text-align: center" width="40%">
      <el-row style="height: 20px"></el-row>
      <font size="4">{{alertDialog.text}}</font>
      <el-row style="height: 100px"></el-row>
      <div v-if="alertDialog.text==='请至少购买一份商品'">
        <el-row>
          <el-button @click="toCommodity()"  type="primary">返回修改</el-button>
        </el-row>
        <el-row style="height: 80px"></el-row>
      </div>
      <div v-if="alertDialog.text==='下单成功，请及时进行支付'">
        <el-row>
          <el-col :span="5" :offset="6">
            <el-button @click="pay()" type="primary">支付</el-button>
          </el-col>
          <el-col :span="5" :offset="2">
            <el-button @click="payLater()">稍后支付</el-button>
          </el-col>
        </el-row>
        <el-row style="height: 100px"></el-row>
      </div>
      <div v-if="alertDialog.text==='支付成功！'||alertDialog.text==='支付后才能为您安排发货喔~'">
        <el-row>
        <el-col :span="5" :offset="6">
          <el-button @click="toCustomer()" type="primary">继续购物</el-button>
        </el-col>
        <el-col :span="5" :offset="2">
          <el-button @click="toOrderList()">查看订单</el-button>
        </el-col>
        </el-row>
        <el-row style="height: 100px"></el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Order',
  props: {
  },
  data () {
    return {
      goodid: Number,
      isLogin: Boolean,
      username: '',
      money: 0,
      orderid: '',
      token: '',
      tableData: [{
        title: '',
        unitPrice: '',
        quantity: 1,
        totalPrice: ''
      }],
      alertDialog: {
        text: '',
        dialogVisible: false
      }
    }
  },
  mounted () {
    this.goodid = this.$route.query.id
    if (this.$route.query.buy_num > 0) this.tableData[0].quantity = this.$route.query.buy_num
    this.username = localStorage.getItem('name')
    // this.money = localStorage.getItem('money')
    this.token = localStorage.getItem('userToken')
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
      name: this.username,
      token: this.token
    }).then(res => {
      // console.log(res.data)
      this.money = res.data.data
    }).catch(error => {
      console.log(error.response.status)
    })
    axios.get('api/details/' + (this.goodid + '')).then(res => {
      // console.log(res.data)
      if (res.data.code === 200 && res.data.data.available === true) {
        this.tableData[0].title = res.data.data.title
        if (res.data.data.ddl > new Date().getTime()) {
          this.tableData[0].unitPrice = res.data.data.ppprice
          this.tableData[0].totalPrice = ((res.data.data.ppprice - 0) * (this.tableData[0].quantity - 0)).toFixed(2)
        } else {
          this.tableData[0].unitPrice = res.data.data.now_price
          this.tableData[0].totalPrice = ((res.data.data.now_price - 0) * (this.tableData[0].quantity - 0)).toFixed(2)
        }
        // this.old_price = res.data.data.old_price
        // this.introduction = res.data.data.introduction
        // this.sell = res.data.data.sell
      }
    })
  },
  methods: {
    exit () {
      sessionStorage.clear()
      localStorage.removeItem('name')
      localStorage.removeItem('userToken')
      this.$router.push('/login')
    },
    placeOrder () {
      if (this.tableData[0].quantity - 0 < 1) {
        this.alertDialog.text = '请至少购买一份商品'
        this.alertDialog.dialogVisible = true
        return
      }
      axios.post('api/order/', {
        username: this.username,
        token: this.token,
        goodid: this.goodid,
        count: this.tableData[0].quantity - 0
      }).then(res => {
        if (res.data.code === 200) {
          this.orderid = res.data.data
          this.alertDialog.text = '下单成功，请及时进行支付'
          this.alertDialog.dialogVisible = true
        }
      }).catch(error => {
        console.log(error.response.status)
        this.alertDialog.text = error.response.data.data
        if (error.response.data.data === 'key message is wrong') this.alertDialog.text = '非法数据'
        if (error.response.data.data === 'message is invalid') this.alertDialog.text = '非法请求'
        if (error.response.data.data === 'user or good doesn\'t exist') this.alertDialog.text = '用户或商品不存在'
        if (error.response.data.data === 'the good is off shelf') this.alertDialog.text = '商品已下架'
        if (error.response.data.data === 'money is not enough') this.alertDialog.text = '余额不足'
        if (error.response.data.data === 'quantity of goods is not enough') this.alertDialog.text = '库存不足'
      })
      this.alertDialog.dialogVisible = true
    },
    pay () {
      axios.post('api/pay/', {
        username: this.username,
        token: this.token,
        orderid: this.orderid,
        cost: this.tableData[0].totalPrice - 0
      }).then(res => {
        if (res.data.code === 200) {
          // this.money -= this.tableData[0].totalPrice
          // localStorage.setItem('money', this.money)
          this.alertDialog.text = '支付成功！'
          this.alertDialog.dialogVisible = true
        }
      }).catch(error => {
        console.log(error.response.status)
        this.alertDialog.text = error.response.data.data
      })
      this.alertDialog.dialogVisible = true
    },
    payLater () {
      this.alertDialog.text = '支付后才能为您安排发货喔~'
    },
    toCustomer () {
      this.$router.push('/')
    },
    toOrderList () {
      this.$router.push('/orderlist')
    },
    toCommodity () {
      this.$router.push({ path: '/commodity', query: { id: this.goodid } })
    }
  },
  computed: {
    money_display () {
      return parseFloat(this.money).toFixed(2)
    }
  }
}
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #ee7947;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 60px;
}
.el-table {
  margin: 4%;
  width: 92%;
}
/* .el-row {
  height: 120px;
}
.el-card {
  height: 400px;
} */
</style>
