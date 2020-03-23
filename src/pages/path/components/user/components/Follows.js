import React , { useState , useEffect } from 'react'
import { MoreList } from '@/components/List'
import { useDispatch , useSelector } from 'dva'
import { UserAuthor, UserStar } from '@/components/User'

export default ({ id }) => {

    const [ offset , setOffset ] = useState(0)
    const limit = 20

    const dispatch = useDispatch()
    const dataSource = useSelector(state => state.userStar.starList)

    useEffect(() => {
        dispatch({
            type:'userStar/starList',
            payload:{
                offset,
                limit,
                user_id:id
            }
        })
    },[id,offset, limit, dispatch])

    const renderItem = ({ star }) => {
        const { id , use_star } = star
        return (
            <MoreList.Item key={id}>
                <div>
                    <UserAuthor info={star} />
                    <UserStar id={id} use_star={use_star} />
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