<template>
<div>
  <el-head>
  <el-menu default-active="1" class="el-menu-demo" mode="horizontal" active-text-color="#EE7947">
  <el-col :offset="0" :span="3">
              <el-image
                :fit="'fill'"
                :src="require('../assets/logo.png')"
                style="margin: 2px"
                @click="backpg1"
              />
            </el-col>
  <el-menu-item index="1" >商品列表</el-menu-item>
  <el-menu-item index="2" @click="orderlist()">订单列表</el-menu-item>
  <el-menu-item index="3" @click="draftlist()">草稿箱</el-menu-item>
  <el-menu-item index="4" @click="create()">上新</el-menu-item>
  <el-menu-item index="5" style="float:right" @click="waybackHome()"><font color=#EE7947><strong>返回登录</strong></font></el-menu-item>
  <div style="float:right; margin:15px">
    <el-tag effect='plain' type='warning'><i class="el-icon-coin"></i>￥{{this.income}}</el-tag>
  </div>
</el-menu>
  </el-head>
<el-row style="height: 10px"></el-row>
<el-row style="height: 200px" v-for="i in now_list" :key="i">
<item @showdialog='edit(i)' @statechange='stateChange(i)' @showpp='pp(i)' :title="i.title" :now_price="i.now_price" :old_price="i.old_price" :sell="i.sell"
  :available="i.available" :store="i.store" :introduction="i.introduction" :pictures='i.pictures' :id='i.id' :ppprice='i.ppprice' :ddl='i.ddl'
  />
</el-row>

    <editDialog
      :introduction.sync="this.edititem.introduction"
      :now_price.sync="this.edititem.now_price"
      :old_price.sync="this.edititem.old_price"
      :picturelist.sync="this.edititem.pictures"
      :store.sync="this.edititem.store"
      :title.sync="this.edititem.title"
      v-bind:dialogVisible="this.editdialogVisible"
    />
    <createDialog v-bind:dialogVisible="this.createdialogVisible" />
    <ppDialog v-bind:dialogVisible="this.ppdialogVisible" :id="this.ppid" :available="this.ppav"/>
    <el-pagination
      :total="total_page"
      @current-change="currentChange"
      background
      layout="prev, pager, next"
    ></el-pagination>
    <el-row style="height: 20px"></el-row>
    <el-footer>@JDI2021SE</el-footer>
  </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import item from '@/components/item'
import editDialog from '@/components/editDialog'
import createDialog from '@/components/createDialog'
import ppDialog from '@/components/ppDialog'
export default {
  name: 'Merchant',
  components: {
    item,
    editDialog,
    createDialog,
    ppDialog
  },
  data () {
    return {
      now_edit_item: item,
      createdialogVisible: false,
      editdialogVisible: false,
      ppdialogVisible: false,
      ppid: -1,
      ppav: false,
      token: '',
      income: 0,
      itemlist: [],
      edititem: {
        id: -1,
        title: '山水画卷图',
        now_price: 99.99,
        old_price: 199.99,
        sell: 9999,
        available: true,
        store: 9999,
        introduction: '山水画卷图就是一幅画。',
        pictures: []
      },
      newitem: {
        id: -1,
        title: '山水画卷图',
        now_price: 99.99,
        old_price: 199.99,
        sell: 9999,
        available: true,
        store: 9999,
        introduction: '山水画卷图就是一幅画。',
        pictures: []
      },
      now_page: 1
    }
  },
  mounted () {
    this.token = localStorage.getItem('merchantToken')
    console.log(this.token)
    axios.post('api/display_money/', {
      role: 'merchant',
      name: 'merchant',
      token: this.token
    }).then(res => {
      // console.log(res.data)
      this.income = res.data.data.toFixed(2)
    }).catch(error => {
      console.log(error.response.status)
    })
    axios.get('api/list/').then(res => {
      this.itemlist.length = 0
      for (let i = 0; i < res.data.data.length; i++) {
        this.itemlist.unshift({
          id: res.data.data[i].id,
          title: res.data.data[i].title,
          now_price: res.data.data[i].now_price,
          old_price: res.data.data[i].old_price,
          sell: res.data.data[i].sell,
          available: res.data.data[i].available,
          store: res.data.data[i].store,
          introduction: res.data.data[i].introduction,
          pictures: res.data.data[i].pictures,
          ppprice: res.data.data[i].ppprice,
          ddl: res.data.data[i].ddl
        })
        // console.log(this.itemlist[0].pictures)
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
    pp (i) {
      this.ppdialogVisible = true
      this.ppid = i.id
      this.ppav = i.available
    },
    edit (i) {
      this.now_edit_item = i
      this.edititem.id = i.id
      this.edititem.title = i.title
      this.edititem.now_price = i.now_price
      this.edititem.available = i.available
      this.edititem.old_price = i.old_price
      this.edititem.introduction = i.introduction
      this.edititem.sell = i.sell
      this.edititem.store = i.store
      this.edititem.pictures = []
      for (let j = 0; j < i.pictures.length; j++) {
        const url = 'api' + i.pictures[j]
        console.log(url)
        this.getBase64(url).then((base64) => {
          const fileraw = new File([this.convertBase64ToBlob(base64)], 'anonymous.jpg', { type: 'img/png' })
          //  picFile.type = 'image/jpeg'
          var picFile = {}
          picFile.name = fileraw.name
          picFile.percentage = 0
          picFile.raw = fileraw
          picFile.size = fileraw.size
          picFile.status = 'ready'
          picFile.uid = fileraw.uid
          picFile.url = url
          this.edititem.pictures.push(picFile)
        })
      }
      this.editdialogVisible = true
      // console.log(this.edititem.pictures)
    },
    pp_confirm (ppid, ppprice, ppdate) {
      axios.post('api/pp/', {
        id: ppid,
        price: ppprice,
        date: ppdate
      }).then(res => {
        console.log(res)
      })
      this.ppdialogVisible = false
      location.reload()
    },
    pp_cancel () {
      this.ppdialogVisible = false
    },
    edit_confirm (newlist, deletestr) {
      //  upload to backenxd
      var formdata = new FormData()
      formdata.append('id', this.edititem.id)
      formdata.append('title', this.edititem.title)
      formdata.append('now_price', this.edititem.now_price)
      formdata.append('old_price', this.edititem.old_price)
      formdata.append('available', this.edititem.available)
      formdata.append('sell', this.edititem.sell)
      formdata.append('store', this.edititem.store)
      formdata.append('introduction', this.edititem.introduction)
      for (let i = 0; i < newlist.length; i++) {
        formdata.append('pictures', newlist[i].raw)
      }
      formdata.append('delete', deletestr)
      axios.post('api/modify/', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res)
      })
      this.editdialogVisible = false
      location.reload()
    },
    edit_cancel () {
      this.editdialogVisible = false
    },
    stateChange (i) {
      axios.post('api/status/', {
        id: i.id
      })
      if (i.available) {
        i.available = false
      } else {
        i.available = true
      }
    },
    create () {
      this.createdialogVisible = true
    },
    orderlist () {
      this.$router.push('/orderlistmerchant')
    },
    draftlist () {
      this.$router.push('/merchantdraft')
    },
    create_confirm (tl, op, np, itrn, st, pl) {
      // console.log(pl[0])
      var formdata = new FormData()
      formdata.append('title', tl)
      formdata.append('now_price', np)
      formdata.append('old_price', op)
      formdata.append('sell', 0)
      formdata.append('store', st)
      formdata.append('introduction', itrn)
      for (let i = 0; i < pl.length; i++) {
        formdata.append('pictures', pl[i].raw)
      }
      axios.post('api/upload/', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res)
      })
      this.createdialogVisible = false
      location.reload()
      //  this.$router.go(0)
      // axios.get('https://octs-backend-justdebugit.app.secoder.net/list/').then(res => {
      //   this.itemlist.length = 0
      //   for (let i = 0; i < res.data.data.length; i++) {
      //     console.log(res.data.data[i].title)
      //     this.itemlist.unshift({
      //       id: res.data.data[i].id,
      //       title: res.data.data[i].title,
      //       now_price: res.data.data[i].now_price,
      //       old_price: res.data.data[i].old_price,
      //       sell: res.data.data[i].sell,
      //       available: res.data.data[i].available,
      //       store: res.data.data[i].store,
      //       introduction: res.data.data[i].introduction,
      //       pictures: res.data.data[i].pictures
      //     })
      //   }
      // })
    },
    create_draft (tl, op, np, itrn, st, pl) {
      this.editdialogVisible = false
      var formdata = new FormData()
      formdata.append('title', tl)
      formdata.append('now_price', np)
      formdata.append('old_price', op)
      formdata.append('sell', 0)
      formdata.append('store', st)
      formdata.append('introduction', itrn)
      for (let i = 0; i < pl.length; i++) {
        formdata.append('pictures', pl[i].raw)
      }
      axios.post('api/save/', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res)
      })
    },
    create_cancel () {
      this.createdialogVisible = false
    },
    change_title (newtitle) {
      this.edititem.title = newtitle
    },
    change_op (newop) {
      this.edititem.old_price = newop
    },
    change_np (newnp) {
      this.edititem.now_price = newnp
    },
    change_intro (newintro) {
      this.edititem.introduction = newintro
    },
    change_st (newst) {
      this.edititem.store = newst
    },
    waybackHome () {
      sessionStorage.clear()
      localStorage.removeItem('merchantToken')
      this.$router.push('/login')
    },
    getBase64 (img) {
      const picImage = new Image(200, 200)
      const deferred = $.Deferred()
      var that = this
      if (img) {
        picImage.onload = function () {
          deferred.resolve(that.getBase64Image(picImage)) // 将base64传给done上传处理
        }
        picImage.src = img
        return deferred.promise() // 要让onload完成后再return sessionStorage['imgTest']
      }
    },
    getBase64Image (img) {
      img.setAttribute('crossOrigin', 'Anonymous')
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataURL = canvas.toDataURL()
      return dataURL
    },
    convertBase64ToBlob (base64) {
      var base64Arr = base64.split(',')
      var imgtype = ''
      var base64String = ''
      if (base64Arr.length > 1) {
        // 如果是图片base64，去掉头信息
        base64String = base64Arr[1]
        imgtype = base64Arr[0].substring(base64Arr[0].indexOf(':') + 1, base64Arr[0].indexOf(';'))
      }
      // 将base64解码，atob() 方法用于解码使用 base-64 编码的字符串。
      var bytes = atob(base64String)
      var bytesCode = new ArrayBuffer(bytes.length)
      // 转换为类型化数组
      var byteArray = new Uint8Array(bytesCode)
      // 将base64转换为ascii码
      for (var i = 0; i < bytes.length; i++) {
        byteArray[i] = bytes.charCodeAt(i)
      }
      console.log(imgtype)
      // 生成Blob对象（文件对象）
      return new Blob([bytesCode], { type: imgtype })
    }
  },
  computed: {
    now_list: function () {
      if (this.now_page * 10 >= this.itemlist.length) {
        return this.itemlist.slice((this.now_page - 1) * 10)
      } else {
        return this.itemlist.slice((this.now_page - 1) * 10, this.now_page * 10)
      }
    },
    total_page: function () {
      return Math.ceil(this.itemlist.length / 10) * 10
    }
  }
}
</script>

<style>
.el-footer {
  background-color: #ee7947;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 60px;
}
</style>
