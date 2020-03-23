import React , { useState , useEffect } from 'react'
import { MoreList } from '@/components/List'
import { useDispatch , useSelector } from 'dva'
import Question from '@/components/Question'
import Timer from '@/components/Timer'

export default ({ id }) => {

    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.question.list)

    useEffect(() => {
        dispatch({
            type:'question/list',
            payload:{
                offset,
                limit,
                user_id:id
            }
        })
    },[id,offset, limit, dispatch])

    const renderItem = item => {
        const { created_time , answers , star_count } = item
        return (
            <MoreList.Item key={item.id}>
                <div>
                    <Question data={item} tag={false} number={false} authorSize="small" />
                    <div>
                        <Timer time={created_time} />
                        <span>{ answers }个回答</span>
                        <span>{ star_count }个关注</span>
                    </div>
                </div>
            </MoreList.Item>
        )
    }

    return (
        <MoreList
        offset={offset}
        limit={limit}
        renderItem={renderItem}
        dataSource={dataSource}
        onChange={offset => setOffset(offset)}
        />
    )
}