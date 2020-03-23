import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import Loading from '@/components/Loading'

export default () => {
    const dispatch = useDispatch()
    const bank = useSelector(state => state.bank.detail)
    useEffect(() => {
        dispatch({
            type:'bank/info'
        })
    },[dispatch])

    if(!bank) return <Loading />
    
    const { credit , cash } = bank
    return (
        <div>
            积分:{ credit }，现金:{ cash }
        </div>
    )
}