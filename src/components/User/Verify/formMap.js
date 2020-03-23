export default {
    Captcha: {
        props: {
        size: 'large',
            placeholder: '6位验证码',
        },
        rules: [
            {
                required: true,
                message: '请输入验证码',
            }
        ],
    }
}
