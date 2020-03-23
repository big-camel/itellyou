import React, { useState } from 'react'
import BaseButton from '../BaseButton'
import Modal from './Modal'
import { useSelector } from 'dva'
import { message } from 'antd'

function ReportButton({ id , type , children , ...props }){

    const [ visible , setVisible ] = useState(false)

    const me = useSelector(state => state.user.me)

    const onClick = () => {
        if(!me) {
            message.error("请登陆")
            return
        }
        setVisible(true)
    }

    const getContent = () => {
        if(children) return children
        return "举报"
    }

    return (
        <React.Fragment>
            <BaseButton onClick={onClick} icon="flag" {...props}>
            {
                getContent()
            }
            </BaseButton>
            {
                <Modal 
                id={id} 
                type={type} 
                visible={visible} 
                onVisibleChange={visible => setVisible(visible)} 
                />
            }
        </React.Fragment>
        
    )
}
export default ReportButton