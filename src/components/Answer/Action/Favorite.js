import React from 'react'
import { useSelector, useDispatch } from 'dva'
import { FavoriteButton } from '@/components/Button'
import { useState } from 'react'

export default ({ id , use_star , allow_star}) => {

    const dispatch = useDispatch()
    const [ following , setFollowing ] = useState(false)

    const onStar = () => {
        if(following) return
        setFollowing(true)
        const type = !use_star ? "follow" : "unfollow"
        dispatch({
            type:`answerStar/${type}`,
            payload:{
                id
            }
        }).then(() => {
            setFollowing(false)
        })
    }

    return (
        <FavoriteButton disabled={!allow_star} loading={following} onClick={onStar} >{use_star ? "取消收藏" : "收藏"}</FavoriteButton>
    )
}