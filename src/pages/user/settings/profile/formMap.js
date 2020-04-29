import React from 'react';
import { Input, Radio } from 'antd';
import formMap from '@/components/Form/map';
const { Name } = formMap;

export default {
    Name,
    Avatar: {
        props: {
            type: 'hidden',
        },
    },
    Gender: {
        component: (
            <Radio.Group>
                <Radio value={0}>保密</Radio>
                <Radio value={1}>先生</Radio>
                <Radio value={2}>女士</Radio>
            </Radio.Group>
        ),
    },
    Address: {
        props: {
            id: 'address',
            size: 'large',
        },
    },
    Profession: {
        props: {
            id: 'profession',
            size: 'large',
        },
    },
    Description: {
        props: {
            id: 'description',
            size: 'large',
        },
        rules: [
            {
                min: 1,
                max: 200,
                message: `一句话介绍长度为1-200个字符`,
            },
        ],
    },
    Introduction: {
        component: Input.TextArea,
        props: {
            id: 'introduction',
            autoSize: { minRows: 4, maxRows: 8 },
        },
    },
};
