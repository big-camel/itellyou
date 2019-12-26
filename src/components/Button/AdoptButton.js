import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function AdoptButton({ children , active, ...props }){

    return <BaseButton type={active ? "primary" : "default"} {...props}><Icon type="check-circle" />{children}</BaseButton>
}
export default AdoptButton