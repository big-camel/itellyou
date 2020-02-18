import React , { useEffect , useState } from 'react'
import { useDispatch , useSelector } from 'dva'
import ArticleList from "@/components/Article/List"
import Loading from '@/components/Loading'
import { Button } from 'antd'

function Detail({ location:{ query } , match:{ params } }){
    const id = params.id ? parseInt(params.id) : null
    const [offset,setOffset] = useState(parseInt(query.offset || 0))
    const limit = parseInt(query.limit || 1)

    const dispatch = useDispatch()
    const detail = useSelector(state => state.column ? state.column.detail : null)
    const dataSource = useSelector(state => state.article ? state.article.list : null)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects["column/find"] || loadingEffect.effects["article/list"]
    const followLoading = loadingEffect.effects['columnStar/follow'] || loadingEffect.effects['columnStar/unfollow']

    useEffect(() => {
        dispatch({
            type:"column/detail",
            payload:{
                id
            }
        })
    },[id,dispatch])

    useEffect(() => {
        dispatch({
            type:'article/list',
            payload:{
                offset,
                limit,
                columnId:id
            }
        })
    },[offset, limit, id, dispatch])

    if(loading || !detail) return <Loading />

    const { name , description , use_star , star_count , article_count} = detail

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
        icon="star" 
        type="link" 
        size="small" 
        onClick={onStar}
        loading={followLoading}
        >
        {
            use_star ? "已关注" : "加关注"
        }({ star_count })</Button>
    }

    return (
        <div>
            <div>
                <h2>{name}</h2>
                <div>{description}</div>
                <div>
                    { renderStar() }|<span>{ article_count }篇文章</span>
                </div>
            </div>
            <ArticleList offset={offset} limit={limit} dataSource={dataSource} onChange={offset => setOffset(offset)} />
        </div>
    )
}
export default Detail