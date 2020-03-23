import React , { useState , useEffect } from 'react'
import { MoreList } from '@/components/List'
import Answer from '@/components/Answer'
import { useDispatch , useSelector } from 'dva'
import Question from '@/components/Question'

export default ({ id }) => {

    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.answer.list)

    useEffect(() => {
        dispatch({
            type:'answer/list',
            payload:{
                offset,
                limit,
                user_id:id
            }
        })
    },[id,offset, limit, dispatch])

    const renderItem = ({ question , ...item }) => {
        return (
            <MoreList.Item key={item.id}>
                <div>
                    <Question 
                    data={{...question,answer_list:[item]}}
                    tag={false}
                    number={false}
                    />
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