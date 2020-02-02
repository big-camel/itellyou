import React , { useEffect , useState } from 'react'
import { Card, Button } from 'antd'
import { useSelector, useDispatch } from 'dva'
import { Layout , Sider } from '@/components/Container'
import Loading from '@/components/Loading'
import Mobile from './components/Mobile'
import Email from './components/Email'
import Password from './components/Password'
import menuData from '../menu'
import './index.less'

function Account(){

    const [ loading , setLoading ] = useState(true)
    const [ mobileVisible , setMobileVisible ] = useState(false)
    const [ emailVisible , setEmailVisible ] = useState(false)
    const [ passwordVisible , setPasswordVisible ] = useState(false)
    //const [ loginVisible , setLoginVisible ] = useState(false)

    const dispatch = useDispatch()
    const me = useSelector(state => state.user.me)

    useEffect(() => {
        dispatch({
            type:"user/fetchMe",
            payload:{
                include:"is_set_pwd"
            }
        }).then(() => {
            setLoading(false)
        })
    },[dispatch])

    if(!me || loading) return <Loading />

    return (
        <Layout sider={<Sider dataSource={menuData} defaultKey="account" />}>
            <Card title="账户管理" className="settings-form">
                <div className="form-item">
                    <div className="text">
                        <h3>手机号码</h3>
                        <span>{ me.mobile || "未设置"}</span>
                    </div>
                    <Button onClick={() => setMobileVisible(true)}>{ me.mobile ? "更改" : "设置"}</Button>
                </div>
                <div className="form-item">
                    <div className="text">
                        <h3>邮箱</h3>
                        <span>{ me.email || "未设置" }</span>
                    </div>
                    <Button onClick={() => setEmailVisible(true)}>{ me.email ? "更改" : "设置"}</Button>
                </div>
                <div className="form-item">
                    <div className="text">
                        <h3>登录密码</h3>
                        <span>{ me.is_set_pwd ? "已设置，可通过密码登录" : "未设置" }</span>
                    </div>
                    <Button onClick={() => setPasswordVisible(true)}>{ me.is_set_pwd ? "更改" : "设置"}</Button>
                </div>
                {
                    <Mobile visible={mobileVisible} onClose={() => setMobileVisible(false)} />
                }
                {
                    <Email visible={emailVisible} onClose={() => setEmailVisible(false)} />
                }
                {
                    <Password visible={passwordVisible} onClose={() => setPasswordVisible(false)} />
                }
            </Card>
        </Layout>
    )
}

export default Account