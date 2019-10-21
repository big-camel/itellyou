import React from 'react'
import { Viewer } from '@/components/Editor'
import {  List, Avatar, Icon, Empty, Button, Badge } from 'antd'
import Link from 'umi/link'
import { connect } from 'dva'
import Timer from '@/components/Timer'
import styles from './index.less'
import Loading from '@/components/Loading'
import { LineEditor } from '@itellyou/itellyou-editor'

class Comment extends React.Component {

    state = {
        page:1,
        size:this.props.size || 10,
        reply:[],
        edit:[]
    }

    componentDidMount(){
        const { comments } = this.props
        if(!comments)
            this.getCommentRootList()
    }

    getCommentRootList = (page=1,size=10) => {
        const { dispatch , doc_id } = this.props
        if(!doc_id)
            return
        dispatch({
            type:'comment/getRootList',
            payload:{
                doc_id,
                page,
                size
            }
        })
    }

    getCommentChildList = (comment_id,page=1,size=10) => {
        const { dispatch } = this.props
        dispatch({
            type:'comment/getChildList',
            payload:{
                page,
                size,
                comment_id
            }
        })
    }

    renderList = (header,comments) => {
        return <List 
        header={header}
        dataSource={comments.data}
        renderItem={this.renderItem}
        className={styles['comment-list']}
        />
    }

    renderItemUser = item => {
        if(item.reply){
            return <span><Link className={styles['author']} to={`/user/${item.user.user_id}`}>{item.user.nickname}</Link><label> 回复 </label><Link className={styles['author']} to={`/user/${item.reply.user_id}`}>{item.reply.nickname}</Link></span>
        }
        return <React.Fragment>
            <span><Link className={styles['author']} to={`/user/${item.user.user_id}`}>{item.user.nickname}</Link></span>
            { item.is_adopt && <span className={styles.adopt}><Icon type="check" />已采纳</span> }
        </React.Fragment>
    }

    renderItemHeader = item => {
        return (
            <div className={styles['comment-header']}>
                <Link className={styles['avatar']} to=""><Avatar size="small" alt={item.user.nickname} src="//xavatar.imedao.com/community/20190/1548723985351-1548724003475.jpg!50x50.png" /></Link>
                {this.renderItemUser(item)}
                <span className={styles['time']}><Timer time={item.created_time} /></span>
            </div>
        )
    }

    renderItemChild = item => {
        if(item.child_count > 0){
            return (
                <ul className={styles['comment-child']}>
                    {
                        item.child.map(child => {
                            return this.renderItem(child)
                        })
                    }
                    {
                        this.renderShowMoreText(item)
                    }
                </ul>
            )
        }
    }

    renderShowMoreText = item => {
        const other_count = item.child_count - item.child.length
        if(other_count > 3){
            return <div>查看全部{item.child_count}条回复</div>
        }else if(other_count > 0 && other_count <= 3){
            if(this.props.commentChildLoading){
                return <Loading />
            }
            return (
                <div onClick={() => {
                    this.getCommentChildList(item.comment_id)
                }}>展开其余{other_count}条回复</div>
            )
        }
    }

    renderItem = item => {
        return (
            <List.Item
            className={styles['comment-item']}
            key={item.comment_id}
            >
                <div className={styles['comment-body']}>
                    {this.renderItemHeader(item)}
                    <div className={styles['comment-content']}>
                        { this.renderItemContent(item) }
                    </div>
                    {this.renderItemAction(item)}
                    {this.renderItemReply(item)}
                    {this.renderItemChild(item)}
                </div>
            </List.Item>
        )
    }

    renderItemAction = item => {
        const { reply } = this.state
        const reply_item = reply.find(r => r.id === item.comment_id)

        const { edit } = this.state
        const edit_item = edit.find(e => e.id === item.comment_id)
        
        return (
            <div className={styles['comment-actions']}>
                {
                    item.allow_adopt && (<Button type="link" className={styles['active']} onClick={() => {
                        this.adoptComment(item.comment_id)
                    }} icon="check">采纳答案</Button>) }
                {
                    <Button type="link" disabled={!item.allow_oppose} className={item.is_support ? styles["active"] : ""} onClick={()=>{return (item.allow_support ? this.setSupport(item) : null)}} icon="like">{item.support_count}</Button>
                }
                {
                    <Button type="link" disabled={!item.allow_oppose} className={item.is_oppose ? styles["active"] : ""} onClick={()=>{return (item.allow_oppose ? this.setOppose(item) : null)}} icon="dislike">{item.oppose_count}</Button>
                }
                {
                    item.allow_reply && (<Button type="link" onClick={() => {
                    if(reply_item && reply_item.state){
                        this.closeReply(item.comment_id)
                    }else{
                        this.showReply(item.comment_id)
                    }
                }} icon="message">{reply_item && reply_item.state ? '取消回复' :'回复'}</Button>)}
                {item.is_hot && (item.child_count > 0 || item.parent_id !== 0) ? <Button type="link">查看回复</Button> : null}
                {item.allow_edit && <Button type="link" onClick={() => {
                    if(edit_item && edit_item.state){
                        this.closeEdit(item.comment_id)
                    }else{
                        this.showEdit(item.comment_id,item.comment_version,item.comment_content)
                    }
                }} icon="edit">{edit_item && edit_item.state ? '取消编辑' :'编辑'}</Button> }
                {item.allow_delete && !item.is_delete && <Button type="link" onClick={()=>{this.delComment(item.comment_id)}} icon="delete">删除</Button> }
                {item.allow_report && <Button type="link" icon="exclamation-circle">举报</Button>}
            </div>
        )
    }

    renderItemReply = item => {
        const { reply } = this.state
        const reply_item = reply.find(r => r.id === item.comment_id)
        if(!reply_item || !reply_item.state){
            return null
        }
        
        return <div className={styles['comment-editor']}>
                <LineEditor 
                value={reply_item.content} 
                defaultValue={reply_item.content} 
                onChange={content => {
                    this.onReplyContentChange(item.comment_id,content)
                }} 
                extra={<Button size="small" type="primary" style={{marginTop:"3px"}} disabled={reply_item.content.trim() === ""} loading={this.props.commentCreateLoading} onClick={() => {
                    this.onReply(item.comment_id)
                }}>回复</Button>}
                />
            </div>   
        
    }

    renderItemContent = item => {
        const { edit } = this.state
        const edit_item = edit.find(e => e.id === item.comment_id)
        if(!edit_item || !edit_item.state){
            return <Viewer content={item.is_delete ? "<p>评论已被删除</p>" : item.comment_content} />
        }
        
        return <div className={styles['comment-editor']}>
                <LineEditor 
                value={edit_item.content} 
                defaultValue={edit_item.content} 
                onChange={content => {
                    this.onEditContentChange(item.comment_id,content)
                }} 
                extra={<Button size="small" type="primary" style={{marginTop:"3px"}} disabled={edit_item.content.trim() === ""} loading={this.props.commentCreateLoading} onClick={() => {
                    this.onEdit(item.comment_id)
                }}>提交</Button>}
                />
            </div>   
        
    }

    onReplyContentChange = (id,value) => {
        const { reply } = this.state
        const reply_item = reply.find(r => r.id === id)
        if(reply_item){
            reply_item.content = value
            this.setState({
                reply
            })
        }
    }

    onEditContentChange = (id,value) => {
        const { edit } = this.state
        const edit_item = edit.find(e => e.id === id)
        if(edit_item){
            edit_item.content = value
            this.setState({
                edit
            })
        }
    }

    setSupport = item => {
        const { dispatch , commentSupportLoading } = this.props
        if(commentSupportLoading)
            return
        dispatch({
            type:'vote/support',
            payload:{
                comment_id:item.comment_id
            }
        })
    }

    setOppose = item => {
        const { dispatch , commentOpposeLoading } = this.props
        if(commentOpposeLoading)
            return
        dispatch({
            type:'vote/oppose',
            payload:{
                comment_id:item.comment_id
            }
        })
    }

    delComment = comment_id => {
        const { dispatch , commentDeleteLoading } = this.props
        if(commentDeleteLoading)
            return
        dispatch({
            type:'comment/delete',
            payload:{
                comment_id
            }
        })
    }

    adoptComment = comment_id => {
        const { dispatch , doc_id} = this.props
        dispatch({
            type:'comment/adopt',
            payload:{
                doc_id,
                comment_ids:[comment_id]
            }
        })
    }

    showReply = (comment_id,content=undefined) => {
        const { reply } = this.state
        const reply_item = reply.find(r => r.id === comment_id)
        if(reply_item){
            reply_item.state = true
            reply_item.content = content || reply_item.content
        }else{
            reply.push({
                id:comment_id,
                state:true,
                content:content || ""
            })
        }
        this.setState({
            reply
        })
    }

    closeReply = comment_id => {
        const { reply } = this.state
        const reply_item = reply.find(r => r.id === comment_id)
        if(reply_item){
            reply_item.state = false
            this.setState({
                reply
            })
        }
    }

    showEdit = (comment_id,comment_version,content=undefined) => {
        const { edit } = this.state
        const edit_item = edit.find(e => e.id === comment_id)
        if(edit_item){
            edit_item.state = true
            edit_item.comment_version = comment_version
            edit_item.content = content || edit_item.content
        }else{
            edit.push({
                id:comment_id,
                state:true,
                content:content || "",
                comment_version
            })
        }
        this.setState({
            edit
        })
    }

    closeEdit = comment_id => {
        const { edit } = this.state
        const edit_item = edit.find(e => e.id === comment_id)
        if(edit_item){
            edit_item.state = false
            this.setState({
                edit
            })
        }
    }

    onReply = comment_id => {
        const { dispatch  , doc_id } = this.props
        const { reply } = this.state
        const reply_item = reply.find(r => r.id === comment_id)
        if(!reply_item)
            return null
        dispatch({
            type:'comment/create',
            payload:{
                doc_id,
                comment_id,
                content:reply_item.content
            }
        }).then(res => {
            if(res.result){
                reply_item.state = false
                reply_item.content = ""
                this.setState({
                    reply
                })
            }
        })
    }

    onEdit = comment_id => {
        const { dispatch  , doc_id } = this.props
        const { edit } = this.state
        const edit_item = edit.find(e => e.id === comment_id)
      
        if(!edit_item)
            return null
        dispatch({
            type:'comment/edit',
            payload:{
                doc_id,
                comment_id,
                content:edit_item.content,
                draft_version:edit_item.comment_version
            }
        }).then(res => {
            if(res.result){
                edit_item.state = false
                edit_item.content = ""
                this.setState({
                    edit
                })
            }
        })
    }
    
    render(){
        const { commentRootList , comments , header , empty , commentRootLoading } = this.props
        if(comments){
            return this.renderList(header,comments)
        }
        if(commentRootLoading){
            return <Loading />
        }
        if(!commentRootList || commentRootList.data.length < 1){
            if(empty !== undefined){
                return empty
            }
            return <Empty />
        }
        return this.renderList(header,commentRootList)
    }
}
export default connect(({ comment , loading , user }) => ({
    commentRootList:comment.list,
    currentUser:user.current,
    commentRootLoading:loading.effects['comment/getRootList'],
    commentChildLoading:loading.effects['comment/getChildList'],
    commentCreateLoading:loading.effects['comment/create'],
    commentDeleteLoading:loading.effects['comment/delete'],
    commentSupportLoading:loading.effects['vote/support'],
    commentOpposeLoading:loading.effects['vote/oppose'],
    commentAdoptLoading:loading.effects['comment/adopt']
}))(Comment)