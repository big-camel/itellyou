import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function EllipsisButton({ children , ...props }){

    return <BaseButton {...props}><Icon type="ellipsis" />{children}</BaseButton>
}
export default EllipsisButton