import React from 'react'
import { Input , Radio} from 'antd'
import formMap from '@/components/Form/map'
const { Name } = formMap

export default {
    Name,
    Avatar:{
        element:<Input type="hidden" />,
        hasFeedback:false
    },
    Gender:{
        hasFeedback:false,
        element:<Radio.Group>
                    <Radio value={0}>保密</Radio>
                    <Radio value={1}>先生</Radio>
                    <Radio value={2}>女士</Radio>
                </Radio.Group>
    },
    Address:{
        props: {
            id: 'address'
        }
    },
    Profession:{
        props: {
            id: 'profession'
        }
    },
    Description: {
        props: {
            id: 'description'
        },
        rules:[
            {
                min:1,
                max:200,
                message:`一句话介绍长度为1-200个字符`
            }
        ]
    },
    Introduction: {
        elementType:"textarea",
        props: {
            id: 'introduction',
            autoSize:{minRows: 4, maxRows: 8},
        }
    }
}
