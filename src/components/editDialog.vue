<template>
<div>
<el-dialog
  title="商品信息"
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
    <el-button type="info" @click="modify()" v-if="this.draft_status === true">保存草稿</el-button>
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
    },
    title: {
      type: String,
      default: () => ''
    },
    old_price: {
      type: Number,
      default: () => ''
    },
    now_price: {
      type: Number,
      default: () => ''
    },
    introduction: {
      type: String,
      default: () => ''
    },
    store: {
      type: Number,
      default: () => ''
    },
    picturelist: {
      type: Array,
      default: () => []
    },
    draft_status: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      newpiclist: [],
      delete: ''
    }
  },
  methods: {
    confirm () {
      if (this.old_price > 0) {
        if (this.now_price > 0) {
          if (this.store > 0 && Math.ceil(this.store) - this.store === 0) {
            const npl = this.newpiclist
            const del = this.delete
            this.newpiclist = []
            this.delete = ''
            this.$parent.edit_confirm(npl, del)
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
      this.newpiclist = []
      this.delete = ''
      this.$parent.edit_cancel()
    },
    modify () {
      localStorage.clear()
      this.$message('编辑信息已保存')
      if (this.draft_status === false) {
        const t = this.title
        const o = this.old_price
        const n = this.now_price
        const i = this.introduction
        const s = this.store
        const p = this.picturelist
        this.$parent.create_draft(t, o, n, i, s, p)
      } else {
        const npl = this.newpiclist
        const del = this.delete
        this.newpiclist = []
        this.delete = ''
        this.$parent.draft_confirm(npl, del)
      }
    },
    handleChange (file) {
      this.picturelist.push(file)
      this.newpiclist.push(file)
    },
    handleRemove (file) {
      this.picturelist.splice(this.picturelist.indexOf(file), 1)
      this.delete += file.url
      this.delete += '\n'
    }
  },
  watch: {
    title: {
      handler (newVar) {
        this.$parent.change_title(newVar)
      }
    },
    old_price: {
      handler (newVar) {
        this.$parent.change_op(newVar)
      }
    },
    now_price: {
      handler (newVar) {
        this.$parent.change_np(newVar)
      }
    },
    introduction: {
      handler (newVar) {
        this.$parent.change_intro(newVar)
      }
    },
    store: {
      handler (newVar) {
        this.$parent.change_st(newVar)
      }
    }
  }
}
</script>

<style>
.el-upload-list__item {
  transition: none !important;
}
</style>
