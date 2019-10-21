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
  Mobile: {
    props: {
      size: 'large',
      placeholder: '手机号码',
    },
    rules: [
      {
        required: true,
        message: '请输入手机号',
      },
      {
          pattern:/^1(3|4|5|7|8)\d{9}$/,
          message:'手机号码格式不正确'
      }
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      placeholder: '验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入短信验证码',
      }
    ],
  },
}
