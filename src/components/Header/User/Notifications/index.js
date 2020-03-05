import React, { useState , useEffect ,  useRef } from 'react'
import { Badge , Icon , Popover, Tabs, Button } from 'antd'
import { useSelector, useDispatch } from 'dva'
import NotificationsList from './List'
import styles from './index.less'
import { Link } from 'umi'

const { TabPane } = Tabs

export default ({ overflowCount }) => {

    overflowCount = overflowCount || 99

    const { groupCount } = useSelector(state => state.notifications)

    const [ visible , setVisible ] = useState(false)
    const [ activeKey , setActiveKey ] = useState("default")

    const dispatch = useDispatch()
    const socket = useRef()

    useEffect(() => {
        const connection = () => {
            const webSocket = new WebSocket("ws://localhost:8082")
            webSocket.onopen = () => {
                const message = {
                    action:"ready"
                }
                webSocket.send(JSON.stringify(message))
            }
            webSocket.onclose = () => {
                setTimeout(() => {
                    connection()
                },5000)
            }
            webSocket.onerror = event => {
                console.log("websocket error:",event)
            }
            webSocket.onmessage = event => {
                const { notifications : { count , group }} = JSON.parse(event.data)
                dispatch({
                    type:"notifications/setGroupCount",
                    payload:{
                        count,
                        group
                    }
                })
            }
            socket.current = webSocket
        }
        if(socket.current == undefined){
            connection()
        }
        return () => {
            if(socket.current){
                socket.current.close()
            }
        }
    },[dispatch])

    useEffect(() => {
        if(visible === true && groupCount.count > 0){
            dispatch({
                type:"notifications/readed"
            })
        }
    },[visible,groupCount,dispatch])

    const content = (
        <div
        className={styles['notifications']}
        >
            <Tabs 
            className={styles['tabs']}
            activeKey={activeKey}
            onChange={activeKey => setActiveKey(activeKey)}
            >
                <TabPane key="default" tab="默认">
                    <NotificationsList action="default" />
                </TabPane>
                <TabPane key="follow" tab="关注">
                    <NotificationsList action="follow" type="user" />
                </TabPane>
                <TabPane key="like" tab="喜欢">
                    <NotificationsList action="like" />
                </TabPane>
            </Tabs>
            <div className={styles['footer']}>
                <Button onClick={() => setVisible(false)} type="link" href="/setting/notifications" icon="setting">设置</Button>
                <Button onClick={() => setVisible(false)} type="link" href="/notifications">查看全部通知</Button>
            </div>
        </div>
    )

    return (
        <Popover
        className={styles["popover"]}
        trigger="click"
        content={content}
        visible={visible}
        destroyTooltipOnHide={true}
        onVisibleChange={visible => setVisible(visible)}
        >
            <Badge count={groupCount.count} overflowCount={overflowCount}>
                <Icon type="bell" />
            </Badge>
        </Popover>
    )
}