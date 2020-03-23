import React, { useState } from 'react'
import { useDispatch } from 'dva'
import { Button, message } from 'antd'

export default ({ id , use_star , ...props }) => {
    const [ loading , setLoading ] = useState(false)

    const dispatch = useDispatch()

    const onStar = () => {
        if(loading) return
        setLoading(true)
        const type = use_star === false ? "follow" : "unfollow"
        dispatch({
            type:`userStar/${type}`,
            payload:{
                id
            }
        }).then(res => {
            setLoading(false)
            if(!res.result) message.error(res.message)
        })
    }

    return (
        <Button 
        loading={loading} 
        onClick={() => onStar()}
        {...props}
        >
        {
            use_star ? "取消关注" : "关注" 
        }
        </Button>
    )
}