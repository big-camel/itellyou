import React from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import { Button , Alert , message , Input , Form , Radio, InputNumber, Icon, Drawer } from 'antd'
import Editor , { EditorBiz } from '@/components/Editor'
import styles from './Index.less'
import logo from '@/assets/logo.svg'
import moment from 'moment'
import Timer from '@/components/Timer'
import Loading from '@/components/Loading'
import Tag, { TagSelector } from '@/components/Tag'
import GlobalLayout from '@/components/GlobalLayout'

const { SAVE_TYPE } = EditorBiz

class Edit extends React.Component {

    state = {
        //标题
        title:"",
        content:"",
        loading:true,
        // 是否正在保存
        saving: false,
        // 保存时间
        saved: null,
        // 发布设置状态
        publishing:false,
        remark:"",
        //tag
        tags:[],
        // 悬赏
        reward:{
            type:0,
            value:0
        },
        drawerView:false
    }

    componentWillMount(){
        const { match:{ params } } = this.props
        this.question_id = params.question_id
    }

    onTitleChange = event => {
        const title = event.target.value
        this.setState({
            title
        })
    }

    onTitleBlur = () => {
        const { title } = this.state
        const { doc } = this.props
        if(title.trim() === ""){
            return
        }
        if(doc && doc.title.trim() === title.trim()){
            return
        }
        this.onSaveMeta()
    }

    onEditorLoad = editor => {
        this.editor = editor
    }

    onEditorChange = content => {
        this.setState({
            content
        })
    }

    onDocLoad = () => {
        const { doc } = this.props
        const collabBiz = this.editor ? this.editor.getCollabBiz() : null
        const document = collabBiz ? collabBiz.getInitialDocument() : null
        this.setState({
            title:doc ? doc.title : this.state.title,
            tags:doc ? doc.tags : [],
            content:document ? document.value : "",
            reward:doc ? {
                type:doc.reward_type,
                value:doc.reward_value
            } : this.state.reward,
            loading:false
        })
    }

    onSaveMeta = () => {
        const { saving } = this.state
        
        if(saving){
            return
        }

        this.save_command = true
        this.editor.onSave(SAVE_TYPE.FORCE)
    }

    onSaveBefore = () => {
        this.setState({
            saving: true
        })
        if(this.save_command){
            const { title } = this.state
            this.save_command = false
            return {
                title
            }
        }
    }

    onSaveAfter = res => {
        if(res && res.result){
            this.setState({
                saving: false,
                saved: new Date()
            })
            if(!this.question_id){
                const history = window.history
                this.question_id = res.data
                const url = `/question/${res.data}/edit`
                if(history){
                    history.pushState(null, null, url)
                }else{
                    router.replace({
                        pathname:url
                    })
                }
            }
        }else{
            this.setState({
                saving: false
            })
        }
    }

    onReverted = () => {
        // 重新加载页面
        window.location.reload()
    }

    onShowVersion = () => {
        if(this.editor){
            this.editor.showHistory()
        }
    }

    onShowDrawer = () => {
        this.setState({
            drawerView:true
        })
    }

    onHideDrawer = () => {
        this.setState({
            drawerView:false
        })
    }
    
    renderSaveStatus = () => {
        const { loading , saving , saved } = this.state
        if(saving){
            return '保存中...'
        }
        const { doc } = this.props
        if(saved && doc){
            return <span>保存于 {moment(saved).format('H:mm:ss')}</span>
        }
       
        if(!loading && doc){
            return <span>最后更改于<Timer time={doc.updated_time} /></span> 
        }
    }

    onModifyReasonChange = event => {
        this.setState({
            remark:event.target.value
        })
    }

    onTagChange = values => {
        if(values.length === 0){
            return
        }
        const { key , label} = values[0]
        const { tags } = this.state
        const tag = tags.find(tag => tag.name === label)
        if(!tag){
            tags.push({
                id:key,
                name:label
            })
            this.setState({
                tags
            })
        }
    }

    onTagDelete = title => {
        const { tags } = this.state
        const tagIndex = tags.findIndex(tag => tag.name === title)
        if(tagIndex > -1){
            tags.splice(tagIndex,1)
            this.setState({
                tags
            })
        }
    }

    renderTag = () => {
        const { tags } = this.state
        return (
            <Form.Item
            label="设置标签"
            extra="合适的标签，能方便分类检索，提问也更容易让回答者发现。"
            colon={false}
            >
                <div className={styles['tag-layout']}>
                    {
                        tags && tags.map(tag => (
                            <Tag key={tag.id} enableDelete title={tag.name} onDelete={() => { this.onTagDelete(tag.name) }} />
                        ))
                    }
                </div>
                <TagSelector 
                onChange={this.onTagChange}
                placeholder="搜索标签"
                />
            </Form.Item>
        )
    }

    onRewardValueChange = value => {
        const { reward : { type } } = this.state
        this.setState({
            reward:{
                type,
                value
            }
        })
    }

    onRewardTypeChange = event => {
        const type = parseInt(event.target.value)
        let value = 0 
        if(type === 1)
            value = 5
        else if(type === 2)
            value = 1
        this.setState({
            reward:{
                type,
                value,
            }
        })
    }

    renderReward = () => {
        const { reward } = this.state
        const { doc , me , rewardConfig } = this.props
        const { cash , credit } = rewardConfig
        const getRadioDisabled = type => {
            if(doc && doc.reward_type !== 0 && doc.reward_type !== type){
                return true
            }
            return false
        }
        return <Form.Item
        label={`设置悬赏，积分：${me.bank.credit}，金额：${me.bank.cash}`}
        extra="合理的悬赏，能快速得到解答。7天内未被回答，费用将自动退回"
        colon={false}
        >
            <div className={styles['reward-layout']}>
                {
                    doc && doc.reward_type !== 0 && 
                    <p>当前已设置<span>{doc.reward_type === 1 ? '积分' : '现金'}悬赏</span><span>{doc.reward_value}{doc.reward_type === 1 ? credit.unit : cash.unit}</span>，您可以继续增加悬赏</p>
                }
                <Radio.Group value={ reward.type } onChange={this.onRewardTypeChange}>
                    <Radio.Button value={0}>不设置</Radio.Button>
                    <Radio.Button disabled={getRadioDisabled(1)} value={1}>积分</Radio.Button>
                    <Radio.Button disabled={getRadioDisabled(2)} value={2}>现金</Radio.Button>
                </Radio.Group>
                <div>
                { reward.type === 2 && 
                    <InputNumber 
                    min={cash.min}
                    max={me.bank.cash > cash.max ? cash.max : me.bank.cash}
                    precision={2}
                    value={reward.value}
                    onChange={this.onRewardValueChange} 
                    formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/￥\s?|(,*)/g, '')}
                    />
                }

                { reward.type === 1 && 
                    <InputNumber 
                    min={credit.min}
                    max={me.bank.credit > credit.max ? credit.max : me.bank.credit}
                    precision={0}
                    value={reward.value}
                    onChange={this.onRewardValueChange} 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\s?|(,*)/g, '')}
                    />
                }
                </div>
            </div>
        </Form.Item>
    }

    renderRemark = () => {
        return <Form.Item
        label="修改原因"
        colon={false}
        >
            <Input.TextArea 
            value={this.state.remark}
            onChange={this.onModifyReasonChange}
            autoSize={{
                minRows: 2,
                maxRows: 6
            }}
            maxLength="150"
            />
        </Form.Item>
    }

    getError = () => {
        const { content , tags , remark , reward } = this.state
        const { doc , me } = this.props
        const title = this.state.title.trim()
        if(title === ""){
            return "你还没有添加标题"
        }

        if(["?","？"].indexOf(title.substr(title.length - 1,1)) < 0){
            return "你还没有给问题添加问号"
        }

        const editorBiz = this.editor ? this.editor.getEditorBiz() : null
        if(editorBiz && editorBiz.isEmpty(content)){
            return "请详细说明问题"
        }

        if(tags.length === 0){
            return "请至少添加一个标签"
        }

        if(doc && doc.published && remark === ""){
            return "请填写修改原因"
        }

        if(reward.type === 1 && me && reward.value > me.bank.credit){
            return "积分余额不足"
        }

        if(reward.type === 2 && me && reward.value > me.bank.cash){
            return "现金余额不足"
        }
    }

    onPublish = () => {
        const { remark , tags , reward } = this.state
        const tag_ids = tags.map(tag => {
            return tag.id
        })
        this.setState({
            publishing:true,
        })
        if(this.editor){
            this.editor.onPublish({
                tags:tag_ids,
                reward,
                remark
            })
        }
    }

    onPublished = res => {
        this.setState({
            publishing:false,
        })
        if(!res.result) {
            if(res.status === 1001 || res.status === 1002){
                const { dispatch } = this.props
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
        const collabBiz = this.editor ? this.editor.getCollabBiz() : null
        if(collabBiz){
            collabBiz.exit()
        }
        
        const { doc } = this.props
        message.info("发布成功",1,() => {
            window.location.href = "/question/" + doc.id
        })
    }

    render(){
        const { drawerView , publishing , loading} = this.state
        const { doc , ...otherProps} = this.props

        const error = this.getError()

        return (
            <GlobalLayout {...otherProps}>
                <Loading loading={loading}>
                    <header className={styles.header}>
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <a href="/"><img src={logo} alt="" /></a>
                            </div>
                            <small><span>·</span>提问编辑<span>·</span>{this.tagName}</small>
                            <div className={styles['save-status']}>
                                {
                                    this.renderSaveStatus()
                                }
                            </div>
                            <div className={styles.right}>
                                {
                                    doc && <Button onClick={this.onShowVersion}>历史</Button>
                                }
                                <Button type="primary" onClick={this.onShowDrawer} >发布</Button>
                            </div>
                        </div>
                    </header>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            <Input 
                            className={styles["questions-title"]}
                            size="large"
                            placeholder="一句话完整的描述你的问题" 
                            value={this.state.title}
                            onChange={this.onTitleChange}
                            onBlur={this.onTitleBlur}
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
                                id={this.question_id}
                                onLoad={this.onEditorLoad}
                                onDocLoad={this.onDocLoad}
                                onChange={this.onEditorChange}
                                onSaveBefore={this.onSaveBefore}
                                onSaveAfter={this.onSaveAfter}
                                onReverted={this.onReverted}
                                onPublished={this.onPublished}
                                />
                            }
                        </div>
                    </div>
                    <Drawer
                    title="发布提问"
                    placement="right"
                    visible={drawerView}
                    onClose={this.onHideDrawer}
                    width="430"
                    >
                        <Form>
                            { this.renderTag() }
                            { this.renderReward() }
                            {
                                doc && doc.published && this.renderRemark()
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
                                    onClick={this.onPublish}
                                    style={{width:"100%"}}
                                    >
                                        {publishing ? '提交中...' : '发布'}
                                    </Button>
                                </Form.Item>
                            }
                            
                        </Form>
                    </Drawer>
                </Loading>
            </GlobalLayout>
        )
    }
}

export default connect(({ doc , user , reward }) => ({
    doc,
    me : user.me ,
    rewardConfig:reward.config
}))(Edit)