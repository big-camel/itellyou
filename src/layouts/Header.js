import React from 'react'
import Header from '@/components/Header'
import { useDispatch , useSelector } from 'dva'
import Loading from '@/components/Loading'

export default props => {
    const dispatch = useDispatch()
    const me = useSelector(state => state.user.me)

    if(!me) return <Loading />

    const onLogout = () => {
        dispatch({
            type:"user/logout"
        })
    }
    return (
        <Header me={me} onLogout={onLogout} {...props} />
    )
}