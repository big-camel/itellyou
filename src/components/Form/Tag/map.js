import React from 'react';
import { Icon } from 'antd';
import classNames from 'classnames'
import styles from './index.less';

export default {
    TagName: {
        props: {
            id: 'tagName',
            placeholder: '标签名称',
        },
        rules: [
            {
                required: true,
                message: '标签名称不可以为空',
            },
            {
                min:1,
                max:32,
                message:'长度为1-32个字符'
            },
            {
                pattern:/^[\u4e00-\u9fa5_A-Za-z0-9-\.#&@]*$/,
                message:'昵称只支持中英文、数字、_、-、#、&、@'
            },
            {
                ansyVaildate:true
            }
        ],
    },
    TagDesc: {
        elementType:"textarea",
        props: {
            id: 'tagDesc',
            autosize:{minRows: 4, maxRows: 8},
            placeholder: '请对此标签补充一些描述资料, 以供他人参考',
        }
        ,
        rules: [
            {
                required: true,
                message: '请补充标签描述',
            },
        ],
    }
}
