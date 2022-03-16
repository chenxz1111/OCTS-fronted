<template>
<div>
  <el-menu default-active="3" class="el-menu-demo" mode="horizontal" active-text-color="#EE7947">
      <el-col :offset="0" :span="3">
              <el-image
                :fit="'fill'"
                :src="require('../assets/logo.png')"
                style="margin: 2px"
                @click="$router.push('/merchant')"
              />
            </el-col>
  <el-menu-item index="1" @click="allitemlist()" >商品列表</el-menu-item>
  <el-menu-item index="2" @click="orderlist()">订单列表</el-menu-item>
  <el-menu-item index="3" >草稿箱</el-menu-item>
  <el-menu-item index="4" style="float:right" @click="waybackHome()"><font color=#EE7947><strong>返回登录</strong></font></el-menu-item>
  <div style="float:right; margin:15px">
     <el-tag effect='plain' type='warning'><i class="el-icon-coin"></i>￥{{this.income}}</el-tag>
  </div>
</el-menu>
<el-row style="height: 10px"></el-row>
<el-row style="height: 200px" v-for="i in now_list" :key="i">
<item @showdialog='edit(i)' @statechange='stateChange(i)' :title="i.title" :now_price="i.now_price" :old_price="i.old_price" :sell="i.sell"
  :available="i.available" :store="i.store" :introduction="i.introduction" :pictures='i.pictures' :id='i.id'
  />
</el-row>

<editDialog v-bind:dialogVisible="this.editdialogVisible" :draft_status='true'
:title.sync="this.edititem.title" :old_price.sync="this.edititem.old_price" :now_price.sync="this.edititem.now_price"
:introduction.sync="this.edititem.introduction" :store.sync="this.edititem.store" :picturelist.sync="this.edititem.pictures"/>
<el-pagination
  background
  layout="prev, pager, next"
  :total="total_page"
  @current-change="currentChange">
</el-pagination>
</div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import item from '@/components/draft'
import editDialog from '@/components/editDialog'
// import createDialog from '@/components/createDialog'
export default {
  name: 'MerchantDraft',
  components: {
    item,
    editDialog
    // createDialog
  },
  data () {
    return {
      now_edit_item: item,
      editdialogVisible: false,
      token: '',
      income: 0,
      itemlist: [],
      edititem: {
        id: -1,
        title: '山水画卷图',
        now_price: 99.99,
        old_price: 199.99,
        sell: 0,
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
        sell: 0,
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
    axios.get('api/drafts/').then(res => {
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
          pictures: res.data.data[i].pictures
        })
      }
    })
  },
  methods: {
    currentChange (val) {
      this.now_page = val
    },
    allitemlist () {
      this.$router.push('/merchant')
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
        // console.log(url)
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
    edit_confirm (newlist, deletestr) {
      //  upload to backenxd
      var formdata = new FormData()
      formdata.append('id', this.edititem.id)
      formdata.append('title', this.edititem.title)
      formdata.append('now_price', this.edititem.now_price)
      formdata.append('old_price', this.edititem.old_price)
      formdata.append('available', this.edititem.available)
      formdata.append('sell', 0)
      formdata.append('store', this.edititem.store)
      formdata.append('introduction', this.edititem.introduction)
      for (let i = 0; i < newlist.length; i++) {
        formdata.append('pictures', newlist[i].raw)
      }
      formdata.append('delete', deletestr)
      axios.post('api/commit/', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        // console.log(res)
      })
      this.editdialogVisible = false
      location.reload()
    },
    draft_confirm (newlist, deletestr) {
      //  upload to backenxd
      var formdata = new FormData()
      formdata.append('id', this.edititem.id)
      formdata.append('title', this.edititem.title)
      formdata.append('now_price', this.edititem.now_price)
      formdata.append('old_price', this.edititem.old_price)
      formdata.append('available', this.edititem.available)
      formdata.append('sell', 0)
      formdata.append('store', this.edititem.store)
      formdata.append('introduction', this.edititem.introduction)
      for (let i = 0; i < newlist.length; i++) {
        formdata.append('pictures', newlist[i].raw)
      }
      formdata.append('delete', deletestr)
      // console.log(formdata)
      axios.post('api/draftedit/', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        // console.log(res)
      })
      location.reload()
      // this.editdialogVisible = true
    },
    edit_cancel () {
      this.editdialogVisible = false
    },
    waybackHome () {
      sessionStorage.clear()
      localStorage.clear()
      this.$router.push('/login')
    },
    orderlist () {
      this.$router.push('/orderlistmerchant')
    },
    create_draft (tl, op, np, itrn, st, pl) {
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
        // console.log(res)
      })
      this.createdialogVisible = false
      location.reload()
    },
    // create_cancel () {
    //   this.createdialogVisible = false
    // },
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
      // console.log(imgtype)
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

</style>
