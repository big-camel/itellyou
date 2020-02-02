import formMap from '@/components/Form/map'
const { Password } = formMap
export default {
    Password,
    ConfirmPassword:{
        props: {
            size: 'large',
            type: 'password',
            placeholder: '请再次输入新密码',
        },
        rules:[
            {
                required: true,
                message: '请再次输入新密码',
            }
        ]
    }
}
