import React from 'react'
import { Icon } from 'antd';
import classNames from 'classnames'
import styles from './index.less';

const NAME_LENGTH_MIN = 2
const NAME_LENGTH_MAX = 60

const PASSWORD_LENGTH_MIN = 6
const PASSWORD_LENGTH_MAX = 20
const PASSWORD_REGEX = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[~`!@#$%^&*()\\_+\-={}\[\]|'";:,./<>?])+$)([^(0-9a-zA-Z)]|[~`!@#$%^&*()\\_+\-={}\[\]|'";:,./<>?]|[a-z]|[A-Z]|[0-9])+$/

export default {
    Name: {
        props: {
            size: 'large',
            placeholder:"昵称"
        },
        rules: [
            {
                required: true,
                message: '请输入昵称',
            },
            {
                min:NAME_LENGTH_MIN,
                max:NAME_LENGTH_MAX,
                message:`昵称长度为${NAME_LENGTH_MIN}-${NAME_LENGTH_MAX}个字符`
            },
            {
                ansyVaildate:true
            }
        ],
    },
    Password: {
        props: {
            size: 'large',
            type: 'password',
            placeholder: '密码',
        },
        tips:{
            show:'onFocus',
            hide:'onBlur',
            getContent:(value)=>{
                let spaceError = false
                if(value && value.match(/\s+/)){
                    spaceError = true
                }
        
                let lengthError = true
                if(value && value.length >= PASSWORD_LENGTH_MIN && value.length <= PASSWORD_LENGTH_MAX){
                    lengthError = false
                }
        
                let typeError = true
                if(value && value.match(PASSWORD_REGEX)){
                    typeError = false
                }

                const getTip = (type,message) => {
                    return <p><Icon type={type ? "exclamation-circle" : "check-circle" } theme="filled" className={type ? styles.icon : classNames(styles.icon,styles.correct)} />{ message }</p>
                        
                }
                return (
                    <div className={styles.passwordTips}>
                        { getTip(spaceError,"不能包括空格") }
                        { getTip(lengthError,`长度为${PASSWORD_LENGTH_MIN}-${PASSWORD_LENGTH_MAX}个字符`) }
                        { getTip(typeError,"必须包含字母、数字、符号中至少2种") }
                    </div>
                )
            }
        },
        rules: [
            {
                required: true,
                message: '请输入登录密码',
            },
            {
                validator:(rule, value, callback) => {
                    if(value && value.match(/\s+/))
                    {
                        callback("不能包括空格")
                        return
                    }
                    callback()
                }
            },{
                min:PASSWORD_LENGTH_MIN,
                max:PASSWORD_LENGTH_MAX,
                message:`长度为${PASSWORD_LENGTH_MIN}-${PASSWORD_LENGTH_MAX}个字符`
            },{
                pattern:PASSWORD_REGEX,
                message:'必须包含字母、数字、符号中至少2种'
            }
        ]
    },
    Mobile: {
        props: {
            size: 'large',
            placeholder: '手机号码',
        },
        rules: [
            {
                required: true,
                message: '请输入手机号',
            },
            {
                pattern:/^1(3|4|5|7|8)\d{9}$/,
                message:'手机号码格式不正确'
            }
        ],
    },
    Email: {
        props: {
            size: 'large',
            placeholder: '邮箱',
        },
        rules: [
            {
                required: true,
                message: '请输入邮箱',
            },
            {
                pattern:/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
                message:'邮箱格式不正确'
            }
        ],
    },
    Captcha: {
        props: {
            size: 'large',
            placeholder: '验证码',
        },
        rules: [
            {
                required: true,
                message: '请输入验证码',
            }
        ],
    },
}