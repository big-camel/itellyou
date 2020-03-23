import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import { Card } from 'antd'
import Loading from '@/components/Loading'
import Tag from '@/components/Tag'

export default () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type:'tag/list',
            payload:{
                type:'hot',
                offset:0,
                limit:10
            }
        })
    },[dispatch])

    const dataSource = useSelector(state => state.tag.list)
    if(!dataSource) return <Loading />
    return (
        <Card
        title="热门标签"
        >
            <ul>
                {
                    dataSource.data.map(({ id , name }) => {
                        return <li key={id}><Tag id={id} title={name} /></li>
                    })
                }
            </ul>
        </Card>
    )
}