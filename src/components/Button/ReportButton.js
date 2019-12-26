import React from 'react'
import { Icon } from 'antd'
import BaseButton from './BaseButton'

function ReportButton({ children , ...props }){

    return <BaseButton {...props}><Icon type="flag" theme="filled" />{children}</BaseButton>
}
export default ReportButton