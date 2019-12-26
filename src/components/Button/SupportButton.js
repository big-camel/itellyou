import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function SupportButton({ children , ...props }){

    return <BaseButton {...props}><Icon type="like" theme="filled" />{children}</BaseButton>
}
export default SupportButton