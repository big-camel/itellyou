import React , { useRef , useState } from 'react'
import { Modal, message } from 'antd'
import '@/utils/gt.js'
import { useDispatch, useSelector } from 'dva'
import Verify from '@/components/User/Verify'
import Form , { Submit } from '@/components/Form'
import formMap from './formMap'

const { Password , ConfirmPassword } = Form.createItem(formMap)

export default ({ onClose , visible }) => {

    const [ confirmDirty , setConfirmDirty ] = useState(false)

    const form = useRef()

    const dispatch = useDispatch()
    const loadingEffect = useSelector(state => state.loading)
    const submiting = loadingEffect.effects['user/update']

    const handleConfirmBlur = e => {
        const { value } = e.target
        setConfirmDirty(confirmDirty => {
            return confirmDirty || !!value
        })
    }

    const handleSubmit = (err, values) => {
        if(!err){
            dispatch({
                type:"user/update",
                payload:{
                    action:"password",
                    ...values
                }
            }).then(res => {
                if(!res) {
                    message.error("服务出错啦，请刷新重试")
                    return
                }
                if(res.result){
                    message.success("修改成功")
                    if(onClose) onClose()
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
            title="更改密码"
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
                    <Password
                    name='password' 
                    autoComplete='off'
                    placeholder="新密码"
                    rules={
                        [
                            {
                                validator:(rule, value, callback) => {
                                    if (value && confirmDirty) {
                                        form.current.validateFields(['confirm'], { force: true })
                                    }
                                    callback()
                                }
                            }
                        ]
                    }
                    />
                    <ConfirmPassword 
                    name='confirm'
                    autoComplete="off"
                    rules={
                        [
                            {
                                validator:(rule, value, callback) => {
                                    if (value && value !== form.current.getFieldValue('password')) {
                                        callback('两次密码输入不一致!')
                                    } else {
                                        callback()
                                    }
                                }
                            }
                        ]
                    }
                    onBlur={handleConfirmBlur}
                    />
                    <Submit loading={submiting}>{ submiting ? "提交中...": "确认" }</Submit>
                </Form>
            </Modal>
        </Verify>
    )
}