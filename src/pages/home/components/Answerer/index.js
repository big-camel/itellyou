import React , { useState , useEffect } from 'react'
import { Card } from 'antd'
import { useDispatch , useSelector } from 'dva'
import { MoreList } from '@/components/List'
import { UserAuthor } from '@/components/User'

export default () => {

    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type:"explore/answerer",
            payload:{
                offset,
                limit
            }
        })
    },[offset,limit,dispatch])

    const dataSource = useSelector(state => state.explore.answerer)

    const renderItem = item => {
        return (
            <MoreList.Item>
                <UserAuthor info={item} size="small" />
            </MoreList.Item>
        )
    }

    return (
        <Card
        title="作者推荐"
        >
            <MoreList
            offset={offset}
            limit={limit}
            dataSource={dataSource}
            onChange={offset => setOffset(offset)}
            renderItem={renderItem}
            />
        </Card>
    )
}