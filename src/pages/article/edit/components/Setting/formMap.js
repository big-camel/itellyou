import { Input } from 'antd';

export default {
    Cover: {
        props: {
            type: 'hidden',
        },
    },
    Desc: {
        component: Input.TextArea,
        props: {
            autoSize: { minRows: 3, maxRows: 6 },
            maxLength: 200,
        },
    },
};
