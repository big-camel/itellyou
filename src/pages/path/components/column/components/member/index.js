import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import Author from '@/components/User/Author'

export default ({ id }) => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch({
            type:"columnMember/list",
            payload:{
                id
            }
        })
    },[dispatch, id])

    const dataSource = useSelector(state => state.columnMember.list)
    if(!dataSource) return null
    return (
        <div>
            {
                dataSource.data.map(({ user }) => {
                    return <Author key={user.id} info={user} onlyAvatar={true} size="small" />
                })
            }
        </div>
    )
}