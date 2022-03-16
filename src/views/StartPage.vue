<template>
  <div class="home">
        <div>
          <!-- @select="handleSelect" -->
    <el-menu class="el-menu-demo" default-active="用户" mode="horizontal" active-text-color="#EE7947">
        <el-col :offset="0" :span="3">
              <el-image
                :fit="'fill'"
                :src="require('../assets/logo.png')"
                style="margin: 2px"
              />
            </el-col>
            <el-col :span="0">
            </el-col>
            <el-col :offset="11" :span="1">
              <i class="el-icon-caret-right" style="margin: 20px"></i>
            </el-col>
            <!-- <el-menu-item index="注册" v-on:click="Reg">注册</el-menu-item>
            <el-menu-item index="登录" v-on:click="Log">登录</el-menu-item>
            <el-menu-item index="商户" v-on:click="merchant()">商户通道</el-menu-item> -->
            <el-menu-item index="用户" v-on:click="user">我是用户</el-menu-item>
            <el-menu-item index="商家" v-on:click="merchant">我是商家</el-menu-item>
            <el-menu-item index="游客登录" v-on:click="$router.push('/')">游客通道</el-menu-item>
          </el-menu>
        </div>
    <el-container>
      <el-main>
        <el-col :offset="2" :span="12">
          <el-row style="height: 40px"></el-row>
          <el-row style="height: 100px"></el-row>
          <!-- <el-row>
            <el-button icon="el-icon-user" round v-on:click="Log">用户登录</el-button>
          </el-row>
          <el-row>
            <el-button icon="el-icon-location-outline" round v-on:click="Reg">用户注册</el-button>
          </el-row>
          <el-row>
            <el-button icon="el-icon-s-custom" plain type="primary" v-on:click="merchant()">商家通道</el-button>
          </el-row>-->
          <el-row>
            <img :src="imgUrl" height="300px" width="420px" />
          </el-row>
          <el-row style="height: 100px"></el-row>
        </el-col>
        <el-col :span="6">
          <!-- <el-row style="height: 40px"></el-row>
          <el-card class="box-card">
            <el-row>
              <el-input placeholder="请输入账号" style="width: 240px" v-model="state.username"></el-input>
            </el-row>
            <el-row>
              <el-input placeholder="请输入密码" show-password style="width: 240px"></el-input>
            </el-row>
            <el-row>
              <el-button round type="primary">{{this.LogStatus}}</el-button>
            </el-row>
          </el-card>-->
          <el-row style="height: 80px"></el-row>
          <el-card>
            <el-row style="margin:5px">
            <!-- notice that @change is asyn -->
            <!-- <el-radio-group v-model="LogStatus" size="small" @input="statusChange" v-if="this.identity==='用户'">
              <el-radio-button label="注册"></el-radio-button>
              <el-radio-button label="登录"></el-radio-button>
            </el-radio-group> -->
            </el-row>
            <el-row justify="center" type="flex">
              <el-col :span="18">
                <el-form :model="loginForm" :rules="loginRules" ref="loginForm" size="medium" @submit.native.prevent>
                  <el-row style="height: 10px"/>
                  <el-row style="height: 20px" v-if="this.LogStatus==='登录'"></el-row>
                  <el-row style="height: 30px" v-if="this.identity==='商家'"></el-row>
                  <el-row style="height: 50px">
                    <el-alert
                      @close="alertClose"
                      effect="dark"
                      style="height: 36px"
                      type="error"
                      v-if="this.state.showAlert"
                    >
                      <h5>{{this.state.errorMeg}}</h5>
                    </el-alert>
                  </el-row>
                  <el-row style="height: 60px" v-if="this.identity==='用户'">
                    <el-form-item prop="username">
                      <el-input
                        inline-message="true"
                        placeholder="请输入账号"
                        v-model="loginForm.username"
                        @keyup.enter.native="go()"
                      ></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row style="height: 60px">
                    <el-form-item prop="password" >
                      <el-input placeholder="请输入密码" show-password v-model="loginForm.password" @keyup.enter.native="go()"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row style="height: 60px" v-if="this.LogStatus==='注册'">
                    <el-form-item prop="confirmPassword">
                      <el-input
                        placeholder="请再次确认密码"
                        show-password
                        v-model="loginForm.confirmPassword"
                        @keyup.enter.native="go()"
                      ></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row style="height: 30px" v-if="this.identity==='商家'"></el-row>
                  <el-row style="height: 60px" v-if="this.LogStatus==='登录'"></el-row>
                  <el-row style="height: 20px" v-if="this.LogStatus==='注册'"></el-row>
                  <!-- <el-form-item prop="code">
                    <validCode/>
                    <el-input class="code" placeholder="请输入验证码" style="width: 120px" v-model="loginForm.code"></el-input>
                  </el-form-item>-->
                  <!-- <el-checkbox class="rememberMe" label="记住我" v-model="loginForm.rememberMe"></el-checkbox> -->
                  <el-button
                    :disabled="this.state.usename_valid===false"
                    round
                    type="primary"
                    v-on:click="go()"
                  >{{this.LogStatus}}</el-button>
                  <el-row style="height: 10px"></el-row>
                 <el-link type="info" icon='el-icon-thumb' v-if="this.LogStatus==='登录'&&this.identity==='用户'" v-on:click="Reg"><font size='1'>还没有账号？点击这里</font></el-link>
                 <el-link type="info" icon='el-icon-thumb' v-if="this.LogStatus==='注册'" v-on:click="Log"><font size='1'>前往登录</font></el-link>
                </el-form>
              </el-col>
            </el-row>
          </el-card>
          <el-row style="height: 120px"></el-row>
        </el-col>
      </el-main>
    </el-container>
    <el-container>
      <el-footer>@JDI2021SE</el-footer>
    </el-container>
    <el-dialog
      :title="alertDialog.text"
      :visible.sync="alertDialog.dialogVisible"
      style="text-align: center"
      width="40%"
    ></el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import md5 from 'js-md5'
import { mapMutations } from 'vuex'
// import validCode from '@/components/validCode'
// import Sidentify from '@/components/identify'
export default {
  name: 'StagePage',
  components: {
    // validCode
    // Sidentify
  },
  props: {
    state: {
      type: Object,
      default: () => {
        return {
          username: '',
          username_valid: false,
          password: '',
          password_valid: false,
          showAlert: false,
          errorMeg: ''
        }
      }
    }
  },
  data () {
    return {
      imgUrl: require('../assets/startpage.png'),
      logoUrl: require('../assets/logo.png'),
      LogStatus: '登录',
      identity: '用户',
      loginForm: {
        username: '',
        password: '',
        confirmPassword: '',
        rememberMe: false,
        code: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' },
          { min: 1, max: 20, message: '用户名最大长度为20', trigger: 'blur' },
          { validator: this.usernameValidator }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          {
            pattern: /^[A-Za-z0-9_]*$/,
            message: '密码应由字母、数字及下划线组成',
            trigger: 'blur'
          },
          { min: 5, max: 20, message: '密码长度应为5-20位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', message: '请再次确认密码' },
          { validator: this.confirmPasswordValidator }
        ],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      alertDialog: {
        text: '',
        dialogVisible: false
      },
      customer_name: {
        type: String,
        default: () => '游客'
      },
      money: {
        type: Number,
        default: () => 0
      },
      userToken: {
        type: String,
        default: () => ''
      },
      merchantToken: {
        type: String,
        default: () => ''
      }
    }
  },
  mounted () {
    // localStorage.clear()
    // sessionStorage.clear()
  },
  methods: {
    ...mapMutations(['changeLogin']),
    usernameValidator (rule, name, callback) { // 还有问题
      if (!/^[A-Za-z\u4e00-\u9fa5][-A-Za-z0-9\u4e00-\u9fa5_]*$/.test(name)) {
        var meg = '用户名应以英文字母或中文开头'
        callback(meg)
      }
      callback()
    },
    confirmPasswordValidator (rule, name, callback) {
      if (this.loginForm.password !== this.loginForm.confirmPassword) {
        var meg = '两次密码输入不一致'
        callback(meg)
      }
      callback()
    },
    Log () {
      this.$refs.loginForm.resetFields()
      this.state.showAlert = false
      this.LogStatus = '登录'
    },
    Reg () {
      this.$refs.loginForm.resetFields()
      this.state.showAlert = false
      this.LogStatus = '注册'
    },
    alertClose () {
      this.state.showAlert = false
    },
    go () {
      // console.log(this.encode(this.loginForm.username))
      var meg
      this.$refs.loginForm.validate((valid, _meg) => {
        this.state.showAlert = !valid
        meg = _meg
      })
      if (!this.state.showAlert) {
        if (this.LogStatus === '登录') {
          if (this.identity === '用户') this.login()
          if (this.identity === '商家') this.merchantLogin()
        }
        if (this.LogStatus === '注册') this.signup()
      } else {
        this.state.errorMeg = Object.values(Object.values(meg)[0])[0].message
        console.log(Object.values(Object.values(meg)[0])[0].message)
        // console.log(meg.value[0].elements[0].message)
      }
    },
    signup () {
      axios.post('api/signup/', {
        username: this.loginForm.username,
        password: this.encode(this.loginForm.password)
      }).then(res => {
        if (res.data.code === 201) {
          this.alertDialog.text = '注册成功，系统赠送你10,000元余额'
          this.$refs.loginForm.resetFields()
          this.LogStatus = '登录'
        }
      }).catch(error => {
        console.log(error.response.status)
        if (error.response.status === 300) {
          this.alertDialog.text = '用户名已存在'
        } else {
          this.alertDialog.text = '注册失败'
        }
      })
      this.alertDialog.dialogVisible = true
    },
    login () {
      // axios.get('https://octs-backend-justdebugit.app.secoder.net/')
      //   .then(response => (console.log(response)))
      axios.post('api/login/', {
        username: this.loginForm.username,
        password: this.encode(this.loginForm.password)
      }).then(res => {
        console.log(res.data.name)
        if (res.data.code === 201) {
          this.alertDialog.text = '登录成功！'
          this.userToken = res.data.token
          this.customer_name = res.data.name
          this.money = res.data.money
          // 用户名、余额、token保存到localStorage中
          localStorage.setItem('name', this.customer_name)
          localStorage.setItem('money', this.money)
          localStorage.setItem('userToken', this.userToken)
          // 页面跳转
          this.$router.push({ name: 'Customer', path: '/' })
        }
      }).catch(error => {
        console.log(error.response.status)
        if (error.response.status === 400) {
          this.alertDialog.text = '用户不存在'
        } else if (error.response.status === 401) {
          this.alertDialog.text = '密码错误'
        } else {
          this.alertDialog.text = '非法操作'
        }
        this.alertDialog.dialogVisible = true
      })
      // this.alertDialog.dialogVisible = true //wait for fix
    },
    user () {
      this.$refs.loginForm.resetFields()
      this.state.showAlert = false
      this.identity = '用户'
    },
    merchant () {
      this.$refs.loginForm.resetFields()
      this.state.showAlert = false
      this.LogStatus = '登录'
      this.identity = '商家'
      // this.$router.push('/merchant')
    },
    merchantLogin () {
      axios.post('api/merchantlogin/', {
        name: 'merchant',
        // password: this.encode(this.loginForm.password)
        password: this.loginForm.password
      }).then(res => {
        // return JsonResponse({'code':201, 'data':"login successfully",'token': s , 'income': user.income, 'name':user.name})
        console.log(res.data.name)
        if (res.data.code === 201) {
          this.alertDialog.text = '登录成功！'
          this.merchantToken = res.data.token
          // localStorage.setItem('income', res.data.income)
          localStorage.setItem('merchantToken', this.merchantToken)
          // 页面跳转
          this.$router.push({ name: 'Merchant', path: '/merchant' })
        }
      }).catch(error => {
        console.log(error.response.status)
        if (error.response.status === 400) {
          this.alertDialog.text = '用户不存在'
        } else if (error.response.status === 401) {
          this.alertDialog.text = '密码错误'
        } else {
          this.alertDialog.text = '非法操作'
        }
        this.alertDialog.dialogVisible = true
      })
    },
    encode (str) {
      return md5(str)
    }
    // statusChange () {
    //   console.log(1)
    //   this.$refs.loginForm.resetFields()
    //   this.state.showAlert = false
    // }
  }
}
</script>

<style scoped>
.el-menu {
  padding-left: 20px;
}
.el-footer {
  background-color: #ee7947;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #ffffff;
  color: #333;
  height: 660px;
}
.el-card {
  height: 400px;
}
</style>
