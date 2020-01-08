import React, { useEffect , useState } from 'react'
import { PageHeader , Button , Row , Col , Tabs } from 'antd'
import { useDispatch, useSelector } from 'dva'
import { Viewer } from '@/components/Editor'
import styles from './Detail.less'
import { Link } from 'umi';
import Loading from '@/components/Loading'
const TabPane = Tabs.TabPane

function Detail ({ match:{ params }}){

    const [ followLoading , setFollowLoading ] = useState(false)

    const { id } = params

    const dispatch = useDispatch()
    const detail = useSelector(state => state.tag ? state.tag.detail : null)
    const loadingEffect = useSelector(state => state.loading)
    const loading = loadingEffect.effects["tag/find"]

    useEffect(() => {
        dispatch({
            type:'tag/find',
            payload:{
                id
            }
        })
    },[dispatch, id])

    const onSetTag = () => {
        const { id , use_star} = detail
        setFollowLoading(true)
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
                setFollowLoading(false)
            })
        }
    }

    if(!detail || loading) return <Loading />

    return (
        <Row style={{marginLeft:'-8px',marginRight:'-8px'}}>
            <Col xs={24} sm={18} style={{paddingLeft:'8px',paddingRight:'8px'}}>
                <div className={styles['detail-layout']}>
                    <PageHeader
                    className={styles['detail-header']}
                    title={<h2>{detail.name}</h2>}
                    >
                        <div>
                            {detail.description}
                        </div>
                        <Button.Group>
                            <Button icon="star" loading={followLoading} type={detail.use_star ? "primary" : "default"}  onClick={() => onSetTag()}>{detail.use_star ? '已关注' : '关注'}</Button>
                            <Button type="primary">{detail.star_count}</Button>
                        </Button.Group>
                        <Link target="_blank" to={`/tag/${detail.id}/edit`}>
                            编辑
                        </Link>
                    </PageHeader>
                    <Tabs>
                        <TabPane tab="简介" key="1">
                            {
                                <Viewer content={detail.content} />
                            }
                        </TabPane>
                    </Tabs>
                </div>
            </Col>
            <Col xs={24} sm={6} style={{paddingLeft:'8px',paddingRight:'8px'}}>dfdfsdf</Col>
        </Row>
    )
    
}
export default Detail