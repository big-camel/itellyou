import React , { useRef , useState } from 'react'
import { Modal, message } from 'antd'
import '@/utils/gt.js'
import { useDispatch, useSelector } from 'dva'
import Verify from '@/components/User/Verify'
import Form , { Submit } from '@/components/Form'
import formMap from './formMap'

const { Path } = Form.createItem(formMap)

export default ({ onClose , visible , defaultValue }) => {

    const form = useRef()

    const [ pathState , setPathState ] = useState({})

    const dispatch = useDispatch()
    const loadingEffect = useSelector(state => state.loading)
    const submiting = loadingEffect.effects['user/update']

    const findPath = path => {
        if(path === "") return
        if(path === defaultValue){
            setPathState(state => {
                return { ...state,status:true,data:defaultValue,message:"" }
            })
            return
        }
        setPathState(state => {
            return {...state,status:"loading"}
        })

        dispatch({
            type:'path/find',
            payload:{
                path
            }
        }).then(res => {
            setPathState(state => {
                if(res.result)
                    return { ...state,status:!res.result,data:res.data.path,message:"不可用的路径或已被使用" }
                return {...state,status:true,data:res.data,message:null}
            })
        })
    }

    const handleSubmit = (err, values) => {
        if(!err){
            dispatch({
                type:"user/update",
                payload:{
                    action:"path",
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
            title="更改个人路径"
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
                    <Path
                    name='path' 
                    autoComplete='off' 
                    placeholder={defaultValue}
                    defaultValue={defaultValue}
                    itemStatus={pathState}
                    ansyVaildate={findPath}
                    />
                    <Submit loading={submiting}>{ submiting ? "提交中...": "确认" }</Submit>
                </Form>
            </Modal>
        </Verify>
    )
}