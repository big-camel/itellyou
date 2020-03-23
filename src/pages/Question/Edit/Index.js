import React, { useState , useRef , useEffect , useCallback } from 'react'
import { useSelector, useDispatch } from 'dva'
import router from 'umi/router'
import { Button , Alert , message , Input , Form , Radio, InputNumber, Icon, Drawer } from 'antd'
import Editor , { EditorBiz } from '@/components/Editor'
import styles from './index.less'
import logo from '@/assets/logo.svg'
import moment from 'moment'
import Timer from '@/components/Timer'
import Loading from '@/components/Loading'
import Tag, { TagSelector } from '@/components/Tag'

const { SAVE_TYPE } = EditorBiz

function Edit({ match:{ params }}) {

    const editor = useRef(null)
    const [ id , setId ] = useState(params.id ? parseInt(params.id) : null)
    const [ title , setTitle ] = useState("")
    const [ tags , setTags ] = useState([])
    const [ remark , setRemark ] = useState("")
    const [ reward , setReward ] = useState({})
    const [ content , setContent ] = useState("")
    const [ loading , setLoading ] = useState(true)
    const [ saving , setSaving ] = useState(false)
    const [ publishing , setPublishing ] = useState(false)
    const [ drawerState , setDrawerState ] = useState(false)
    const saveCommand = useRef(false)

    const dispatch = useDispatch()

    const doc = useSelector(state => state.doc)
    const rewardConfig = useSelector(state => {
        if(state.reward) return state.reward.config
    })
    const bank = useSelector(state => state.bank.detail) || {}

    useEffect(() => {
        dispatch({
            type:"reward/findConfig"
        })
        dispatch({
            type:"bank/info"
        })
    },[dispatch])
    
    useEffect(() => {
        setTitle(doc ? doc.title : "")
        setTags(doc ? doc.tags : [])
        setContent(doc ? doc.content : "")
        setReward(value => {
            return doc ? {
                type:doc.reward_type,
                value:doc.reward_value
            } : value
        })
        if((id && doc) || !id){
            setLoading(false)
        }
    },[doc, id])

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
                const url = `/question/${res.data}/edit`
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
            extra="合适的标签，能方便分类检索，提问也更容易让回答者发现。"
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

    const onRewardValueChange = value => {
        setReward(({ type }) => {
            return {
                type,
                value
            }
        })
    }

    const onRewardTypeChange = event => {
        const type = parseInt(event.target.value)
        let value = 0 
        if(type === 1)
            value = 5
        else if(type === 2)
            value = 1
        setReward({
            type,
            value
        })
    }

    const renderReward = () => {
        if(!rewardConfig) return
        const { cash , credit } = rewardConfig
        const getRadioDisabled = type => {
            if(doc && doc.reward_type !== 0 && doc.reward_type !== type){
                return true
            }
            return false
        }
        return <Form.Item
        label={`设置悬赏，积分：${bank.credit}，金额：${bank.cash}`}
        extra="合理的悬赏，能快速得到解答。7天内未被回答，费用将自动退回"
        colon={false}
        >
            <div className={styles['reward-layout']}>
                {
                    doc && doc.reward_type !== 0 && 
                    <p>当前已设置<span>{doc.reward_type === 1 ? '积分' : '现金'}悬赏</span><span>{doc.reward_value}{doc.reward_type === 1 ? credit.unit : cash.unit}</span>，您可以继续增加悬赏</p>
                }
                <Radio.Group value={ reward.type } onChange={onRewardTypeChange}>
                    <Radio.Button value={0}>不设置</Radio.Button>
                    <Radio.Button disabled={getRadioDisabled(1)} value={1}>积分</Radio.Button>
                    <Radio.Button disabled={getRadioDisabled(2)} value={2}>现金</Radio.Button>
                </Radio.Group>
                <div>
                { reward.type === 2 && 
                    <InputNumber 
                    min={cash.min}
                    max={bank.cash > cash.max ? cash.max : bank.cash}
                    precision={2}
                    value={reward.value}
                    onChange={onRewardValueChange} 
                    formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/￥\s?|(,*)/g, '')}
                    />
                }

                { reward.type === 1 && 
                    <InputNumber 
                    min={credit.min}
                    max={bank.credit > credit.max ? credit.max : bank.credit}
                    precision={0}
                    value={reward.value}
                    onChange={onRewardValueChange} 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\s?|(,*)/g, '')}
                    />
                }
                </div>
            </div>
        </Form.Item>
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

    const getError = () => {
        const titleText = title.trim()
        if(titleText === ""){
            return "你还没有添加标题"
        }

        if(["?","？"].indexOf(titleText.substr(titleText.length - 1,1)) < 0){
            return "你还没有给问题添加问号"
        }

        const editorBiz = editor.current ? editor.current.getEditorBiz() : null
        if(editorBiz && editorBiz.isEmpty(content)){
            return "请详细说明问题"
        }

        if(tags.length === 0){
            return "请至少添加一个标签"
        }

        if(doc && doc.published && remark === ""){
            return "请填写修改原因"
        }

        if(reward.type === 1 && reward.value > bank.credit){
            return "积分余额不足"
        }

        if(reward.type === 2 && reward.value > bank.cash){
            return "现金余额不足"
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
                reward,
                remark
            })
        }
    }

    const onPublished = res => {
        setPublishing(false)
        if(!res.result) {
            if(res.status === 1001 || res.status === 1002){
                const { credit , cash } = res.data
                dispatch({
                    type:"user/setBank",
                    data:{
                        credit,
                        cash
                    }
                })
            }
            return
        }
        const collabBiz = editor.current ? editor.current.getCollabBiz() : null
        if(collabBiz){
            collabBiz.exit()
        }
        
        message.info("发布成功",1,() => {
            window.location.href = "/question/" + res.data.id
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
                    <small><span>·</span>提问编辑</small>
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
                    placeholder="一句话完整的描述你的问题" 
                    value={title}
                    onChange={onTitleChange}
                    onBlur={onTitleBlur}
                    maxLength={50}
                    />
                </div>
                <Alert 
                showIcon={false} 
                type="tip" 
                message={
                    <div className={styles['title-tip']}>
                        <p className={styles['tip-header']}><Icon type="question-circle" />   让你的提问获得更多解答</p>
                        <p className={styles["tip-item"]}>· 问题是什么，你想得到什么帮助，以“？”结束</p>
                        <p className={styles["tip-item"]}>· 保持文字简练，表述清晰问题的关键点</p>
                        <p className={styles["tip-item"]}>· 添加合适的标签，让问题更好地流通</p>
                    </div>
                } 
                banner 
                closable 
                />
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
            title="发布提问"
            placement="right"
            visible={drawerState}
            onClose={onHideDrawer}
            width="430"
            >
                <Form>
                    { renderTag() }
                    { renderReward() }
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