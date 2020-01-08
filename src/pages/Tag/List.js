import React, { useEffect , useState} from 'react'
import { PageHeader , List , Card , Button } from 'antd'
import Loading from '@/components/Loading'
import { Link } from 'umi'
import InfiniteScroll from 'react-infinite-scroller'
import { useDispatch , useSelector } from 'dva'
import styles from './List.less'


function TagList({ location : { query }}){
    const [ page , setPage ] = useState(query.page || 1)
    const [ limit , setLimit ] = useState(query.size || 20)
    const [ offset , setOffset ] = useState((page - 1) * limit)
    const [ loading , setLoading ] = useState(false)
    const [ followLoading , setFollowLoading ] = useState({})
    const dispatch = useDispatch()
    const list = useSelector(state => state.tag ? state.tag.list : null)

    useEffect(() => {
        dispatch({
            type:'tag/list',
            payload:{
                offset,
                limit
            }
        })
    },[offset,limit,dispatch])

    const onSetTag = (id,use_star) => {
            
        setFollowLoading(loading => {
            return {
                ...loading,
                [id]:true
            }
        })
        let result = null
        if(!use_star){
            result =dispatch({
                type:'user/followTag',
                payload:{
                    id
                }
             })
         }else if(use_star){
            result = dispatch({
                type:'user/unfollowTag',
                payload:{
                    id
                }
            })
        }
        if(typeof result === "object"){
            result.then(() => {
                setFollowLoading(loading => {
                    return {
                        ...loading,
                        [id]:false
                    }
                })
            })
        }
    }

    const renderItem = tag => {
        return <List.Item
        key={tag.id}
        >
            <Card
            title={
                <Link to={`/tag/${tag.id}`}>{tag.icon}{tag.name}</Link>
            }
            className={styles['tag-card']}
            actions={
                [
                    <Button 
                    icon="star" 
                    loading={followLoading[tag.id]} 
                    type={tag.use_star ? "primary" : "default"} 
                    size="small" 
                    onClick={()=> onSetTag(tag.id,tag.use_star)}>
                    { 
                        tag.star ? "已关注" : "加关注"
                    }
                    </Button>,
                    <span className={styles['star-number']}><strong>{tag.star_count}</strong>关注</span>
                ]
            }
            >
                {
                    tag.description || "目前还没有关于这个标签的解释"
                }
                
            </Card>
        </List.Item>
    }

    const renderList = () => {
        if(!list){
            return <Loading />
        }

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
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 3,
                }}
                dataSource={list.data}
                renderItem={renderItem}
                />
                {
                    loading && <Loading />
                }
            </InfiniteScroll>
        )
    }

    return (
        <PageHeader 
            title="标签"
            subTitle={
                <p>标签不仅能组织和归类你的内容，还能关联相似的内容。<Link to="/tag">查看常用</Link></p>
            }
            className={styles['tag-list']}
            >
                {
                    renderList()
                }
        </PageHeader>
    )
    
}
export default TagList