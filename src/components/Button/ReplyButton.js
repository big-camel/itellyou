import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function ReplyButton({ children , ...props }){

    return <BaseButton {...props}><Icon type="rollback" />{children}</BaseButton>
}
export default ReplyButton