import React from 'react'
import { PageHeader , Button , Row , Col , Tabs } from 'antd'
import { connect } from 'dva'
import { Viewer } from '@/components/Editor'
import styles from './Detail.less'
import { Link } from 'umi';
const TabPane = Tabs.TabPane

class Detail extends React.Component {

    componentWillMount(){
        const { match:{ params } } = this.props
        this.tagName = decodeURIComponent(params.tagName)
    }

    componentDidMount(){
        const { dispatch } = this.props
        dispatch({
            type:'tag/query',
            payload:{
                tag_name:this.tagName
            }
        })
    }

    starTag = () => {
        const { tagDetail , dispatch } = this.props
        dispatch({
            type:'user/setTag',
            payload:{
                tags:[tagDetail.tag_id]
            }
        })
    }

    delStarTag = () => {
        const { tagDetail , dispatch } = this.props
        dispatch({
            type:'user/delTag',
            payload:{
                tags:[tagDetail.tag_id]
            }
        })
    }

    render(){
        const { tagDetail , starLoading , delStarLoading , currentUser } = this.props
        return (
            <Row style={{marginLeft:'-8px',marginRight:'-8px'}}>
                <Col xs={24} sm={18} style={{paddingLeft:'8px',paddingRight:'8px'}}>
                <div className={styles['detail-layout']}>
                {
                    tagDetail && (
                    <PageHeader
                    className={styles['detail-header']}
                    title={<h2>{tagDetail.tag_name}</h2>}
                    >
                        <div>
                            {tagDetail.tag_summary}
                        </div>
                        <Button.Group>
                            <Button icon="star" loading={tagDetail.star ? delStarLoading : starLoading} type="primary" onClick={tagDetail.star ? this.delStarTag : this.starTag}>{tagDetail.star ? '已关注' : '关注'}</Button>
                            <Button type="primary">{tagDetail.star_count}</Button>
                        </Button.Group>
                        <Link target="_blank" to={`/tag/${tagDetail.tag_id}/edit`}>
                            <Button icon="edit" type="ghost" onClick={this.onEditClick}>编辑</Button>
                        </Link>
                        {
                            (currentUser && currentUser.authority === "admin") && (
                                <Link to="/tag/review">审核</Link>
                            )
                        }
                    </PageHeader>
                    )
                }
                    <Tabs>
                        <TabPane tab="简介" key="1">
                            {
                                tagDetail && (
                                    <Viewer content={tagDetail.body_asl} />
                                )
                            }
                        </TabPane>
                    </Tabs>
                </div>
                </Col>
                <Col xs={24} sm={6} style={{paddingLeft:'8px',paddingRight:'8px'}}>dfdfsdf</Col>
            </Row>
        )
    }
}
export default connect(({ tag,user,loading }) => ({
    tagDetail:tag.detail,
    tagLoading:loading.effects['tag/query'],
    starLoading:loading.effects['user/setTag'],
    delStarLoading:loading.effects['user/delTag'],
    currentUser:user.current
}))(Detail)