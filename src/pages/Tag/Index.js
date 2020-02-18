import React , { useEffect, useState } from 'react'
import { List , Card , PageHeader , Empty , message} from 'antd'
import { useDispatch, useSelector } from 'dva'
import Tag , { TagSelector } from '@/components/Tag'
import Loading from '@/components/Loading'
import styles from './index.less'
import { Link } from 'umi'

function Index(){

    const [ loading , setLoading ] = useState(false)
    const dispatch = useDispatch()
    const tag = useSelector(state => state.tag)

    const user = useSelector(state => state.user)
    const tagStar = useSelector(state => state.tagStar.list)
    const loadingEffect = useSelector(state => state.loading)
    
    useEffect(() => {
        dispatch({
            type:"tag/group"
        })
        dispatch({
            type:"tagStar/list"
        })
    },[dispatch])

    const onStarChange = (id,use_star,star_count) => {
        dispatch({
            type:'tag/replaceItem',
            payload:{
                id,
                use_star,
                star_count
            }
        })
    }

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
                    item.tag_list && item.tag_list.map(({ id , name }) => (
                        <Tag
                        className={styles['tag-item']}
                        key={id} 
                        id={id}
                        href={`/tag/${id}`}
                        title={name}
                        onChange={(star,count) => {
                            onStarChange(id,star,count)
                        }}
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
            type:"tagStar/follow",
            payload:{
                id:parseInt(key)
            }
        }).then(() => {
            setLoading(false)
            messageClose()
        })
    }

    const renderUserTag = () => {
        if(!user.me) return
        const tagStarLoading = loadingEffect.effects['tagStar/list']
        if(!tagStar || tagStarLoading) return <Loading />
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
                        tagStar.data && tagStar.data.map(({ tag : { id , name }}) => (
                            <Tag 
                            className={styles['tag-item']} 
                            key={`u_${id}`} 
                            id={id}
                            href={`/tag/${id}`} 
                            title={name}
                            onChange={(star,count) => {
                                onStarChange(id,star,count)
                            }}
                            />
                        ))
                    }
                    {
                        !tagStar.total || tagStar.total === 0 && (
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