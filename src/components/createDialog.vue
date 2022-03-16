<template>
<div>
<el-dialog
  title="新商品信息"
  :visible.sync="dialogVisible"
  width="40%"
  :showClose="false"
  >
  <el-form label-position="left" >
    <el-form-item label="标题">
        <el-input style="width:280px" v-model="title">
          {{ title }}
        </el-input>
    </el-form-item>
    <el-form-item label="原价">
        <el-input style="width:280px" v-model="old_price">
          {{ old_price }}
        </el-input>
    </el-form-item>
    <el-form-item label="现价">
        <el-input style="width:280px" v-model="now_price">
          {{ now_price }}
        </el-input>
    </el-form-item>
    <el-form-item label="简介">
        <el-input type="textarea" style="width:280px" v-model="introduction">
          {{ introduction }}
        </el-input>
    </el-form-item>
    <el-form-item label="图片" prop="file" >
        <el-upload
            class="upload-import"
            ref="uploadImport"
            action="#"
            list-type="picture-card"
            :on-remove="handleRemove"
            :file-list="picturelist"
            :limit="10"
            :on-change="handleChange"
            :auto-upload="false"
            accept="image/jpeg,image/jpg,image/png">
            <i slot="default" class="el-icon-plus"></i>
          <!-- <el-button v-show="!hasFile" slot="trigger" size="small" type="primary" ></el-button>
          <el-button v-show="hasFile"  size="small" type="primary" disabled>选取图片</el-button> -->
          <div slot="tip" class="el-upload__tip"><font color=red>* </font>   第一张图片为头图 </div>
        </el-upload>
      </el-form-item>
    <el-form-item label="库存">
        <el-input style="width:280px" v-model="store">
          {{ store }}
        </el-input>
    </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="confirm()">确定</el-button>
    <el-button type="info" @click="save()">保存草稿</el-button>
    <el-button @click="cancel()">取消</el-button>
  </el-form-item>
</el-form>
</el-dialog>
</div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      title: localStorage.getItem('title'),
      old_price: localStorage.getItem('old_price'),
      now_price: localStorage.getItem('now_price'),
      introduction: localStorage.getItem('introduction'),
      store: localStorage.getItem('store'),
      picturelist: []
    }
  },
  methods: {
    confirm () {
      if (this.old_price > 0) {
        if (this.now_price > 0) {
          if (this.store > 0 && Math.ceil(this.store) - this.store === 0) {
            const t = this.title
            const o = this.old_price
            const n = this.now_price
            const i = this.introduction
            const s = this.store
            const p = this.picturelist
            this.title = ''
            this.old_price = ''
            this.now_price = ''
            this.introduction = ''
            this.store = ''
            this.picturelist = []
            localStorage.setItem('title', '')
            localStorage.setItem('old_price', '')
            localStorage.setItem('now_price', '')
            localStorage.setItem('introduction', '')
            localStorage.setItem('store', '')
            this.$parent.create_confirm(t, o, n, i, s, p)
          } else {
            alert('库存必须输入大于零的整数')
          }
        } else {
          alert('现价必须输入不小于零的数字')
        }
      } else {
        alert('原价必须输入不小于零的数字')
      }
    },
    cancel () {
      this.title = ''
      this.old_price = ''
      this.now_price = ''
      this.introduction = ''
      this.store = ''
      this.picturelist = []
      this.$parent.create_cancel()
    },
    save () {
      localStorage.clear()
      localStorage.setItem('title', this.title)
      localStorage.setItem('old_price', this.old_price)
      localStorage.setItem('now_price', this.now_price)
      localStorage.setItem('introduction', this.introduction)
      localStorage.setItem('store', this.store)
      this.$message('编辑信息已保存')
      const t = this.title
      const o = this.old_price
      const n = this.now_price
      const i = this.introduction
      const s = this.store
      const p = this.picturelist
      this.$parent.create_draft(t, o, n, i, s, p)
    },
    handleChange (file) {
      this.picturelist.push(file)
    },
    handleRemove (file) {
      this.picturelist.splice(this.picturelist.indexOf(file), 1)
    }
  }
}
</script>
