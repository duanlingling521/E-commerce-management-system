<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格站位 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        index-text="#"
        border
        :show-row-hover="false"
        show-index
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_delated===false" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->

    <el-dialog title="添加分类" @close="addCatedialogClosed" :visible.sync="addCatedialogVisible" width="50%">
      <!-- 添加分类表单 -->
      <el-form
        :model="AddCateForm"
        :rules="AddCateFormRules"
        ref="AddCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="AddCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
            <!-- option用来指定数据源 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props=" cascaderProps "
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      //   查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catelist: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //   表示将当前列定义为模板列
          type: 'template',
          //   表是当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //   表示将当前列定义为模板列
          type: 'template',
          //   表是当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          //   表示将当前列定义为模板列
          type: 'template',
          //   表是当前这一列使用模板名称
          template: 'opt'
        }
      ],
      addCatedialogVisible: false,
      //   添加分类表单数据对象
      AddCateForm: {},
      cat_name: '',
      //    负极分类id
      cat_pid: 0,
      //    分类等级默认1类
      cat_level: 0,
      AddCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 负极分类的列表
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    //   获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      //   console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      console.log(res.data)
      this.catelist = res.data.result
      console.log(this.catelist)
      this.total = res.data.total
      //   console.log(this.total);
    },
    // 监听pagesize改变时间
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变时间
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },

    showAddCateDialog () {
      this.getParentCateList()
      this.addCatedialogVisible = true
    },
    // 获取父极分类数组
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父极分类数据失败')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    parentCateChange () {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        this.AddCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]

        this.AddCateForm.cat_level = this.selectedKeys.length
      } else {
        this.AddCateForm.cat_pid = 0
        this.AddCateForm.cat_level = 0
      }
    },
    addCate () {
      // console.log(this.AddCateForm)
      this.$refs.AddCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.AddCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCatedialogVisible = false
      })
    },
    addCatedialogClosed () {
      this.$refs.AddCateFormRef.resetFields()
      this.selectedKeys = []
      // this.parentCateList=[]
      this.AddCateForm.cat_level = 0
      this.AddCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>
