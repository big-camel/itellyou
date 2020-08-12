import { Input } from 'antd';

export default {
    Logo: {
        props: {
            type: 'hidden',
        },
    },
    Name: {
        props: {
            size: 'large',
            placeholder: '名称',
        },
        rules: [
            {
                required: true,
                message: '请输入名称',
            },
        ],
    },
    Desc: {
        component: Input.TextArea,
        props: {
            autoSize: { minRows: 3, maxRows: 6 },
            maxLength: 200,
        },
    },
};
