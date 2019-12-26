import React from 'react'
import { Alert , message , Tabs } from 'antd'
import { merge } from 'lodash'
import LoginForm from '@/components/Form/Login'
import { connect } from 'dva'
import '@/utils/gt.js'
import { Link } from 'umi';
import styles from './Login.less'

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;

class Login extends React.Component{

    state ={
        loginType: 'account',
        username:{
            status:null,
            message:null
        },
        password:{
            status:null,
            message:null
        },
        captcha:{
            status:null,
            secondText:'{s}秒'
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
        submitState:{
            status:true,
            message:null,
        }
    }

    handleGetCaptcha = (e) => {
        e.preventDefault();
        this.loginForm.validateFields(['mobile'],(err, values) => {
            if (!err) {
                this.changeState({
                    captcha:{
                        status:'loading'
                    }
                })
                this.handleGeetestInit(this.handleGeetestSendCaptcha)
            }
        });
    }

    handleGeetestInit = callback => {
        const { dispatch } = this.props
        dispatch({
            type:'geetest/init',
            payload:{
                mode:"login"
            }
        }).then(res => {
            if(res && res.result){
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

    handleGeetestSendCaptcha = (gtObject,geetestKey,action) => {
        const validate = gtObject.getValidate()
        const { dispatch } = this.props
        if(action === "success" && validate){
            const mobile = this.loginForm.getFieldValue('mobile')
            dispatch({
                type:'validation/sendMobileCode',
                payload:{
                    action:'login',
                    mobile,
                    geetest:{
                        key:geetestKey,
                        challenge:validate.geetest_challenge,
                        validate:validate.geetest_validate,
                        seccode:validate.geetest_seccode
                    }
                }
            }).then(res => {
                if(res.result === true){
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
                                return (<span>验证码已发送，请注意查收短信，<a>收不到验证码？</a></span>)
                            }
                        }
                    })
                }
                else if(res.status === 1002){
                    this.changeState({
                        captcha:{
                            status:false
                        },
                        mobile:{
                            status:false,
                            message:(<span key='mobileError'>手机号尚未注册，请更换手机号或去<Link to="/user/register">注册</Link></span>),
                        }
                    })
                }else{
                    this.changeState({
                        captcha:{
                            status:false
                        }
                    })
                    message.error(res.message)
                }
            })
        }else if(action === "error"){
            this.changeState({
                captcha:{
                    status:false
                },
                submitState:{
                    status:false,
                    message:"服务中断，请刷新重试"
                }
            })
        }else if(action === "close"){
            this.changeState({
                captcha:{
                    status:false
                },
            })
        }
    }

    handleGeetestLoginAccount = (gtObject,geetestKey,action) => {
        const validate = gtObject.getValidate()
        const { dispatch } = this.props
        if(action === "success" && validate){
            const username = this.loginForm.getFieldValue('username')
            const password = this.loginForm.getFieldValue('password')
            dispatch({
                type:'login/loginByAccount',
                payload:{
                    username,
                    password,
                    geetest:{
                        key:geetestKey,
                        challenge:validate.geetest_challenge,
                        validate:validate.geetest_validate,
                        seccode:validate.geetest_seccode
                    }
                }
            }).then(res => {
                if(res && !res.result){
                    switch(res.status){
                        case 1002:
                            this.changeState({
                                username:{
                                    status:false,
                                    message:<span key='mobileError'>手机号尚未注册，请更换手机号或去<Link target='_blank' to="/user/register">注册</Link></span>,
                                }
                            })
                        break
                        case 1003:
                            this.changeState({
                                username:{
                                    status:false,
                                    message:<span key='emailError'>邮箱尚未注册，请更换邮箱或去<Link target='_blank' to="/user/register">注册</Link></span>,
                                }
                            })
                        break
                        case 1004:
                            this.changeState({
                                username:{
                                    status:false,
                                    message:res.message,
                                }
                            })
                        break
                        case 1005:
                            this.changeState({
                                password:{
                                    status:false,
                                    message:res.message,
                                }
                            })
                        break
                        default:
                            this.changeState({
                                loginType:'account',
                                submitState:{
                                    status:false,
                                    message:res.message
                                }
                            })
                    }
                    this.setState({
                        logining:false
                    })
                }
            })
        }else if(action === "error"){
            this.changeState({
                submitState:{
                    status:false,
                    message:"服务中断，请刷新重试"
                }
            })
        }
        this.setState({
            logining:false
        })
    }

    onTabChange = loginType => {
        this.setState({
            loginType
        })
    }

    handleSubmit = (err, values) => {
        if(!err){
            const { loginType } = this.state
            const { dispatch } = this.props
            this.setState({
                logining:true
            })
            if(loginType === "account")
            {
                this.handleGeetestInit(this.handleGeetestLoginAccount)

            }else if(loginType === 'mobile'){
                dispatch({
                    type:'login/loginByMobile',
                    payload:{
                        mobile:values['mobile'],
                        code:values['code']
                    }
                }).then(res => {
                    if(res && !res.result){
                        switch(res.status){
                            case 1002:
                                this.changeState({
                                    mobile:{
                                        status:false,
                                        message:(<span key='mobileError'>手机号尚未注册，请更换手机号或去<a target='_blank' href='/user/register'>注册</a></span>),
                                    }
                                })
                            break
                            case 1001:
                                this.changeState({
                                    code:{
                                        status:false,
                                        message:res.message,
                                    }
                                })
                            break
                            default:
                                this.changeState({
                                    loginType:"mobile",
                                    submitState:{
                                        status:false,
                                        message:res.message,
                                    }
                                })
                        }
                        this.setState({
                            logining:false
                        })
                    }
                })
            }
        }
    }

    changeState = data => {
        const newState = {}
        for (const key in data) {
            if(typeof data[key] === "object" ){
                newState[key] = merge({},this.state[key],data[key])
            }else{
                newState[key] = data[key]
            }
        }
        this.setState(newState)
    }

    onTabChange = value => {
        this.setState({
            loginType:value
        })
    }

    renderMessage = content => (
        <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
    
    render(){
        const { loginType , submitState ,logining } = this.state;
        return(
            <LoginForm
                onSubmit={this.handleSubmit}
                defaultActiveKey={loginType}
                onTabChange={this.onTabChange}
                wrappedComponentRef ={wrappedComponent => {
                    this.loginForm = wrappedComponent ? wrappedComponent.props.form : null;
                }}
            >
                <Tab key="account" tab={'账号密码登录'}>
                    {
                        loginType === 'account' && (submitState.status === false ? this.renderMessage(submitState.message) : null)
                    }
                    <UserName 
                        name="username" 
                        autoComplete='off' 
                        itemStatus={this.state.username}
                    />
                    <Password
                        name="password"
                        autoComplete='off' 
                        itemStatus={this.state.password}
                        onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)
                    }
                    />
                </Tab>
                <Tab key="mobile" tab={'手机动态码登录'}>
                    {
                        loginType === 'account' && (submitState.status === false ? this.renderMessage(submitState.message) : null)
                    }
                    <Mobile 
                        name='mobile' 
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
                        onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)
                    }
                    />
                </Tab>
                <Submit loading={logining}>{logining ? '登陆中...' : '登陆'}</Submit>
                <div className={styles["login-footer"]}>
                    <Link to="/">忘记密码</Link>
                    <span></span>
                    <Link to="/user/register">快速注册</Link>
                </div>
            </LoginForm>
        )
    }
}
export default connect()(Login)