import React from 'react'
import BaseButton from './BaseButton'

function SupportButton({ children , ...props }){

    return <BaseButton icon="like" {...props}>
        {children}
        </BaseButton>
}
export default SupportButton