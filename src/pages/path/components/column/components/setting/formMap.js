import React from 'react'
import { Input } from 'antd'
import formMap from '@/pages/column/apply/formMap'
const { Name , Desc } = formMap

export default {
    Name,
    Avatar:{
        element:<Input type="hidden" />,
        hasFeedback:false
    },
    Desc,
    Path:{
        props:{
            addonBefore:"http://www.itellyou.com/"
        },
        rules: [
            {
                required: true,
                message: '路径不能为空',
            },
            {
                min:4,
                max:50,
                message:`路径最少4个字符`
            },
            {
                pattern:/^[a-zA-Z0-9_.]{4,50}$/,
                message:'仅支持字母，数字，下划线，点，且不少于4位'
            },
            {
                ansyVaildate:true
            }
        ],
    }
}
