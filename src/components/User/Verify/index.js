import React , { useState , useEffect , useRef } from 'react'
import { Modal, Select, message } from 'antd'
import { useDispatch, useSelector } from 'dva'
import Loading from '@/components/Loading'
import '@/utils/gt.js'
import Form from '@/components/Form'
import formMap from './formMap'

const { Captcha } = Form.createItem(formMap)
const VERIFY_SESSION_KEY = "itellyou_verify_key"

function Verify({ defaultValue , onClose , children , ...props }){
    defaultValue = defaultValue || 'mobile'

    const [ type , setType ] = useState(defaultValue)
    const [ visible , setVisible ] = useState(props.visible)
    const [ captchaState , setCaptchaState ] = useState({})
    const [ captchaTips , setCaptchaTips ] = useState({})
    const [ codeState , setCodeState ] = useState({})

    const expired = sessionStorage.getItem(VERIFY_SESSION_KEY)
    
    const now = new Date().getTime()
    const [ verifySucceed , setVerifySucceed ] = useState(expired && expired > now / 1000)

    const form = useRef()
    const gt = useRef()

    const dispatch = useDispatch()
    const me = useSelector(state => state.user.me)
    const loadingEffect = useSelector(state => state.loading)

    useEffect(() => {
        setVerifySucceed(expired && expired > new Date().getTime() / 1000)
    },[expired])

    useEffect(() => {
        setVisible(props.visible)
    },[props.visible])
    
    useEffect(() => {
        if(!me){
            dispatch({
                type:"user/fetchMe"
            })
        }
    },[dispatch, me])

    if(!me) return <Loading />

    const dataSource = []
    if(me.mobile){
        dataSource.push({
            key:"mobile",
            title:`使用手机 ${me.mobile} 验证`
        })
    }
    if(me.email){
        dataSource.push({
            key:"email",
            title:`使用邮箱 ${me.email} 验证`
        })
    }
    if(dataSource.length === 0){
        return <p>暂无可验证选项</p>
    }

    const onTypeChange = value => {
        setType(value)
    }

    let typeText = ""
    switch(type){
        case "mobile":
            typeText = "手机"
            break
        case "email":
            typeText = "邮箱"
            break
    }

    const onCaptcha = e => {
        e.preventDefault()
        setCaptchaState({
            status:'loading'
        })
        initGeetest(sendCaptcha)
    }

    const initGeetest = callback => {
        dispatch({
            type:'geetest/init',
            payload:{
                mode:`verify/${type}`
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
            dispatch({
                type:'validation/sendCode',
                payload:{
                    action:`verify/${type}`,
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
                            return error || `验证码已发送至绑定${typeText}`
                        }
                    })
                }else{
                    setCaptchaState({ status : false})
                    message.error(res.message)
                }
            })
        }else if(action === "error"){
            setCaptchaState({ status : false})
            message.error('服务出错啦，请刷新重试')
        }else if(action === "close"){
            setCaptchaState({ status : false})
        }
    }

    const loading = loadingEffect.effects[`verify/${ type }`]

    const onVerify = () => {
        form.current.validateFields(['code'],(err, values) => {
            if (!err) {
                dispatch({
                    type:`verify/${ type }`,
                    payload:{
                        ...values
                    }
                }).then(res => {
                    if(!res) return
                    if(res.result){
                        sessionStorage.setItem(VERIFY_SESSION_KEY,res.data)
                        setVerifySucceed(true)
                    }else if(res.status === 1001){
                        setCodeState({
                            status:false,
                            message:res.message,
                        })
                    }else{
                        message.error(res.message)
                    }
                })
            }
        })
    }
    
    if(verifySucceed) return children

    const { Option } = Select
    return (
        <Modal 
        title="身份验证"
        visible={visible}
        okText={loading ? "验证中..." : "验证"}
        onOk={onVerify}
        okButtonProps={
            {
                loading
            }
        }
        onCancel={() => {
            setVisible(false)
            if(onClose){
                onClose()
            }
        }}
        >
            <p>为了你的帐户安全，请验证身份。验证成功后进行下一步操作。</p>
            <Select 
            defaultValue={defaultValue} 
            value={type}
            onChange={onTypeChange}
            size="large"
            >
                {
                    dataSource.map(item => <Option key={item.key}>{item.title}</Option>)
                }
            </Select>
            <Form
            wrappedComponentRef={wrappedComponent => {
                form.current = wrappedComponent ? wrappedComponent.props.form : null;
            }}
            >
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
                placeholder={`6位${typeText}验证码`}
                tips={captchaTips}
                />
            </Form>
        </Modal>
    )
}
export default Verify