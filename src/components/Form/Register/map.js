import React from 'react';
import { Icon } from 'antd';
import classNames from 'classnames'
import styles from './index.less';

export default {
  Nickname: {
    props: {
      size: 'large',
      id: 'nickname',
      placeholder: '昵称',
    },
    rules: [
      {
          required: true,
          message: '昵称不可以为空',
      },
      {
          min:2,
          max:18,
          message:'长度为2-18个字符'
      },
      {
          pattern:/^[\u4e00-\u9fa5A-Za-z0-9-_]*$/,
          message:'昵称只支持中英文、数字、_、-'
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
      id: 'password',
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
        if(value && value.length >= 6 && value.length <= 16){
            lengthError = false
        }
  
        let typeError = true
        if(value && value.match(/(?!^(\d+|[a-zA-Z]+|[~`!@#$%^&*()_+\-={}[\]\\|'";:,.\/<>?]+)$)^[\da-zA-Z~`!@#$%^&*()_+\-={}[\]\\|'";:,.\/<>?]+$/)){
            typeError = false
        }
        return (
          <div className={styles.passwordTips}>
              <p><Icon type={spaceError ? "exclamation-circle" : "check-circle" } theme="filled" className={spaceError ? styles.icon : classNames(styles.icon,styles.correct)} />不能包括空格</p>
              <p><Icon type={lengthError ? "exclamation-circle" : "check-circle" } theme="filled" className={lengthError ? styles.icon : classNames(styles.icon,styles.correct)} />长度为6-16个字符</p>
              <p><Icon type={typeError ? "exclamation-circle" : "check-circle" } theme="filled" className={typeError ? styles.icon : classNames(styles.icon,styles.correct)} />必须包含字母、数字、符号中至少2种</p>
          </div>
        )
      }
    }
    ,
    rules: [
      {
        required: true,
        message: '密码不可以为空',
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
          min:6,
          max:16,
          message:'长度为6-16个字符'
      },{
          pattern:/(?!^(\d+|[a-zA-Z]+|[~`!@#$%^&*()_+\-={}[\]\\|'";:,.\/<>?]+)$)^[\da-zA-Z~`!@#$%^&*()_+\-={}[\]\\|'";:,.\/<>?]+$/,
          message:'必须包含字母、数字、符号中至少2种'
      }
    ],
  },
  Mobile: {
    props: {
      size: 'large',
      placeholder: '手机号码',
    },
    rules: [
      {
        required: true,
        message: '手机号码不可以为空',
      },
      {
          pattern:/^1(3|4|5|7|8)\d{9}$/,
          message:'手机号码格式不正确'
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
        message: '验证码不可以为空',
      }
    ],
  },
}
