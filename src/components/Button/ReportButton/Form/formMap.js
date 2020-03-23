
export default {
    Desc: {
        elementType:"textarea",
        props: {
            id: 'desc',
            autoSize:{minRows: 5, maxRows: 20},
            maxLength:500,
            placeholder: '举报原因（字数不多于 500）',
        },
        rules: [
            {
                required: true,
                message: '请输入举报原因，（字数不多于 500）',
            }
        ]
    }
}
