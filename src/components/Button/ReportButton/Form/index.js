import React , { useRef , useState } from 'react'
import Form , { Submit } from '@/components/Form'
import formMap from './formMap'
import { useDispatch } from 'dva'
import { message, Button } from 'antd'
import styles from './index.less'

const { Desc } = Form.createItem(formMap)

export default ({ action , type , id , onBack , onCallback }) => {

    const form = useRef()
    const dispatch = useDispatch()
    const [ submiting , setSubmiting ] = useState(false)

    const handleSubmit = (err, values) => {
        if(!err){
            values.action = action
            values.type = type
            values.id = id
            setSubmiting(true)
            dispatch({
                type:'report/post',
                payload:values
            }).then(res => {
                setSubmiting(false)
                if(!res) {
                    message.error("系统错误")
                    return
                }
                if(res.result){
                    message.success("提交成功，请等待处理")
                    if(onCallback) onCallback()
                }else{
                    message.error(res.message)
                }
            })
        }
    }

    return (
        <div>
            <Form
            className={styles['form']}
            layout="vertical"
            hideRequiredMark={true}
            onSubmit={handleSubmit}
            wrappedComponentRef ={wrappedComponent => {
                form.current = wrappedComponent ? wrappedComponent.props.form : null;
            }}
            >
                <Desc 
                name="description"
                autoComplete='off' 
                />
                <div className={styles['footer']}>
                    <Button block onClick={onBack}>返回</Button>
                    <Submit loading={submiting} size="default">{submiting ? "提交中..." : "提交"}</Submit>
                </div>
            </Form>
        </div>
    )
}