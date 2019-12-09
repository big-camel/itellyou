import React from 'react'
import classnames from 'classnames'
import { Popover, Button, Icon } from 'antd'
import TagSelector from './Selector'
import TagCreateForm from './CreateForm'
import Loading from '@/components/Loading'
import styles from './index.less'
import { Link } from 'umi'
import { connect } from 'dva'

class Tag extends React.Component {

    renderLink = () => {
        const { href , target , className , icon , title , enableDelete , onDelete } = this.props
        return (
            <Link
            to={href}
            target={target}
            className={classnames(className,styles.tag)}
            >
                {icon}
                {title}
                {
                    enableDelete && <Icon type="close" onClick={() => { if(onDelete) onDelete(title) }} />
                }
            </Link>
        )
    }

    renderSpan = () => {
        const { className , icon , title , enableDelete , onDelete } = this.props
        return (
            <span
            className={classnames(className,styles.tag)}
            >
                {icon}
                {title}
                {
                    enableDelete && <Icon type="close"  onClick={() => { if(onDelete) onDelete(title) }}/>
                }
            </span>
        )
    }

    renderTag = () => {
        const { href } = this.props
        if(href !== undefined){
            return this.renderLink()
        }else{
            return this.renderSpan()
        }
    }

    renderPopoverContent = () => {
        const { tagDetail,tagDetailLoading , tagSetLoading , tagDelLoading } = this.props
        if(!tagDetail || tagDetailLoading){
            return <Loading />
        }
        const actionLoading = tagSetLoading || tagDelLoading
        return (
            <div className={styles['popover-layout']}>
                <h2 className={styles['popover-title']}>{tagDetail.name}</h2>
                <div className={styles['popover-content']}>
                    {tagDetail.tag_summary || "暂无介绍"}
                </div>
                <div className={styles['popover-footer']}>
                    <div className={styles['popover-link']}>
                        <Link target="_blank" to={`/tag/${encodeURIComponent(tagDetail.name)}`}>查看</Link>
                        <Link target="_blank" to="">编辑</Link>
                    </div>
                    <div className={styles['popover-star']}>
                        <span>{tagDetail.star_count}人</span>
                        <Button icon="star" loading={actionLoading} type={tagDetail.star === true ? 'primary' : 'default'} onClick={this.onSetTag}>{ tagDetail.star === true ? '已关注' : '关注'}</Button>
                    </div>
                </div>
            </div>
        )
    }

    onSetTag = () => {
        const { onSet , tagDetail , dispatch } = this.props
        if(onSet){
            onSet()
        }else if(tagDetail && !tagDetail.star){
            dispatch({
                type:'user/setTag',
                payload:{
                    tags:[tagDetail.id]
                }
            })
        }else if(tagDetail && tagDetail.star){
            dispatch({
                type:'user/delTag',
                payload:{
                    tags:[tagDetail.id]
                }
            })
        }
    }
    
    onVisibleChange = visible => {
        const { onLoad , dispatch , title } = this.props
        if(visible){
            if(onLoad){
                onLoad(title)
            }else{
                dispatch({
                    type:'tag/query',
                    payload:{
                        name:title
                    }
                })
            }
        }
    }

    renderPopoverTag = () => {
        return (
            <Popover
            target="hover"
            mouseEnterDelay={1}
            onVisibleChange={this.onVisibleChange}
            content={
                this.renderPopoverContent()
            }
            >
                {this.renderTag()}
            </Popover>
        )
    }

    render (){
        return (
            this.renderPopoverTag()
        )
    }
}
Tag.defaultProps = {
    enableDelete:false
}
export default connect(({ tag ,loading }) => ({
    tagDetail:tag.detail,
    tagDetailLoading:loading.effects['tag/query'],
    tagSetLoading:loading.effects['user/setTag'],
    tagDelLoading:loading.effects['user/delTag']
}))(Tag)

export {
    TagSelector,
    TagCreateForm
}