import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'dva'
import { List, Button } from 'antd'
import Loading from '@/components/Loading'
import NotificationsAction from '@/components/NotificationsAction'

export default () => {
    const [ offset , setOffset ] = useState(0)
    const limit = 20
    const action = "default"
    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.notifications.list[action])
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects['notifications/list']

    useEffect(() => {
        dispatch({
            type:'notifications/list',
            payload:{
                append:true,
                action,
                offset,
                limit
            }
        })
    },[offset, limit, dispatch])

    const renderItem = item => {
        return <List.Item>
            {
                <NotificationsAction display="complete" dataSource={item} />
            }
        </List.Item>
    }

    const renderList = () => {
        if(!dataSource) return <Loading />
        
        return <List 
                dataSource={dataSource.data}
                renderItem={renderItem}
                itemLayout="vertical"
                />
    }

    const renderLoadMore = () => {
        if(dataSource && !dataSource.end){
            return <Button loading={loading} onClick={() => setOffset(offset => offset+=limit)}>加载更多</Button>
        }
        return null
    }

    return (
        <div>
            {
                renderList()
            }
            {
                renderLoadMore()
            }
        </div>
    )
}