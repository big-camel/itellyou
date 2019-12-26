import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function ShareButton({ children , ...props }){

    return <BaseButton {...props}><Icon type="share-alt" />{children}</BaseButton>
}
export default ShareButton