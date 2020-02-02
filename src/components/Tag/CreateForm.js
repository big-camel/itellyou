import React, { useState, useRef } from 'react'
import { Form , Row , Col , Button , message } from 'antd'
import { useDispatch } from 'dva';
import { MiniEditor } from '@itellyou/itellyou-editor'
import { EditorBiz } from '../Editor'

import TagForm , { Submit } from '@/components/Form'
import formMap from './formMap'

const { TagName } = Form.createItem(formMap)

function CreateForm({ defaultName , onCallback }){

    const form = useRef(null)
    const editor = useRef(null)
    const editorBiz = useRef(null)

    const dispatch = useDispatch()

    const [ nameStatus , setNameStatus ] = useState({
        status:null,
        message:null
    })

    const [ loading , setLoading ] = useState(false)

    const handleSubmit = (err, values) => {
        if(!err){
            const content = editor.current.getPureContent()
            if(editorBiz.current.isEmpty(content)){
                message.error("请输入描述内容")
                return
            }
            const html = editor.current.getPureHtml()
            const name = values['tag_name'].toLowerCase()
            setLoading(true)
            dispatch({
                type:"tag/create",
                payload:{
                    name,
                    content,
                    html
                }
            }).then(res => {
                setLoading(false)
                if(res.result === true){
                    form.current.resetFields()
                    if(onCallback)
                        onCallback()
                    else{
                        message.success("创建成功")
                    }
                }else if(res.status === 1001){
                    setNameStatus({
                        status:false,
                        message: res.message
                    })
                }else{
                    message.error(res.message)
                }
            })
        }
    }

    const ansyVaildate = value => {
        value = value.toLowerCase()
        dispatch({
            type:"tag/query",
            payload:{
                name:value
            }
        }).then(res => {
            if(res.result){
                setNameStatus({
                    status:false,
                    message:"当前标签不可用"
                })
            }else{
                setNameStatus({
                    status:true,
                    message:null
                })
            }
        })
    }

    const onCancel = () => {
        form.current.resetFields()
        if(onCallback)
            onCallback()
    }

    const onEditorLoaded = engine => {
        editor.current = engine
        editorBiz.current = new EditorBiz()
    }

    return(
        <TagForm
        onSubmit={handleSubmit}
        wrappedComponentRef ={wrappedComponent => {
            form.current = wrappedComponent ? wrappedComponent.props.form : null;
        }}
        >
            <TagName 
            defaultValue={defaultName}
            autoComplete='off'
            name="tag_name"
            itemStatus={nameStatus} 
            ansyVaildate={ansyVaildate} 
            />
            <div>
                <MiniEditor
                onLoad={onEditorLoaded}
                toolbar={
                    [["heading", "bold", "italic", "strikethrough", "quote"], ["codeblock", "table", "math"], ["orderedlist", "unorderedlist", "tasklist"], ["image", "video", "link", "label"]]
                }
                />
            </div>
            <Form.Item>
                <Row gutter={8}>
                    <Col span={12}>
                        <Button style={{width:'100%'}} onClick={onCancel} >取消</Button>
                    </Col>
                    <Col span={12}>
                        <Submit size={null} loading={loading}>{ loading ? '创建中...' : '提交'}</Submit>
                    </Col>
                </Row>
            </Form.Item>
        </TagForm>
    )
}

export default CreateForm