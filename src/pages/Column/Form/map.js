
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
                min:1,
                max:30,
                message:'长度为1-30个字符'
            },
            {
                pattern:/^[\u4e00-\u9fa5_A-Za-z0-9-\.#&@]*$/,
                message:'专栏名称只支持中英文、数字、_、-、.、#、&、@'
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
            autosize:{minRows: 4, maxRows: 8},
            placeholder: '申请理由，不超过 200 字',
        }
        ,
        rules: [
            {
                required: true,
                message: '请补充申请理由',
            },
        ],
    }
}
