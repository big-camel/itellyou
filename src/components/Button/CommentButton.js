import React from 'react'
import BaseButton from './BaseButton'

function CommentButton({ count , children , ...props }){

    const getContent = () => {
        if(children) return children
        return count === 0 || !count ? "添加评论" : `${count}条评论`
    }
    return <BaseButton icon="message" {...props}>
        {
            getContent()
        }
    </BaseButton>
}
export default CommentButton