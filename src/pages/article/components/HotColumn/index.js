import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import { Card } from 'antd'
import Loading from '@/components/Loading'
import { Link } from 'umi'

export default () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type:'column/list',
            payload:{
                type:'hot',
                offset:0,
                limit:5
            }
        })
    },[dispatch])

    const dataSource = useSelector(state => state.column.list)
    if(!dataSource) return <Loading />
    return (
        <Card
        title="热门专栏"
        >
        <ul>
        {
            dataSource.data.map(({ id , name , path , description}) => {
                return <li key={id}>
                    <h2><Link to={`/${path}`}>{name}</Link></h2>
                    <p>{ description }</p>
                </li>
            })
        }
        </ul>
        </Card>
    )
}