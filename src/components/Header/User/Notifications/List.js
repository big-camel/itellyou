import React , { useState , useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { useDispatch , useSelector} from 'dva'
import { List } from 'antd'
import Loading from '@/components/Loading'
import NotificationsAction from '@/components/NotificationsAction'

export default ({ action , type }) => {
    action = action || "default"
    type = type || "default"
    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const [ loading , setLoading ] = useState(false)

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.notifications.list[action])
    
    useEffect(() => {
        setLoading(true)
        dispatch({
            type:'notifications/list',
            payload:{
                append:true,
                action,
                type,
                offset,
                limit
            }
        }).then(() => {
            setLoading(false)
        })
    },[ action , type , offset , limit , dispatch])

    const renderItem = item => {
        return (
            <List.Item>
                <NotificationsAction dataSource={item} />
            </List.Item>
        )
    }

    const renderList = () => {
        if(!dataSource) return <Loading />
        
        return (
            <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => {
                if(!loading){
                    setOffset(offset + limit)
                }
            }}
            hasMore={!loading && !dataSource.end}
            >
                <List 
                dataSource={dataSource.data}
                renderItem={renderItem}
                itemLayout="vertical"
                />
                {
                    loading && <Loading />
                }
            </InfiniteScroll>
        )
    }

    return renderList()
}