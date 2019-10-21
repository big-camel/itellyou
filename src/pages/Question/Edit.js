import React from 'react'
import DocumentTitle from 'react-document-title'
import classNames from 'classnames'
import { Button , Modal , message , Popover , Input , Form , Radio, InputNumber } from 'antd'
import { connect } from 'dva'
import router from 'umi/router'
import Editor , { History, Doc } from '@/components/Editor'
import styles from './Edit.less'
import logo from '@/assets/logo.svg'
import moment from 'moment'
import Timer from '@/components/Timer'
import Tag, { TagSelector } from '@/components/Tag'

class Edit extends React.Component {

    state = {
        //标题
        title:"",
        content:"",
        loading:true,
        // 是否为查看历史状态
        versionsStatus: false,
        // 是否正在保存
        saving: false,
        // 保存时间
        saved: null,
        // 发布设置状态
        publishing:false,
        modifyReason:"",
        //tag
        tags:[],
        //step
        step_type:"tag",
        // 悬赏
        reward:{
            type:0,
            value:0
        }
    }

    onTitleChange = event => {
        const title = event.target.value
        this.setState({
            title
        })
    }

    onTitleBlur = () => {
        const { title } = this.state
        const { detail } = this.props
        if(title.trim() === ""){
            return
        }
        if(detail && detail.title.trim() === title.trim()){
            return
        }
        this.onSaveMeta()
    }

    onEditorLoad = instance => {
        this.editorInstance = instance
        const { detail } = this.props
        this.setState({
            title:detail ? detail.title : this.state.title,
            tags:detail ? detail.tags : [],
            loading:false
        })
    }

    onEditorChange = content => {
        this.setState({
            content
        })
    }

    onSaveMeta = () => {
        const { saving } = this.state
        
        if(saving){
            return
        }

        this.save_command = true
        this.editorInstance.onSave(Doc.SAVE_TYPE.USER_SAVE)
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

    onSaveAfter = (res,action) => {
        if(res && res.result){
            if(action === "create"){
                const history = window.history
                const url = `/question/${res.data.doc_id}/edit`
                if(history){
                    history.pushState(null, null, url)
                }else{
                    router.replace({
                        pathname:url
                    })
                }
            }
            this.setState({
                saving: false,
                saved: new Date()
            })
        }else{
            this.setState({
                saving: false
            })
        }
        
    }

    onReverted = () => {
        // 清空本地存储
        this.editorInstance.editorBiz.clearCachedContent()
        // 强制退出编辑
        this.editorInstance.onForceLeaveEditor()
        message.success('文档恢复成功', 1.5, () => {
            // 关闭浮层
            this.setState({
                versionsStatus: false
            })
            // 重新加载页面
            window.location.reload()
        })
    }

    onCancelVersionView = () => {
        this.setState({
            enabledVersionConflict:false,
            disabled:false,
            isActive:true
        })
    }

    onShowVersion = () => {
        this.setState({
            versionsStatus:true
        })
    }
    
    renderSaveStatus = () => {
        const { loading , saving , saved } = this.state
        if(saving){
            return '保存中...'
        }
        const { detail } = this.props
        if(saved && detail){
            return <span>保存于 {moment(saved).format('H:mm:ss')}</span>
        }
       
        if(!loading && detail){
            return <span>最后更改于<Timer time={detail.updated_time} /></span> 
        }
    }

    onModifyReasonChange = event => {
        this.setState({
            modifyReason:event.target.value
        })
    }

    onPublish = async () => {
        const { dispatch , detail } = this.props
        const { modifyReason , tags , reward , saving } = this.state
        const tag_ids = tags.map(tag => {
            return tag.key
        })
        this.setState({
            publishing:true,
        })

        //如果正在保存中，等待保存
        if(saving){
            const savingWait = () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        if(!this.state.saving){
                            resolve()
                        }
                    }, 10)
                })
            }
            await savingWait()
        }

        dispatch({
            type:"doc/publish",
            payload:{
                doc_id:detail.doc_id,
                tag_ids,
                reward,
                modify_reason:modifyReason
            }
        }).then(res => {
            this.setState({
                publishing:false,
            })
            if(res.result){
                this.editorInstance.onForceLeaveEditor()
                message.success("发布成功",5)
                //window.location.href = "/"
            }else{
                message.error(res.message)
            }
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
                key,
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

    onStepChange = type => {
        this.setState({
            step_type:type
        })
    }

    renderPublishStep = () => {
        const { step_type } = this.state
        return (
            <div className={styles['publish-step']}>
                { step_type === "tag" && this.renderPublishStepTag () }
                { step_type === "reward" && this.renderPublishStepReward () }
                { step_type === "reason" && this.renderPublishStepReason () }
            </div>
        )
    }

    renderPublishStepTag = () => {
        const { detail } = this.props
        const { tags } = this.state
        const getNext = () => {
            if(detail && detail.adopt_state === 1){
                return this.renderStepButton('next','reason',tags.length === 0)
            }
            return this.renderStepButton('next','reward',tags.length === 0)
        }
        
        return (
            <div className={styles['setp-layout-tag']}>
                <p className={styles['setp-tip']}>绑定合适的标签，能方便分类检索，提问也更容易让回答者发现。</p>
                <div className={styles['setp-tags']}>
                {
                    
                    tags.map(tag => (
                        <Tag key={tag.key} enableDelete title={tag.name} onDelete={() => { this.onTagDelete(tag.name) }} />
                    ))
                }
                </div>
                <TagSelector 
                onChange={this.onTagChange}
                placeholder="搜索标签"
                />
                <div className={classNames(styles['step-actions'],'clearfix')}>
                    { getNext() }
                </div>
            </div>
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

    renderPublishStepReward = () => {
        const { reward } = this.state
        const { detail } = this.props
        const getRadioDisabled = type => {
            if(detail && detail.reward.type !== 0 && detail.reward.type !== type){
                return true
            }
            return false
        }

        return (
            <div className={styles['setp-layout-reward']}>
                <p className={styles['setp-tip']}>设置合理的悬赏，能快速得到解答。7天内未被回答，费用将自动退回</p>
                <div className={styles['reward-body']}>
                    {
                        detail && detail.reward.type !== 0 && 
                        <p>当前已设置<span>{detail.reward.type === 1 ? '积分' : '现金'}悬赏</span><span>{detail.reward.value}{detail.reward.type === 1 ? '' : '元'}</span>，您可以继续增加悬赏</p>
                    }
                    <Radio.Group value={ reward.type } onChange={this.onRewardTypeChange}>
                        <Radio.Button value={0}>不设置</Radio.Button>
                        <Radio.Button disabled={getRadioDisabled(1)} value={1}>积分</Radio.Button>
                        <Radio.Button disabled={getRadioDisabled(2)} value={2}>现金</Radio.Button>
                    </Radio.Group>
                    <div>
                    {
                        reward.type === 0 && <p className={styles['setp-tip']}>设置合理的悬赏，能快速得到解答。7天内未被回答，费用将自动退回</p>
                    }
                    { reward.type === 2 && 
                        <InputNumber 
                        min={1}
                        max={200}
                        precision={2}
                        value={reward.value}
                        onChange={this.onRewardValueChange} 
                        formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/￥\s?|(,*)/g, '')}
                        />
                    }

                    { reward.type === 1 && 
                        <InputNumber 
                        min={5}
                        max={200}
                        precision={0}
                        value={reward.value}
                        onChange={this.onRewardValueChange} 
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\s?|(,*)/g, '')}
                        />
                    }
                    </div>
                </div>
                <div className={classNames(styles['step-actions'],'clearfix')}>
                    { this.renderStepButton('prev','tag') }
                    { (!detail || !detail.is_publish) && this.renderStepButton('publish') }
                    { detail && detail.is_publish && this.renderStepButton('next','reason') }
                </div>
            </div>
        )
    }

    renderPublishStepReason = () => {
        return (
            <Form>
                <Form.Item
                label="修改原因"
                colon={false}
                >
                    <Input.TextArea 
                    value={this.state.modifyReason}
                    onChange={this.onModifyReasonChange}
                    autosize={{
                        minRows: 3,
                        maxRows: 6
                    }}
                    maxLength="150"
                    />
                    <p className={styles['reason-tip']}>请确保您提交的内容真实有效，您将对提供的内容负有法律责任，对虚假和恶意营销，我们将保留追究法律责任的权利！</p>
                </Form.Item>
                <div className={classNames(styles['step-actions'],'clearfix')}>
                    {   this.renderStepButton('prev','reward')  }
                    {
                        this.renderStepButton('publish')
                    }
                </div>
            </Form>
        )
    }

    renderStepButton = (type , key , disabled ) => {
        if(type === "next"){
            return <Button disabled={disabled} className={styles['action-next']} onClick={() => {this.onStepChange(key) }}>下一步</Button>
        }
        if(type === "prev"){
            return <Button disabled={disabled} className={styles['action-prev']} onClick={() => {this.onStepChange(key) }}>返回</Button>
        }
        if(type === "publish"){
            const { publishing } = this.state
            return <Button disabled={disabled} className={styles['action-publish']} loading={publishing} type="primary" onClick={() => { this.editorInstance.onSave(Doc.SAVE_TYPE.USER_PUBLISH,this.onPublish) }}>{publishing ? '提交中...' : '发布'}</Button>
        }
    }

    render(){
        const { loading , content , title } = this.state
        const { detail , match:{ params } } = this.props
        let doc_id = params.question_id
        if(detail){
            doc_id = detail.question_id
        }
        const disabled = title === "" || (this.editorInstance && this.editorInstance.editorBiz && this.editorInstance.editorBiz.isEmpty(content))
        return (
            <DocumentTitle title='I TELL YOU'>
                <React.Fragment>
                    <header className={styles.header}>
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <a href="/"><img src={logo} alt="" /></a>
                            </div>
                            <small><span>·</span>编辑<span>·</span>{this.tagName}</small>
                            <div className={styles['save-status']}>
                                {
                                    this.renderSaveStatus()
                                }
                            </div>
                            <div className={styles.right}>
                                {
                                    detail &&
                                    <Button type="ghost" onClick={this.onShowVersion}>历史</Button>
                                }
                                <Popover
                                overlayClassName={styles["publish-popover"]}
                                title="发布提问"
                                trigger="click"
                                placement="bottomRight"
                                content={this.renderPublishStep()}
                                >
                                    <Button disabled={disabled} type="primary">提交发布</Button>
                                </Popover>
                            </div>
                        </div>
                    </header>
                    <div className={styles.container}>
                        {
                        loading === false && <div className={styles.title}>
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
                        }
                        <div className={styles["mini-editor"]}>
                            <Editor 
                            doc_id={doc_id} 
                            type="mini"
                            onLoad={this.onEditorLoad}
                            onChange={this.onEditorChange}
                            onSaveBefore={this.onSaveBefore}
                            onSaveAfter={this.onSaveAfter}
                            />
                            { 
                                this.state.versionsStatus &&  
                                <Modal 
                                className={styles['doc-history-modal']}
                                width={1080}
                                style={{
                                    top: 56
                                }}
                                title={null}
                                footer={null}
                                visible={true}
                                closable={false}
                                onCancel={() => {
                                    this.setState({
                                        versionsStatus: false
                                    })
                                }}
                                >
                                    <History 
                                    doc_id={detail.question_id}
                                    onRollback={this.onReverted}
                                    onCancel={() => {
                                        this.setState({
                                            versionsStatus: false
                                        })
                                    }}
                                    />
                                </Modal>
                            }
                        </div>
                    </div>
                </React.Fragment>
            </DocumentTitle>
        )
    }
}
export default connect(({ doc }) => ({
    detail:doc.detail,
    editStatus:doc.editStatus || {}
}))(Edit)