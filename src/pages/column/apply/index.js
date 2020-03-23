import React, { useState, useRef } from 'react'
import { useDispatch } from 'dva'
import { message } from 'antd'
import Form , { Submit } from '@/components/Form'
import formMap from './formMap'

const { Name , Desc } = Form.createItem(formMap)

function Apply(){

    const [ nameState , setNameState ] = useState({})
    const [ descState , setDescState ] = useState({})
    const [ submiting , setSubmiting ] = useState(false)

    const form = useRef()
    const dispatch = useDispatch()

    const queryName = name => {
        setNameState(state => {
            return {...state,status:"loading"}
        })

        dispatch({
            type:'column/queryName',
            payload:{
                name
            }
        }).then(res => {
            setNameState(state => {
                return { ...state,status:res.result,data:res.data,message:res.message }
            })
        })
    }

    const handleSubmit = (err, values) => {
        if(!err){
            setSubmiting(true)
            dispatch({
                type:'column/create',
                payload:values
            }).then(res => {
                setSubmiting(false)
                if(!res) {
                    message.error("系统错误")
                    return
                }
                if(res.result === true){
                    message.success("申请成功，请等待审核").then(() => {
                        window.location.href = "/user"
                    })
                }else if(res.result === false){
                    switch(res.status){
                        case 1001:
                            setNameState(state => {
                                return {...state,status:false,message:res.message}
                            })
                        break
                        case 1002:
                            setDescState(state => {
                                return {...state,status:false,message:res.message}
                            })
                        break
                        default:
                            message.error(res.message)
                    }
                }
            })
        }
    }

    return (
        <div>
            <Form
            layout="vertical"
            hideRequiredMark={true}
            onSubmit={handleSubmit}
            wrappedComponentRef ={wrappedComponent => {
                form.current = wrappedComponent ? wrappedComponent.props.form : null;
            }}
            >
                <Name 
                label="名称"
                name='name' 
                autoComplete='off' 
                itemStatus={nameState} 
                ansyVaildate={queryName} 
                />
                <Desc 
                label="简介"
                name="description"
                autoComplete='off' 
                itemStatus={descState} 
                />
                <Submit loading={submiting}>{submiting ? "提交中..." : "提交"}</Submit>
            </Form>
        </div>
    )
}

export default Apply