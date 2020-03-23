import React , { useRef , useState } from 'react'
import { Modal, message } from 'antd'
import '@/utils/gt.js'
import { useDispatch, useSelector } from 'dva'
import Verify from '@/components/User/Verify'
import Form , { Submit } from '@/components/Form'
import formMap from './formMap'

const { Email , Captcha } = Form.createItem(formMap)

export default ({ onClose , visible }) => {

    const form = useRef()

    const [ captchaState , setCaptchaState ] = useState({})
    const [ captchaTips , setCaptchaTips ] = useState({})
    const [ codeState , setCodeState ] = useState({})
    const [ emailState , setEmailState ] = useState({})

    const gt = useRef()

    const dispatch = useDispatch()
    const loadingEffect = useSelector(state => state.loading)
    const submiting = loadingEffect.effects['user/update']

    const onCaptcha = e => {
        e.preventDefault()
        form.current.validateFields(['email'],(err, values) => {
            if (!err) {
                setCaptchaState({
                    status:'loading'
                })
                initGeetest(sendCaptcha)
            }
        })
    }

    const initGeetest = callback => {
        dispatch({
            type:'geetest/init',
            payload:{
                mode:"replace/email"
            }
        }).then(res => {
            if(res && res.result){
                const { key , challenge , success , newCaptcha } = res.data
                window.initGeetest({
                    gt:res.data.gt,
                    challenge,
                    new_captcha: newCaptcha,
                    offline: !success,
                    product: "bind",
                },obj => {
                    obj.onSuccess(() => {
                        callback(key,'success')
                    })
                    obj.onError(() => {
                        callback(key,'error')
                    })
                    obj.onClose(() => {
                        callback(key,'close')
                    })
                    obj.onReady(() => {
                        gt.current.verify()
                    })
                    gt.current = obj
                })
            }else{
                message.error('服务出错啦，请刷新重试')
            }
        })
    }

    const sendCaptcha = (key,action) => {
        const validate = gt.current.getValidate()
        if(action === "success" && validate){
            const email = form.current.getFieldValue('email')
            dispatch({
                type:'validation/sendCode',
                payload:{
                    action:'replace/email',
                    email,
                    geetest:{
                        key,
                        challenge:validate.geetest_challenge,
                        validate:validate.geetest_validate,
                        seccode:validate.geetest_seccode
                    }
                }
            }).then(res => {
                if(res.result === true){
                    setCaptchaState(captcha => {
                        return {
                            ...captcha,
                            status:'start',
                            time:res.data.time + 60
                        }
                    })
                    setCaptchaTips({
                        visible:true,
                        getContent:() => {
                            const error = form.current.getFieldError("code")
                            return error || "验证码已发送至邮箱"
                        }
                    })
                    return
                }else if(res.status === 1002){
                    setEmailState({
                        status:false,
                        message:res.message
                    })
                }else{
                    message.error(res.message)
                }
                setCaptchaState({ status : false})
            })
        }else if(action === "error"){
            setCaptchaState({ status : false})
            message.error('服务出错啦，请刷新重试')
        }else if(action === "close"){
            setCaptchaState({ status : false})
        }
    }

    const handleSubmit = (err, values) => {
        if(!err){
            dispatch({
                type:"user/update",
                payload:{
                    action:"email",
                    ...values
                }
            }).then(res => {
                if(!res) {
                    message.error("服务出错啦，请刷新重试")
                    return
                }
                if(res.result){
                    message.success("更新成功")
                    if(onClose) onClose()
                }else if(res.status === 1001){
                    setCodeState({
                        status:false,
                        message:res.message
                    })
                }else if(res.status == 1002){
                    setEmailState({
                        status:false,
                        message:res.message
                    })
                }else{
                    message.error(res.message)
                }
            })
        }
    }

    return (
        <Verify 
        visible={visible} 
        onClose={() => {
            if(onClose) onClose()
        }}>
            <Modal
            title="更改邮箱"
            visible={visible}
            footer={null}
            destroyOnClose={true}
            onCancel={() => {
                if(onClose) onClose()
            }}
            >
                <Form
                layout="vertical"
                hideRequiredMark={true}
                onSubmit={handleSubmit}
                wrappedComponentRef ={wrappedComponent => {
                    form.current = wrappedComponent ? wrappedComponent.props.form : null;
                }}
                >
                    <Email
                    name='email' 
                    autoComplete='off' 
                    itemStatus={emailState}
                    />
                    <Captcha 
                    name='code'
                    autoComplete="off"
                    captchaStatus={captchaState}
                    itemStatus={codeState}
                    onGet={onCaptcha}
                    onStop={() => {
                        setCaptchaTips({
                            visible:false
                        })
                    }}
                    placeholder={`6位验证码`}
                    maxLength={6}
                    tips={captchaTips}
                    />
                    <Submit loading={submiting}>{ submiting ? "提交中...": "确认" }</Submit>
                </Form>
            </Modal>
        </Verify>
    )
}