import React from 'react'
import { useSelector } from 'dva'
import Loading from '@/components/Loading'

export default () => {

    const me = useSelector(state => state.user ? state.user.me : null)
    if(!me) return <Loading />
    const { bank : { credit , cash } } = me
    return (
        <div>
            积分:{ credit }，现金:{ cash }
        </div>
    )
}