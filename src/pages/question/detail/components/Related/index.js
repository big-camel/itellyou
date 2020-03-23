import React, { useEffect } from 'react'
import { Card } from 'antd'
import { useDispatch, useSelector } from 'dva'
import Loading from '@/components/Loading'
import { Link } from 'umi'

export default ({ id }) => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type:'question/related',
            payload:{
                id,
                offset:0,
                limit:5,
            }
        })
    },[id , dispatch])

    const dataSource = useSelector(state => state.question.related)
    if(!dataSource) return <Loading />
    return (
        <Card
        title="相似问题"
        >
            <ul>
            {
                dataSource.data.map(({ id , title }) => {
                    return <li key={id}><Link to={`/question/${id}`}>{ title }</Link></li>
                })
            }
            </ul>
        </Card>
    )
}