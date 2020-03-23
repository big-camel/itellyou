import React , { useState , useRef } from 'react'
import { Modal, Button } from 'antd'
import styles from './Modal.less'
import Form from './Form'

const dataSource = [
    {
        key:"porn",
        title:"含有色情、淫秽内容"
    },
    {
        key:"antisocial",
        title:"含有反社会、血腥暴力等内容"
    },
    {
        key:"crime",
        title:"其他违法犯罪（如毒品、枪支、违规借贷等）"
    },
    {
        key:"other",
        title:"其它（如侵权、有害信息等）"
    }
]

export default ({ id , type , visible , onVisibleChange }) => {

    const [ key , setKey ] = useState()
    const [ title , setTitle ] = useState("举报")
    const [ subTitle , setSubTitle ] = useState("请选择举报原因")

    const [ step , setStep ] = useState("default")

    const onBack = () => {
        setStep("default")
    }

    const onClose = () => {
        onBack()
        onVisibleChange(false)
    }

    const selectItem = (key , title) => {
        setKey(key)
        setTitle(title)
        setSubTitle("具体说明")
        setStep("next")
    }

    const renderContent = () => {
        if(step === "next"){
            return <Form action={key} type={type} id={id} onBack={onBack} onCallback={onClose} />
        }
        return (
            <ul className={styles['content']}>
            {
                
                dataSource.map(({ key,title }) => {
                    return <li key={key} onClick={() => selectItem(key , title)}>
                        <div className={styles['content-item']}>
                        { 
                            title 
                        }
                        </div>
                    </li>
                })
            }
            </ul>
        )
    }

    return (
        <Modal
        visible={visible}
        destroyOnClose={true}
        footer={null}
        centered={true}
        width={520}
        onCancel={onClose}
        >
            <div className={styles['container']}>
                <div className={styles['title']}>{title}</div>
                <div className={styles['sub-title']}>{subTitle}</div>
                {
                    renderContent()
                }
            </div>
        </Modal>
    )
}