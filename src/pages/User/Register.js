import React from 'react'
import { Alert } from 'antd'
import { connect } from 'dva'
import { formatMessage } from 'umi-plugin-react/locale'
import RegisterForm from '@/components/Form/Register'
import '@/utils/gt.js'
import './Register.less'
import { router, Link } from 'umi';

const { Nickname,Password,Mobile,Captcha,Submit } = RegisterForm

class Register extends React.Component{

    state = {
        nickname:{
            status:null,
            message:null,
        },
        captcha:{
            status:null,
            secondText:formatMessage({id:'app.register.capthcha.secondText'},{s:'{s}'})
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
            text:formatMessage({id:'app.register.submit.text'}),
            loadingText:formatMessage({id:'app.register.submit.loadingText'}),
            isLoading:false
        },
        submitState:{
            status:true,
            message:null,
        }
    }

    handleGetCaptcha = e => {
        e.preventDefault();
        this.registerForm.validateFieldsAndScroll(['mobileNumber'],(err, values) => {
            if (!err) {
                this.setState({
                    captcha:Object.assign(this.state.captcha,{status:'loading'})
                })
                this.handleGeetestInit(values['mobileNumber'],this.handleGeetestCallback);
            }
        });
    }

    handleGeetestCallback = (gtObject,geetestKey,action) => {
        const validate = gtObject.getValidate();
        if(action === "success" && validate){
            const { dispatch } = this.props
            const mobileNumber = this.registerForm.getFieldValue('mobileNumber')
            dispatch({
                type:'verification/sendMobileCode',
                payload:{
                    type:'register',
                    mobile_number:mobileNumber,
                    geetest_key:geetestKey,
                    geetest_challenge:validate.geetest_challenge,
                    geetest_validate:validate.geetest_validate,
                    geetest_seccode:validate.geetest_seccode
                }
            }).then(res => {
                if(res.result === true){
                    this.setState({
                        captcha:Object.assign({},this.state.captcha,{status:'start',time:res.data.time + 60}),
                        mobileTips:{
                            hide:'onFocus',
                            show:'onBlur',
                            visible:true,
                            getContent:value => {
                                if(value !== res.data.mobileNumber)
                                    return null
                                return (<span>验证码已发送，请注意查收短信，<a>收不到验证码？</a></span>)
                            }
                        }
                    })
                }else if(res.code === 1006){
                    this.setState({
                        captcha:Object.assign({},this.state.captcha,{status:false}),
                        mobile:Object.assign({},this.state.mobile,{
                            status:false,
                            message:(<span key='mobileError'>手机号已被占用，请更换手机号或去<a target='_blank' href='/user/login'>登录</a></span>),
                        })
                    })
                }else{
                    this.setState({
                        captcha:Object.assign({},this.state.captcha,{status:false,message:res.message})
                    })
                }
            })
        }
    }

    handleGeetestInit = (user_id,callback) => {
        const { dispatch } = this.props
        dispatch({
            type:'geetest/init',
            payload:{
                user_id
            }
        }).then(res => {
            if(res.result){
                const geetest = res.data
                window.initGeetest({
                    gt: geetest.gt,
                    challenge: geetest.challenge,
                    new_captcha: geetest.new_captcha,
                    product: "bind",
                    offline: !geetest.success,
                },gtObject => {
                    gtObject.onSuccess(() => {
                        callback(gtObject,geetest.key,'success')
                    })
                    gtObject.onError(() => {
                        callback(gtObject,geetest.key,'error')
                    })
                    gtObject.onClose(() => {
                        callback(gtObject,geetest.key,'close')
                    })
                    gtObject.onReady(() => {
                        gtObject.verify()
                    })
                })
            }else{
                this.setState({
                    submitState:Object.assign({},this.state.submitState,{
                        status:false,
                        message:'服务出错啦，请刷新重试'
                    })
                })
            }
        })
    }

    handleSubmit = (err, values) => {
        if(!err){
            this.setState({
                registerButton:Object.assign({},this.state.registerButton,{isLoading:'loading'})
            })
            const { dispatch } = this.props
            dispatch({
                type:'register/submit',
                payload:{
                    nickname:values['nickname'],
                    password:values['password'],
                    mobile_number:values['mobileNumber'],
                    code:values['code']
                }
            }).then(res => {
                if(res.result === true){
                    router.push('/user/login')
                }else if(res.result === false){
                    switch(res.code){
                        case 1008:
                        this.setState({
                            code:Object.assign({},this.state.code,{
                                status:false,
                                message:'验证码错误'
                            })
                        })
                        break
                        case 1009:
                        this.setState({
                            nickname:Object.assign({},this.state.code,{
                                status:false,
                                message:res.message
                            })
                        })
                        break
                        default:
                        this.setState({
                            submitState:Object.assign({},this.state.submitState,{
                                status:false,
                                message:res.message
                            })
                        })
                    }
                }
            })
        }
    }

    checkNickname = nickname => {
        const { dispatch } = this.props
        this.setState({
            nickname:Object.assign(this.state.nickname,{status:'loading'})
        })
        dispatch({
            type:'user/checkNickname',
            payload:{
                nickname
            }
        }).then(res => {
            this.setState({
                nickname:{
                    status:res.result,
                    data:res.data.nickname,
                    message:res.message
                }
            })
        })
    }

    renderMessage = content => (
        <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    )


    render(){
        const { registerButton } = this.state
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
                <Nickname 
                    name='nickname' 
                    autoComplete='off' 
                    itemStatus={this.state.nickname} 
                    ansyVaildate={this.checkNickname} 
                />
                <Password name='password' autoComplete='off' />
                <Mobile 
                    name='mobileNumber' 
                    autoComplete='off' 
                    maxLength={11}
                    itemStatus={this.state.mobile}
                    tips={this.state.mobileTips}
                />
                <Captcha 
                    name='code' 
                    autoComplete='off' 
                    captchaStatus={this.state.captcha} 
                    onGetCaptcha={this.handleGetCaptcha} 
                    itemStatus={this.state.code}
                    onPressEnter={() => this.registerForm.validateFields(this.handleSubmit)}
                />
                <p>点击“注册”，即代表您已同意<Link to="" _target="_blank">《ITELLYOU用户协议》</Link></p>
                <Submit loading={registerButton.isLoading}>{registerButton.isLoading ? registerButton.loadingText : registerButton.text}</Submit>
            </RegisterForm>
        )
    }
}

export default connect()(Register)