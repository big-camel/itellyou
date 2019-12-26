import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function CommentButton({ children , ...props }){

    return <BaseButton {...props}><Icon type="message" theme="filled" />{children}</BaseButton>
}
export default CommentButton