
export default {
    Name: {
        props: {
            id: 'name',
            placeholder: '专栏名称',
        },
        rules: [
            {
                required: true,
                message: '专栏名称不可以为空',
            },
            {
                min:2,
                max:60,
                message:'长度为2-60个字符'
            },
            {
                ansyVaildate:true
            }
        ],
    },
    Desc: {
        elementType:"textarea",
        props: {
            id: 'desc',
            autoSize:{minRows: 4, maxRows: 8},
            maxLength:200,
            placeholder: '简介，不超过 200 字',
        },
        rules: [
            {
                required: true,
                message: '请输入简介，不超过 200 字',
            }
        ]
    }
}
