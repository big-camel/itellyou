import React, { useRef, useState , useEffect } from 'react'
import { Button , message } from 'antd'
import { useSelector } from 'dva'
import router from 'umi/router'
import Editor from '@/components/Editor'
import styles from './index.less'
import logo from '@/assets/logo.svg'
import moment from 'moment'
import Timer from '@/components/Timer'
import Loading from '@/components/Loading'

function Edit({ match:{ params } }){

    const [ id , setId ] = useState(params.id ? parseInt(params.id) : null)
    const editor = useRef(null)
    const [ content , setContent ] = useState()
    const [ loading , setLoading ] = useState(true)
    const [ saving , setSaving ] = useState(false)
    const [ publishing , setPublishing ] = useState(false)

    const doc = useSelector(state => state.doc)

    useEffect(() => {
        setContent(doc ? doc.content : "")
        if((id && doc) || !id){
            setLoading(false)
        }
    },[doc,id])

    const onEditorChange = content => {
        setContent(content)
    }

    const onSaveBefore = () => {
        setSaving(true)
    }

    const onSaveAfter = res => {
        setSaving(false)
        if(res && res.result){
            if(!id){
                const history = window.history
                setId(res.data)
                const url = `/tag/${id}/edit`
                if(history){
                    history.pushState(null, null, url)
                }else{
                    router.replace({
                        pathname:url
                    })
                }
            }
        }
    }

    const onReverted = () => {
        // 重新加载页面
        window.location.reload()
    }

    const onShowVersion = () => {
        if(editor.current){
            editor.current.showHistory()
        }
    }

    const renderSaveStatus = () => {
        if(saving){
            return '保存中...'
        }
        if(doc){
            return <span>保存于 {moment(doc.updated_time).format('H:mm:ss')}</span>
        }
       
        if(!loading && doc){
            return <span>最后更改于<Timer time={doc.updated_time} /></span> 
        }
    }

    const onPublish = () => {
        const editorBiz = editor.current ? editor.current.getEditorBiz() : null
        if(editorBiz && editorBiz.isEmpty(content)){
            message.error("请输入详情介绍")
            return
        }

        if(editor.current){
            setPublishing(true)
            editor.current.onPublish()
        }
    }

    const onPublished = res => {
        setPublishing(false)
        if(res && !res.result) {
            message.error(res.message)
            return
        }
        const collabBiz = editor.current ? editor.current.getCollabBiz() : null
        if(collabBiz){
            collabBiz.exit()
        }
        
        message.info("发布成功",1,() => {
            window.location.href = "/tag/" + res.data.id
        })
    }

    return (
        <Loading loading={loading}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <a href="/"><img src={logo} alt="" /></a>
                    </div>
                    <small><span>·</span>标签编辑<span>·</span>{doc ? doc.name : null}</small>
                    <div className={styles['save-status']}>
                        {
                            renderSaveStatus()
                        }
                    </div>
                    <div className={styles.right}>
                        {
                            doc && <Button onClick={onShowVersion}>历史</Button>
                        }
                        <Button type="primary" loading={publishing} onClick={onPublish} >{publishing ? "发布中..." : "发布"}</Button>
                    </div>
                </div>
            </header>
            <div className={styles.container}>
                <div className={styles["mini-editor"]}>
                    {
                        <Editor
                        ref={editor}
                        id={id}
                        onChange={onEditorChange}
                        onSaveBefore={onSaveBefore}
                        onSaveAfter={onSaveAfter}
                        onReverted={onReverted}
                        onPublished={onPublished}
                        />
                    }
                </div>
            </div>
        </Loading>
    )
}
export default Edit