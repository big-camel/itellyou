import React , { useState , useEffect } from 'react'
import { MoreList } from '@/components/List'
import { useDispatch , useSelector } from 'dva'
import Article from '@/components/Article'

export default ({ id }) => {

    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.article.list)

    useEffect(() => {
        dispatch({
            type:'article/list',
            payload:{
                offset,
                limit,
                user_id:id
            }
        })
    },[id,offset, limit, dispatch])

    const renderItem = item => {
        return (
            <MoreList.Item key={item.id}>
                <div>
                    <Article data={item} />
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