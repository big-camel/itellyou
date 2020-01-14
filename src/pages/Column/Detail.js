import React , { useEffect , useState } from 'react'
import { useDispatch , useSelector } from 'dva'
import ArticleList from "@/components/Article/List"
import Loading from '@/components/Loading'

function Detail({ location:{ query } , match:{ params } }){
    const id = params.id ? parseInt(params.id) : null
    const [offset,setOffset] = useState(parseInt(query.offset || 0))
    const limit = parseInt(query.limit || 1)

    const dispatch = useDispatch()
    const detail = useSelector(state => state.column ? state.column.detail : null)
    const dataSource = useSelector(state => state.article ? state.article.list : null)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects["column/find"] || loadingEffect.effects["article/list"]

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

    return (
        <div>
            <div>
                <h2>{detail.name}</h2>
                <div>{detail.description}</div>
                <div>
                    <span>{ detail.star_count }人关注</span>|<span>{ detail.article_count }篇文章</span>
                </div>
            </div>
            <ArticleList offset={offset} limit={limit} dataSource={dataSource} onChange={offset => setOffset(offset)} />
        </div>
    )
}
export default Detail