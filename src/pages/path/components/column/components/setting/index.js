import React, { useState, useRef } from 'react'
import { useDispatch } from 'dva'
import { router } from 'umi'
import { message } from 'antd'
import AvatarCropper from '@/components/AvatarCropper'
import Form , { Submit } from '@/components/Form'
import formMap from './formMap'
import styles from './index.less'

const { Avatar , Name , Desc , Path } = Form.createItem(formMap)

export default detail => {
 
    const [ avatar ,setAvatar ] = useState(detail.avatar)
    const [ nameState , setNameState ] = useState({})
    const [ descState , setDescState ] = useState({})
    const [ pathState , setPathState ] = useState({})
    const [ submiting , setSubmiting ] = useState(false)

    const form = useRef()
    const dispatch = useDispatch()

    const avatarChange = url => {
        setAvatar(url)
        form.current.setFieldsValue({ avatar:url })
    }

    const queryName = name => {
        if(name === "") return
        if(name === detail.name){
            setNameState(state => {
                return { ...state,status:true,data:detail.name,message:"" }
            })
            return
        }
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

    const findPath = path => {
        if(path === "") return
        if(path === detail.path){
            setPathState(state => {
                return { ...state,status:true,data:detail.path,message:"" }
            })
            return
        }
        setPathState(state => {
            return {...state,status:"loading"}
        })

        dispatch({
            type:'path/find',
            payload:{
                path,
                reducer:false
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
            const data = {}
            for(let key in values){
                if(values[key] !== undefined && values[key] !== detail[key]){
                    data[key] = values[key]
                }
            }
            if(Object.keys(data).length === 0)
                return
            setSubmiting(true)
            dispatch({
                type:'column/setting',
                payload:{...data , id:detail.id}
            }).then(res => {
                setSubmiting(false)
                if(!res) {
                    res = { message : "系统错误" }
                }
                if(res.result === true){
                    router.push(`/${res.data.path}`)          
                }else if(res.result === false){
                    message.error(res.message)
                }
            })
        }
    }

    return (
        <Form
        layout="vertical"
        hideRequiredMark={true}
        onSubmit={handleSubmit}
        wrappedComponentRef ={wrappedComponent => {
            form.current = wrappedComponent ? wrappedComponent.props.form : null;
        }}
        >
            <Avatar 
            label="头像"
            name="avatar"
            extra={
                <AvatarCropper url={avatar} onChange={avatarChange} />
            }
            />
            <Name 
            label="名称"
            name='name' 
            autoComplete='off' 
            defaultValue={detail.name}
            itemStatus={nameState} 
            ansyVaildate={queryName} 
            />
            <Path
            label="路径"
            name='path' 
            autoComplete='off' 
            placeholder={detail.path}
            defaultValue={detail.path}
            itemStatus={pathState}
            ansyVaildate={findPath}
            />
            <Desc 
            label="简介"
            name="description"
            autoComplete='off' 
            defaultValue={detail.description}
            itemStatus={descState} 
            />
            <Submit loading={submiting}>{submiting ? "提交中..." : "提交"}</Submit>
        </Form>
    )
}