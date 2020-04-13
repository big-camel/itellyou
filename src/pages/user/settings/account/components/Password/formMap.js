import formMap from '@/components/Form/map';
import { Input } from 'antd';
const { Password } = formMap;
export default {
    Password,
    ConfirmPassword: {
        component: Input.Password,
        props: {
            size: 'large',
            type: 'password',
            placeholder: '请再次输入新密码',
        },
        rules: [
            {
                required: true,
                message: '请再次输入新密码',
            },
            ({ getFieldValue }) => ({
                validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject('两次密码输入不一致!');
                },
            }),
        ],
    },
};
