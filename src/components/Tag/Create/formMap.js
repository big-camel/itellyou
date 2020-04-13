export default {
    TagName: {
        props: {
            placeholder: '标签名称',
        },
        rules: [
            {
                required: true,
                message: '标签名称不可以为空',
            },
            {
                min: 1,
                max: 32,
                message: '长度为1-32个字符',
            },
            {
                pattern: /^[\u4e00-\u9fa5_A-Za-z0-9-\.#&@]*$/,
                message: '名称只支持中英文、数字、_、-、#、&、@',
            },
        ],
    },
};
