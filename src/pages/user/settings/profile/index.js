import React , { useState , useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import { message } from 'antd'
import Loading from '@/components/Loading'
import { Layout , Sider } from '@/components/Container'
import UserAvatar from './components/Avatar'
import Form , { Submit } from '@/components/Form'
import formMap from './formMap'
import menuData from '../menu'
import './index.less'


const { Avatar , Name , Gender , Description , Introduction , Address , Profession } = Form.createItem(formMap)

function Profile(){

    const [ avatar ,setAvatar ] = useState()
    const [ nameState , setNameState ] = useState({})

    const form = useRef()
    const dispatch = useDispatch()
    const me = useSelector(state => state.user.me)
    const loadingEffect = useSelector(state => state.loading)
    const submiting = loadingEffect.effects['user/profile']

    useEffect(() => {
        dispatch({
            type:"user/fetchMe",
            payload:{
                include:"info"
            }
        })
    },[dispatch])

    useEffect(() => {
        if(me){
            setAvatar(me.avatar)
        }
    },[me])

    if(!me) return <Loading />

    const queryName = name => {
        if(name === "") return
        if(name === me.name){
            setNameState(state => {
                return { ...state,status:true,data:me.name,message:"" }
            })
            return
        }
        setNameState(state => {
            return {...state,status:"loading"}
        })

        dispatch({
            type:'user/queryName',
            payload:{
                name
            }
        }).then(res => {
            setNameState(state => {
                return { ...state,status:res.result,data:res.data,message:res.message }
            })
        })
    }

    const avatarChange = url => {
        setAvatar(url)
        form.current.setFieldsValue({ avatar:url })
    }

    const handleSubmit = (err, values) => {
        if(!err){
            dispatch({
                type:"user/profile",
                payload:values
            }).then(res => {
                if(!res){
                    message.error("系统错误")
                }else if(!res.result){
                    message.error(res.message)
                }else{
                    message.success("更新成功!")
                }
            })
        }
    }
    return (
        <Layout sider={<Sider dataSource={menuData} defaultKey="profile" />}>
            <h2>个人信息</h2>
            <div>
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
                        <UserAvatar url={avatar} onChange={avatarChange} />
                    }
                    />
                    <Name 
                    label="昵称"
                    name='name'
                    defaultValue={me.name} 
                    autoComplete='off' 
                    itemStatus={nameState} 
                    ansyVaildate={queryName} 
                    />
                    <Gender
                    label="性别"
                    name="gender"
                    defaultValue={me.gender}
                    />
                    <Description 
                    label="一句话介绍自己"
                    name="description"
                    defaultValue={me.description}
                    autoComplete='off' 
                    />
                    <Profession 
                    label="行业"
                    name="profession"
                    defaultValue={me.profession}
                    />
                    <Address 
                    label="地址"
                    name="address"
                    defaultValue={me.address}
                    />
                    <Introduction
                    label="简介"
                    name="introduction"
                    autoComplete='off' 
                    defaultValue={me.introduction}
                    />
                    <Submit loading={submiting}>{submiting ? "更新中..." : "更新信息"}</Submit>
                </Form>
            </div>
        </Layout>
    )
}
export default Profile