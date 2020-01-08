import React , { useEffect, useState } from 'react'
import { List , Card , PageHeader , Empty , message} from 'antd'
import { useDispatch, useSelector } from 'dva'
import Tag , { TagSelector } from '@/components/Tag'
import Loading from '@/components/Loading'
import styles from './Index.less'
import { Link } from 'umi'

function Index(){

    const [ loading , setLoading ] = useState(false)
    const dispatch = useDispatch()
    const tag = useSelector(state => state.tag)

    const user = useSelector(state => state.user)
    const loadingEffect = useSelector(state => state.loading)
    
    useEffect(() => {
        dispatch({
            type:"tag/group"
        })
        dispatch({
            type:"user/tag"
        })
    },[dispatch])

    const renderGroupList = () => {
        const groupLoading = loadingEffect.effects['tag/group']
        const { group } = tag || {}
        if(!group || groupLoading){
            return <Loading />
        }

        return <List 
        grid={{ gutter: 16, column: 4 }}
        dataSource={group.data}
        renderItem={item => (
            <List.Item
            key={item.id}
            >
            <Card
            title={item.name}
            className={styles['tag-card']}
            bordered={false}
            >
                {
                    item.tag_list && item.tag_list.map(tag => (
                        <Tag
                        className={styles['tag-item']}
                        key={tag.id} 
                        id={tag.id}
                        href={`/tag/${tag.id}`}
                        title={tag.name}
                        />
                    ))
                }
                
            </Card>
            </List.Item>
        )}
        />
    }

    const onTagChange = values => {
        if(values.length === 0 || loading){
            return
        }
        setLoading(true)
        const messageClose = message.loading("关注中...")
        const { key } = values[0]
        dispatch({
            type:"user/followTag",
            payload:{
                id:key
            }
        }).then(() => {
            setLoading(false)
            messageClose()
        })
    }

    const renderUserTag = () => {
        if(!user.me) return
        const userTagLoading = loadingEffect.effects['user/tag']
        if(userTagLoading) return <Loading />
        const userTag = user.tag || {}
        return (
            <PageHeader title="我的关注" className={styles['tag-header']}>
                <div>
                    <TagSelector 
                    onChange={onTagChange}
                    placeholder="添加关注标签"
                    />
                </div>
                <div className={styles['tag-me-list']}>
                    {
                        userTag.data && userTag.data.map(tag => (
                            <Tag 
                            className={styles['tag-item']} 
                            key={tag.id} 
                            id={tag.id}
                            href={`/tag/${tag.id}`} 
                            title={tag.name}
                            />
                        ))
                    }
                    {
                        !userTag.total || userTag.total === 0 && (
                            <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="您还未关注任何标签哦~"
                            />
                        )
                    }
                </div>
            </PageHeader>
    )
    }
    
    return (
        <div className={styles['tag-layout']}>
            { 
                renderUserTag()
            }
            <PageHeader 
            title="常用标签"
            subTitle={
                <p>标签不仅能组织和归类你的内容，还能关联相似的内容。<Link to="/tag/list">查看全部</Link></p>
            }
            className={styles['tag-group-list']}>
                { 
                    renderGroupList() 
                }
            </PageHeader>
        </div>
    )
}
export default Index