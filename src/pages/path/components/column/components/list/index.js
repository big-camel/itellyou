import React, { useEffect , useState } from 'react'
import { MoreList } from '@/components/List'
import Article from '@/components/Article'
import { useDispatch, useSelector } from 'dva'

export default ({ id , ...props}) => {

    const [offset,setOffset] = useState(parseInt(props.offset || 0))
    const limit = parseInt(props.limit || 20)

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.article.list )

    useEffect(() => {
        dispatch({
            type:'article/list',
            payload:{
                offset,
                limit,
                column_id:id
            }
        })
    },[offset, limit, id, dispatch])

    const renderItem = item => {
        return (
            <MoreList.Item
            key={item.id}
            >
                <Article 
                data={item} 
                authorSize="small"
                />
            </MoreList.Item>
        )
    }

    return (
        <MoreList 
        renderItem={renderItem}
        offset={offset} 
        limit={limit} 
        dataSource={dataSource} 
        onChange={offset => setOffset(offset)} 
        />
)
}