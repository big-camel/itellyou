import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function DeleteButton({ children , ...props }){

    return <BaseButton {...props}><Icon type="delete" theme="filled" />{children}</BaseButton>
}
export default DeleteButton