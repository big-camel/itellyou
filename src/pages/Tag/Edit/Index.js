import React, { useRef, useState } from 'react'
import { Button , Modal , message, Icon , Popover , Input , Form , Row , Col } from 'antd'
import { connect, useSelector } from 'dva'
import router from 'umi/router'
import Editor , { EditorBiz } from '@/components/Editor'
import styles from './Index.less'
import logo from '@/assets/logo.svg'
import { Link } from 'umi'
import moment from 'moment'
import Timer from '@/components/Timer'
import Loading from '@/components/Loading'
import GlobalLayout from '@/components/GlobalLayout'

function Index({ match:{ params } , ...props }){

    let { id } = params

    const editor = useRef(null)
    const [ content , setContent ] = useState()
    const [ loading , setLoading ] = useState(true)
    const [ saving , setSaving ] = useState(false)
    const [ publishing , setPublishing ] = useState(false)

    const doc = useSelector(state => state.doc)

    const onEditorLoad = engine => {
        editor.current = engine
    }

    const onEditorChange = content => {
        setContent(content)
    }

    const onDocLoad = () => {
        const collabBiz = editor ? editor.current.getCollabBiz() : null
        const document = collabBiz ? collabBiz.getInitialDocument() : null
        setContent(document ? document.value : "")
        setLoading(false)
    }

    const onSaveBefore = () => {
        setSaving(true)
    }

    const onSaveAfter = res => {
        setSaving(false)
        if(res && res.result){
            if(!id){
                const history = window.history
                id = res.data
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
        if(editor){
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
            window.location.href = "/tag/" + id
        })
    }

    return (
        <GlobalLayout {...props}>
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
                            id={id}
                            onLoad={onEditorLoad}
                            onDocLoad={onDocLoad}
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
        </GlobalLayout>
    )
}
export default Index