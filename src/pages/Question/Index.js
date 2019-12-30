import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import Link from 'umi/link'
import InfiniteScroll from 'react-infinite-scroller'
import { Row, Col , Tabs , List, Avatar, Icon, Button } from 'antd'
import Loading from '@/components/Loading'
import Timer from '@/components/Timer'
import styles from './Index.less'
const TabPane = Tabs.TabPane

function Index({ location:{ query } , match:{ params }  }){

    const [offset,setOffset] = useState(parseInt(query.offset || 0))
    const [loading,setLoading] = useState(false)
    const limit = parseInt(query.limit || 20)
    const type = params.type || "default"

    const dispatch = useDispatch()
    const list = useSelector(state => state.question ? state.question.list : null)
    const user = useSelector(state => state.user ? state.user.me : null)
    
    useEffect(() => {
        dispatch({
            type:'question/list',
            payload:{
                offset,
                limit,
                type
            }
        }).then(() => {
            setLoading(false)
        })
    },[offset, limit, type, dispatch])

    const getRewardTip = item => {
        if(item.reward_type === 0)
            return
        let type = "积分"
        if(item.reward_type === 2){
            type = "现金"
        }
        return <span>悬赏 {item.reward_value} {type}</span>
    }

    const renderItem = ({ id , tags , title , author ,...item}) => {
        return (
            <List.Item
            key={id}
            >
                {
                    tags && tags.length > 0 && (
                        <div className={styles.tags}>
                            {
                                tags.map(tag => (
                                    <Link key={tag.id} target="_blank" to={`/tag/${tag.name}`}>{tag.name}</Link>
                                ))
                            }
                            {
                                getRewardTip(item)
                            }
                        </div>
                    )
                }
                <h4 className={styles.title}>
                    <Link target="_blank" to={`/question/${id}`}>{title}</Link>
                </h4>
                <div className={styles.actions}>
                    <div className={styles.author}>
                        <Link to=""><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></Link>
                        <Link to="">{author.name}</Link>
                    </div>
                    <span>发布于 <Timer time={item.created_time} /></span>
                    <span><Icon type="eye" />{item.view}</span>
                    <span><Icon type="message" />{item.answers}</span>
                    <span><Icon type="heart" /></span>
                </div>
            </List.Item>
        )
    }

    const renderList = () => {
        if(!list) return <Loading />
        
        return (
            <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            loadMore={() => {
                setLoading(true)
                setOffset(offset + limit)
            }}
            hasMore={!loading && !list.end}
            useWindow={true}
            >
                <List 
                dataSource={list.data}
                renderItem={renderItem}
                itemLayout="vertical"
                />
            </InfiniteScroll>
        )
    }

    return (
        <Row style={{marginLeft:'-8px',marginRight:'-8px'}}>
            <Col xs={24} sm={18} style={{paddingLeft:'8px',paddingRight:'8px'}}>
                <div>
                    <Button icon="edit">提问题</Button>
                    <div>
                        <Link to="/question/hot">热门回答</Link>
                        <Link to="/question/reward">悬赏问答</Link>
                        <Link to="/question">最新问答</Link>
                        <Link to="/question/star">我的关注</Link>
                    </div>
                </div>
                <div>
                    { renderList() }
                </div>
            </Col>
            <Col xs={24} sm={6} style={{paddingLeft:'8px',paddingRight:'8px'}}>dfdfsdf</Col>
        </Row>
    )
}
export default Index