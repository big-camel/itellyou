import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function OpposeButton({ children , ...props }){

    return <BaseButton {...props}><Icon type="dislike" theme="filled" />{children}</BaseButton>
}
export default OpposeButton