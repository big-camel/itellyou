import React from 'react'
import { Alert } from 'antd'
import { merge } from 'lodash'
import { connect } from 'dva'
import { formatMessage } from 'umi-plugin-react/locale'
import RegisterForm from '@/components/Form/Register'
import '@/utils/gt.js'
import { Link } from 'umi';

const { Name,Password,Mobile,Captcha,Submit } = RegisterForm

class Register extends React.Component{

    state = {
        name:{
            status:null,
            message:null,
        },
        captcha:{
            status:null,
            secondText:formatMessage({id:'register.capthcha.secondText'},{s:'{s}'})
        },
        mobile:{
            status:null,
            message:null,
        },
        mobileTips:null,
        code:{
            status:null,
            message:null,
        },
        registerButton:{
            text:formatMessage({id:'register.submit.text'}),
            loadingText:formatMessage({id:'register.submit.loadingText'})
        },
        submitState:{
            status:true,
            message:null,
        }
    }

    handleGetCaptcha = e => {
        e.preventDefault();
        this.registerForm.validateFieldsAndScroll(['mobile'],(err, values) => {
            if (!err) {
                this.changeState({
                    captcha:{
                        status:'loading'
                    }
                })
                this.handleGeetestInit(this.handleGeetestCallback);
            }
        });
    }

    handleGeetestCallback = (gtObject,geetestKey,action) => {
        const validate = gtObject.getValidate();
        if(action === "success" && validate){
            const { dispatch } = this.props
            const mobile = this.registerForm.getFieldValue('mobile')
            dispatch({
                type:'validation/sendMobileCode',
                payload:{
                    action:'register',
                    mobile,
                    geetest:{
                        key:geetestKey,
                        challenge:validate.geetest_challenge,
                        validate:validate.geetest_validate,
                        seccode:validate.geetest_seccode
                    }
                }
            }).then(res => {
                if(res.result){
                    this.changeState({
                        captcha:{
                            status:'start',
                            time:res.data.time + 60
                        },
                        mobileTips:{
                            hide:'onFocus',
                            show:'onBlur',
                            visible:true,
                            getContent:value => {
                                if(value !== res.data.mobile)
                                    return null
                                return (<span>{formatMessage({id:'register.capthcha.sendSuccess'})}<a>{formatMessage({id:'register.capthcha.notGet'})}</a></span>)
                            }
                        }
                    })
                }else if(res.status === 1002){
                    this.changeState({
                        captcha:{
                            status:false
                        },
                        mobile:{
                            status:false,
                            message:(<span key='mobileError'>{formatMessage({id:'register.mobile.takeUp'})}<a target='_blank' href='/user/login'>{formatMessage({id:'login.page'})}</a></span>),
                        }
                    })
                }else{
                    this.changeState({
                        captcha:{
                            status:false,
                            message:res.message
                        }
                    })
                }
            })
        }else if(action === "close"){
            this.changeState({
                captcha:{
                    status:false
                }
            })
        }
        gtObject.reset()
    }

    handleGeetestInit = callback => {
        const { dispatch } = this.props
        dispatch({
            type:'geetest/init',
            payload:{
                mode:"register"
            }
        }).then(res => {
            if(res.result){
                const { key, gt , challenge , success , newCaptcha } = res.data
                window.initGeetest({
                    gt,
                    challenge,
                    new_captcha: newCaptcha,
                    offline: !success,
                    product: "bind",
                },gtObject => {
                    gtObject.onSuccess(() => {
                        callback(gtObject,key,'success')
                    })
                    gtObject.onError(() => {
                        callback(gtObject,key,'error')
                    })
                    gtObject.onClose(() => {
                        callback(gtObject,key,'close')
                    })
                    gtObject.onReady(() => {
                        gtObject.verify()
                    })
                })
            }else{
                this.changeState({
                    submitState:{
                        status:false,
                        message:'服务出错啦，请刷新重试'
                    }
                })
            }
        })
    }

    handleSubmit = (err, values) => {
        if(!err){
            const { dispatch } = this.props
            dispatch({
                type:'register/submit',
                payload:{
                    name:values['name'],
                    loginPassword:values['password'],
                    mobile:values['mobile'],
                    code:values['code']
                }
            }).then(res => {
                if(!res){
                    this.changeState({
                        submitState:{
                            status:false,
                            message:"系统错误"
                        }
                    })
                    return
                }
                if(res.result === true){
                    window.location.href = "/user/login"
                }else if(res.result === false){
                    switch(res.status){
                        case 1001:
                        this.changeState({
                            code:{
                                status:false,
                                message:res.message
                            }
                        })
                        break
                        case 1002:
                        this.changeState({
                            captcha:{
                                status:false
                            },
                            mobile:{
                                status:false,
                                message:(<span key='mobileError'>{formatMessage({id:'register.mobile.takeUp'})}<a target='_blank' href='/user/login'>{formatMessage({id:'login.page'})}</a></span>),
                            }
                        })
                        break
                        case 1003:
                        this.changeState({
                            name:{
                                status:false,
                                message:res.message
                            }
                        })
                        break
                        default:
                        this.changeState({
                            submitState:{
                                status:false,
                                message:res.message
                            }
                        })
                    }
                }
            })
        }
    }

    queryName = name => {
        const { dispatch } = this.props
        this.changeState({
            name:{
                status:"loading"
            }
        })
        dispatch({
            type:'user/queryName',
            payload:{
                name
            }
        }).then(res => {
            this.changeState({
                name:{
                    status:res.result,
                    data:res.data,
                    message:res.message
                }
            })
        })
    }

    changeState = data => {
        const newState = {}
        for (const key in data) {
            newState[key] = merge({},this.state[key],data[key])
        }
        this.setState(newState)
    }

    renderMessage = content => (
        <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    )


    render(){
        const { registerButton , name ,mobile ,mobileTips , captcha ,code} = this.state
        const { submiting } = this.props
        return(
            <RegisterForm
                onSubmit={this.handleSubmit}
                wrappedComponentRef ={wrappedComponent => {
                    this.registerForm = wrappedComponent ? wrappedComponent.props.form : null;
                }}
            >
                {
                    this.state.submitState.status === false ? this.renderMessage(this.state.submitState.message) : null
                }
                <Name 
                    name='name' 
                    autoComplete='off' 
                    itemStatus={name} 
                    ansyVaildate={this.queryName} 
                />
                <Password name='password' autoComplete='off' />
                <Mobile 
                    name='mobile' 
                    autoComplete='off' 
                    maxLength={11}
                    itemStatus={mobile}
                    tips={mobileTips}
                />
                <Captcha 
                    name='code' 
                    autoComplete='off' 
                    captchaStatus={captcha} 
                    onGetCaptcha={this.handleGetCaptcha} 
                    itemStatus={code}
                    onPressEnter={() => this.registerForm.validateFields(this.handleSubmit)}
                />
                <p>点击“注册”，即代表您已同意<Link to="" _target="_blank">《ITELLYOU用户协议》</Link></p>
                <Submit loading={submiting}>{submiting ? registerButton.loadingText : registerButton.text}</Submit>
            </RegisterForm>
        )
    }
}

export default connect(({ loading })=>({
    submiting:loading.effects["register/submit"]
}))(Register)