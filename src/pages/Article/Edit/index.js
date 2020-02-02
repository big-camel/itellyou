import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import router from 'umi/router'
import { Button , Alert , message , Input , Form , Drawer, Radio } from 'antd'
import Editor , { EditorBiz } from '@/components/Editor'
import styles from './index.less'
import logo from '@/assets/logo.svg'
import moment from 'moment'
import Timer from '@/components/Timer'
import Loading from '@/components/Loading'
import Tag, { TagSelector } from '@/components/Tag'

const { SAVE_TYPE } = EditorBiz

function Edit({ match:{ params }}){
    const editor = useRef(null)
    const [ id , setId ] = useState(params.id ? parseInt(params.id) : null)
    const [ title , setTitle ] = useState("")
    const [ tags , setTags ] = useState([])
    const [ remark , setRemark ] = useState("")
    const [ content , setContent ] = useState("")
    const [ loading , setLoading ] = useState(true)
    const [ saving , setSaving ] = useState(false)
    const [ columnId , setColumnId ] = useState(0)
    const [ sourceType , setSourceType ] = useState("original")
    const [ sourceData , setSourceData ] = useState("")
    const [ publishing , setPublishing ] = useState(false)
    const [ drawerState , setDrawerState ] = useState(false)
    const saveCommand = useRef(false)
    const doc = useSelector(state => state.doc)
    const columnList = useSelector(state => {
        if(state.column.user) return state.column.user.data
    })

    const dispatch = useDispatch()

    useEffect(() => {
        setTitle(doc ? doc.title || "" : "")
        setTags(doc ? doc.tags || [] : [])
        setContent(doc ? doc.content || "" : "")
        setColumnId(doc && doc.column ? doc.column.id : 0)
        setSourceType(doc ? doc.source_type : 1)
        setSourceData(doc ? doc.source_data : "")
        if((id && doc) || !id){
            setLoading(false)
        }
    },[doc,id])

    useEffect(() => {
        dispatch({
            type:"column/userList"
        })
    },[dispatch])

    const onTitleChange = event => {
        setTitle(event.target.value)
    }

    const onTitleBlur = () => {
        if(title.trim() === ""){
            return
        }
        if(doc && doc.title.trim() === title.trim()){
            return
        }
        onSaveMeta()
    }

    const onEditorChange = content => {
        setContent(content)
    }

    const onSaveMeta = () => {
        if(saving){
            return
        }
        saveCommand.current = true
        editor.current.onSave(SAVE_TYPE.FORCE)
    }

    const onSaveBefore = useCallback(() => {
        setSaving(true)
        if(saveCommand.current){
            saveCommand.current = false
            return {
                title
            }
        }
    },[title])

    const onSaveAfter = res => {
        setSaving(false)
        if(res && res.result){
            if(!id){
                const history = window.history
                setId(res.data)
                const url = `/article/${res.data}/edit`
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

    const onShowDrawer = () => {
        setDrawerState(true)
    }

    const onHideDrawer = () => {
        setDrawerState(false)
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

    const onModifyReasonChange = event => {
        setRemark(event.target.value)
    }

    const onTagChange = values => {
        if(values.length === 0){
            return
        }
        const { key , label} = values[0]
        const tag = tags.find(tag => tag.name === label)
        if(!tag){
            setTags(tags => {
                return tags.concat({
                    id:key,
                    name:label
                })
            })
        }
    }

    const onTagDelete = title => {
        const tagIndex = tags.findIndex(tag => tag.name === title)
        if(tagIndex > -1){
            setTags(tags => {
                tags.splice(tagIndex,1)
                return tags.concat()
            })
        }
    }

    const renderTag = () => {
        return (
            <Form.Item
            label="设置标签"
            extra="合适的标签，能方便分类检索，也更容易让读者发现。"
            colon={false}
            >
                <div className={styles['tag-layout']}>
                    {
                        tags && tags.map(tag => (
                            <Tag key={tag.id} enableDelete title={tag.name} onDelete={() => { onTagDelete(tag.name) }} />
                        ))
                    }
                </div>
                <TagSelector 
                onChange={onTagChange}
                placeholder="搜索标签"
                />
            </Form.Item>
        )
    }

    const renderRemark = () => {
        return <Form.Item
        label="修改原因"
        colon={false}
        >
            <Input.TextArea 
            value={remark}
            onChange={onModifyReasonChange}
            autoSize={{
                minRows: 2,
                maxRows: 6
            }}
            maxLength="150"
            />
        </Form.Item>
    }

    const renderColumn = () => {
        let columns = [{ id:0 , name:"个人文章"}]
        if(columnList && columnList.length > 0)
            columns = columns.concat(columnList)
       
        return (
            <Form.Item
            label="发布到"
            colon={false}
            >
                {
                    columns && columns.length > 0 && <Radio.Group className={styles['column-layout']} onChange={event => setColumnId(parseInt(event.target.value))} value={columnId}>
                    {
                        columns.map(column => (
                            <Radio key={column.id} value={column.id}>{column.name}</Radio>
                        ))
                    }
                    </Radio.Group>
                }
                <div>
                    <Button href="/column/apply" target="_blank" icon="plus" type="link">申请专栏</Button>
                </div>
            </Form.Item>
        )
    }

    const onSourceChange = event => {
        setSourceType(event.target.value)
    }

    const renderSource = () => {
        return (
            <Form.Item
            label="文章来源"
            colon={false}
            >
                <Radio.Group className={styles['source-layout']} onChange={onSourceChange} value={sourceType}>
                    <Radio key="original" value="original">原创</Radio>
                    <Radio key="reproduced" value="reproduced">转载</Radio>
                    {
                        sourceType == "reproduced" && renderSourceData()
                    }
                    <Radio key="translation" value="translation">翻译</Radio>
                    {
                        sourceType == "translation" && renderSourceData()
                    }
                </Radio.Group>
                <div>
                    <Button href="/column/apply" target="_blank" icon="plus" type="link">申请专栏</Button>
                </div>
            </Form.Item>
        )
    }

    const renderSourceData = () => {
        return (
            <div>
                <Input value={sourceData} onChange={event => setSourceData(event.target.value) } />
            </div>
        )
    }

    const getError = () => {
        if(title.trim() === ""){
            return "你还没有添加标题"
        }

        const editorBiz = editor.current ? editor.current.getEditorBiz() : null
        if(editorBiz && editorBiz.isEmpty(content)){
            return "请输入正文"
        }

        if(tags.length === 0){
            return "请至少添加一个标签"
        }

        if(doc && doc.published && remark === ""){
            return "请填写修改原因"
        }
    }

    const onPublish = () => {
        const tag_ids = tags.map(tag => {
            return tag.id
        })
        setPublishing(true)
        if(editor.current){
            editor.current.onPublish({
                tags:tag_ids,
                columnId,
                sourceType,
                sourceData,
                remark
            })
        }
    }

    const onPublished = res => {
        setPublishing(false)
        if(!res.result) {
            return
        }
        const collabBiz = editor.current ? editor.current.getCollabBiz() : null
        if(collabBiz){
            collabBiz.exit()
        }
        
        message.info("发布成功",1,() => {
            window.location.href = "/article/" + res.data.id
        })
    }

    const error = getError()

    return (
        <Loading loading={loading}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.logo}>
                        <a href="/"><img src={logo} alt="" /></a>
                    </div>
                    <small><span>·</span>文章编辑<span>·</span>{title}</small>
                    <div className={styles['save-status']}>
                        {
                            renderSaveStatus()
                        }
                    </div>
                    <div className={styles.right}>
                        {
                            doc && <Button onClick={onShowVersion}>历史</Button>
                        }
                        <Button type="primary" onClick={onShowDrawer} >发布</Button>
                    </div>
                </div>
            </header>
            <div className={styles.container}>
                <div className={styles.title}>
                    <Input 
                    className={styles["questions-title"]}
                    size="large"
                    placeholder="请输入标题(最多50个字)" 
                    value={title}
                    onChange={onTitleChange}
                    onBlur={onTitleBlur}
                    maxLength={50}
                    />
                </div>
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
            <Drawer
            title="发布"
            placement="right"
            visible={drawerState}
            onClose={onHideDrawer}
            width="430"
            >
                <Form>
                    { 
                        renderTag() 
                    }
                    {
                        renderColumn()
                    }
                    {
                        renderSource()
                    }
                    {
                        doc && doc.published && renderRemark()
                    }
                    {
                        error && <Alert
                        description={error}
                        type="error"
                        showIcon
                        />
                    }
                    {
                        !error && <Form.Item 
                        extra="您将对提供的内容负有法律责任，对虚假和恶意营销，我们将保留追究法律责任的权利！"
                        colon={false}
                        >
                            <Button 
                            disabled={error ? true : false} 
                            loading={publishing} 
                            type="primary" 
                            onClick={onPublish}
                            style={{width:"100%"}}
                            >
                                {publishing ? '提交中...' : '发布'}
                            </Button>
                        </Form.Item>
                    }
                </Form>
            </Drawer>
        </Loading>
    )
}

export default Edit