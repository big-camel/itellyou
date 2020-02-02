import formMap from '@/components/Form/map'
const { Mobile , Captcha } = formMap

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'username',
      placeholder: '用户名 / 手机号 / 邮箱',
    },
    rules: [
      {
        required: true,
        message: '请输入用户名 或 手机号 或 邮箱',
      }
    ],
  },
  Password: {
    props: {
      size: 'large',
      type: 'password',
      id: 'password',
      placeholder: '密码',
    },
    rules: [
      {
        required: true,
        message: '请输入密码',
      }
    ],
  },
  Mobile,
  Captcha,
}
