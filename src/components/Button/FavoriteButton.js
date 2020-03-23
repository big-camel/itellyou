import React from 'react'
import BaseButton from './BaseButton'

function FavoriteButton({ children , ...props }){
    return <BaseButton icon="star" {...props}>
            {children}
        </BaseButton>
}
export default FavoriteButton