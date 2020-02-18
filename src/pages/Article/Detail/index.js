import React , { useEffect , useState } from 'react'
import { useDispatch, useSelector } from 'dva'
import { Link } from 'umi'
import { Row , Col , Button , Avatar, Icon } from 'antd'
import DocumentTitle from 'react-document-title'
import { SupportButton , OpposeButton , FavoriteButton, CommentButton, ShareButton , ReportButton , EllipsisButton } from '@/components/Button'
import { Viewer } from '@/components/Editor'
import Timer from '@/components/Timer'
import Tag from '@/components/Tag'
import Loading from '@/components/Loading'
import Comment from './Comment'
import styles from './index.less'

function Detail({ match:{ params }}){
    const id = params.id ? parseInt(params.id) : null

    const dispatch = useDispatch()
    const { detail } = useSelector(state => state.article)
    const loading = useSelector(state => state.loading)
    const followLoading = loading.effects['articleStar/follow'] || loading.effects['articleStar/unfollow']
    
    useEffect(() => {
        dispatch({
            type:'article/view',
            payload:{
                id
            }
        })
        dispatch({
            type:"article/find",
            payload:{
                id
            }
        })
    },[dispatch, id])

    if(!detail) return <Loading />

    const onStar = () => {
        const type = !use_star ? "follow" : "unfollow"
        dispatch({
            type:`articleStar/${type}`,
            payload:{
                id
            }
        })
    }

    const { title , column , tags , use_star } = detail
    return (
        <DocumentTitle title={title}>
            <Row gutter={50}>
                <Col xs={24} sm={18}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            {title}
                        </h2>
                        <div className={styles.tags}>
                            {
                                tags && (
                                    tags.map(tag => (
                                        <span  key={tag.id} className={styles.tag}><Tag href={`/tag/${encodeURIComponent(tag.name)}`} title={tag.name} /></span>
                                    ))
                                )
                            }
                            <span className={styles['view']}>{detail.view}次浏览</span>
                        </div>
                        <div className={styles.author}>
                            <Avatar size={40} shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            <div className={styles.info}>
                                <Link to="">{detail.author ? detail.author.name : null}</Link>
                                <div>
                                    <Timer time={detail.created_time} />
                                    {
                                        column && <span>发布于 {column.name}</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <article>
                        <Viewer content={detail.content} />
                    </article>
                    <div className={styles.actions}>
                        
                        <CommentButton>{`${detail.comment_count} 条评论`}</CommentButton>
                        <FavoriteButton loading={followLoading} onClick={onStar} >{use_star ? "取消收藏" : "收藏"}</FavoriteButton>
                        <ShareButton>分享</ShareButton>
                        <ReportButton>举报</ReportButton>
                        
                    </div>
                    {
                        <Comment articleId={id} />
                    }
                </Col>
                <Col xs={24} sm={6}>dfdfsdf</Col>
            </Row>
        </DocumentTitle>
    )
}
export default Detail