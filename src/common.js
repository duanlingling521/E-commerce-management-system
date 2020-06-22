// 用户名验证
export const nameValid = [
  { required: true, message: '请输入用户名', trigger: 'blur' },
  { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
]
// 密码验证
export const passwordValid = [
  { required: true, message: '请输入密码', trigger: 'blur' },
  { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
]
// 分类表单名称验证
export const catNameValid = [
  { required: true, message: '请输入分类名称', trigger: 'blur' }
]
// 分类参数验证
export const catPropValid = [
  { required: true, message: '请输入分类参数', trigger: 'blur' }
]
// 邮箱验证(自定义)
export const emailValid = [
  { required: true, message: '请输入邮箱', trigger: 'blur' },
  {
    validator: (rule, value, callback) => {
    // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    },
    trigger: 'blur'
  }
]
// 手机号验证(自定义)
export const mobileValid = [
  { required: true, message: '请输入手机号', trigger: 'blur' },
  {
    validator: (rule, value, callback) => {
    // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    },
    trigger: 'blur'
  }
]
