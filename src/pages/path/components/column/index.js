import React , { useEffect } from 'react'
import { useDispatch , useSelector } from 'dva'
import { Link } from 'umi'
import { Button, Avatar } from 'antd'
import Loading from '@/components/Loading'
import Setting from './components/setting'
import List from './components/list'
import Member from './components/member'
import styles from './index.less'

export default ({ id , paths , location:{ query } }) => {
    const setting = paths && paths.length > 1 ? paths[1] : null

    const dispatch = useDispatch()
    const detail = useSelector(state => state.column.detail)
    const me = useSelector(state => state.user.me)
    
    const loadingEffect = useSelector(state => state.loading)

    const followLoading = loadingEffect.effects['columnStar/follow'] || loadingEffect.effects['columnStar/unfollow']

    useEffect(() => {
        dispatch({
            type:"column/detail",
            payload:{
                id
            }
        })
    },[dispatch, id])

    if(!detail) return <Loading />

    const { name , avatar , author , description , use_star , star_count , article_count} = detail
    
    const isAuthor = me && me.id === author.id

    const onStar = () => {
        const type = !use_star ? "follow" : "unfollow"
        dispatch({
            type:`columnStar/${type}`,
            payload:{
                id
            }
        })
    }

    const renderStar = () => {
        return <Button 
        onClick={onStar}
        loading={followLoading}
        >
        {
            use_star ? "取消关注" : "关注"
        }({ star_count })</Button>
    }

    const renderList = () => {
        return (
                <List 
                id={id}
                offset={parseInt(query.offset || 0)} 
                limit={parseInt(query.limit || 20)} 
                />
        )
    }

    const renderSetting = () => {
        return (
            <Setting { ...detail } />
        )
    }

    const child = setting ? renderSetting() : renderList()

    return (
        <div className={styles['column-layout']}>
            <div className={styles['header']}>
                <div className={styles['header-inner']}>
                    <div>
                        <h2><Link to={`/${detail.path}`}>{name}</Link></h2>
                        <div>{description}</div>
                        <Member id={id} />
                        <div>
                            { renderStar() }|<span>{ article_count }篇文章</span>
                        </div>
                        {
                            isAuthor && <Link to={`/${paths[0]}/setting`}>设置</Link>
                        }
                    </div>
                    <div>
                        <Avatar size={124} src={avatar} />
                    </div>
                </div>
            </div>
            {
                child
            }
        </div>
    )
}