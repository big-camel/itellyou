import React from 'react'
import { Alert , message } from 'antd'
import LoginForm from '@/components/Form/Login'
import { connect } from 'dva'
import '@/utils/gt.js'
import { Link } from 'umi';

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
            secondText:'重新获取 {s}s'
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
        this.loginForm.validateFields(['mobileNumber'],(err, values) => {
            if (!err) {
                this.setState({
                    captcha:{...this.state.captcha,status:'loading'}
                })
                this.handleGeetestInit(values['mobileNumber'],this.handleGeetestSendCaptcha)
            }
        });
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

    handleGeetestSendCaptcha = (gtObject,geetestKey,action) => {
        const validate = gtObject.getValidate()
        const { dispatch } = this.props
        if(action === "success" && validate){
            const mobileNumber = this.loginForm.getFieldValue('mobileNumber')
            dispatch({
                type:'verification/sendMobileCode',
                payload:{
                    type:'login',
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
                }
                if(res.result === false){
                    if(res.code === 1006){
                        this.setState({
                            captcha:Object.assign({},this.state.captcha,{status:false}),
                            mobile:Object.assign({},this.state.mobile,{
                                status:false,
                                message:(<span key='mobileError'>手机号尚未注册，请更换手机号或去<Link target='_blank' to="/user/register">注册</Link></span>),
                            })
                        })
                    }else{
                        this.setState({
                            captcha:Object.assign({},this.state.captcha,{status:false})
                        })
                        message.error(res.message)
                    }
                }
            })
        }else if(action === "error"){
            this.setState({
                captcha:{...this.state.captcha,status:false},
                submitState:{
                    status:false,
                    message:"服务中断，请刷新重试"
                }
            })
        }else if(action === "close"){
            this.setState({
                captcha:{...this.state.captcha,status:false},
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
                    geetest_key:geetestKey,
                    geetest_challenge:validate.geetest_challenge,
                    geetest_validate:validate.geetest_validate,
                    geetest_seccode:validate.geetest_seccode
                }
            }).then(res => {
                let state = null
                if(!res.result){
                    switch(res.code){
                        case 10091:
                        state = {
                            username:Object.assign({},this.state.username,{
                                status:false,
                                message:(<span key='mobileError'>手机号尚未注册，请更换手机号或去<Link target='_blank' to="/user/register">注册</Link></span>),
                            })
                        }
                        break
                        case 10081:
                        case 10101:
                        state = {
                            username:Object.assign({},this.state.username,{
                                status:false,
                                message:res.message,
                            })
                        }
                        break
                        case 1008:
                        case 1009:
                        case 1010:
                        state = {
                            password:Object.assign({},this.state.password,{
                                status:false,
                                message:res.message,
                            })
                        }
                        break
                        default:
                        state = {
                            loginType:'account',
                            submitState:{
                                status:false,
                                message:res.message
                            }
                        }
                    }
                }
                state = Object.assign({},state,{logining:false})
                this.setState(state)
            })
        }else if(action === "error"){
            this.setState({
                logining:false,
                submitState:{
                    status:false,
                    message:"服务中断，请刷新重试"
                }
            })
        }else if(action === "close"){
            this.setState({
                logining:false
            })
        }
    }

    onTabChange = loginType => {
        this.setState({
            loginType
        })
    }

    handleSubmit = (err, values) => {
        if(!err){
            const { dispatch } = this.props
            this.setState({
                logining:true
            })
            if(values.hasOwnProperty('username'))
            {
                this.handleGeetestInit(values['username'],this.handleGeetestLoginAccount)

            }else if(values.hasOwnProperty('mobileNumber')){
                dispatch({
                    type:'login/loginByMobile',
                    payload:{
                        mobileNumber:values['mobileNumber'],
                        code:values['code']
                    }
                }).then(res => {
                    let state = null
                    if(!res.result){
                        switch(res.code){
                            case 1005:
                            state = {
                                mobile:Object.assign({},this.state.mobile,{
                                    status:false,
                                    message:(<span key='mobileError'>手机号尚未注册，请更换手机号或去<a target='_blank' href='/user/register'>注册</a></span>),
                                })
                            }
                            break
                            case 1004:
                            state = {
                                code:Object.assign({},this.state.code,{
                                    status:false,
                                    message:res.message,
                                })
                            }
                            break
                            default:
                            state = {
                                loginType:res.loginType,
                                submitState:Object.assign({},this.state.submitState,{
                                    status:false,
                                    message:res.message,
                                })
                            }
                        }
                    }
                    state = Object.assign({},state,{logining:false})
                    this.setState(state)
                })
            }
        }
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
                    <div>
                        <a style={{ float: 'right' }} href="">
                            忘记密码
                        </a>
                    </div>
                </Tab>
                <Tab key="mobile" tab={'手机动态码登录'}>
                    {
                        loginType === 'account' && (submitState.status === false ? this.renderMessage(submitState.message) : null)
                    }
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
                        onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)
                    }
                    />
                </Tab>
                <Submit loading={logining}>{logining ? '登陆中...' : '登陆'}</Submit>
            </LoginForm>
        )
    }
}
export default connect()(Login)