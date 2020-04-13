import { Input } from 'antd';
import { Selector } from '@/components/Tag';

export default {
    Name: {
        props: {
            placeholder: '专栏名称',
        },
        rules: [
            {
                required: true,
                message: '专栏名称不可以为空',
            },
            {
                min: 2,
                max: 60,
                message: '长度为2-60个字符',
            },
        ],
    },
    Tags: {
        component: Selector,
        props: {},
        rules: [
            {
                required: true,
                message: '请选择关联标签',
            },
        ],
    },
    Desc: {
        component: Input.TextArea,
        props: {
            autoSize: { minRows: 4, maxRows: 8 },
            maxLength: 200,
            placeholder: '专栏简介，不超过 200 字',
        },
        rules: [
            {
                required: true,
                message: '请输入简介，不超过 200 字',
            },
        ],
    },
};
