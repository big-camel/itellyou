import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function FavoriteButton({ children , ...props }){

    return <BaseButton {...props}><Icon type="star" theme="filled" />{children}</BaseButton>
}
export default FavoriteButton