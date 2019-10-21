import React from 'react'
import { connect } from 'dva'
import Link from 'umi/link'
import { Row, Col , Tabs , List, Avatar, Icon } from 'antd'
import Loading from '@/components/Loading'
import Timer from '@/components/Timer'
import styles from './Index.less'
const TabPane = Tabs.TabPane

class Index extends React.Component {

    state = {
        size:10,
        page:1,
    }

    componentWillMount(){
        const { location:{ query } } = this.props
        const { page } = query
        this.setState({
            page: parseInt(page || 1)
        })
    }

    componentDidMount(){
        this.getListData()
    }

    getListData = () => {
        const { dispatch } = this.props
        const { page , size } = this.state
        dispatch({
            type:'question/getList',
            payload:{
                page,
                size
            }
        })
    }

    onPageChange = page => {
        this.setState({
            page
        },
        ()=>{
            this.getListData()
        })
    }

    getRewardTip = item => {
        if(item.reward.type === 0)
            return
        let type = "积分"
        if(item.reward.type === 2){
            type = "现金"
        }
        return <span>悬赏 {item.reward.value} {type}</span>
    }

    renderList = () => {
        const { list,listLoading } = this.props
        if(!list || listLoading){
            return <Loading />
        }
        const { page=page || 1 , size = size || 10 , total=total || 0 } = list
        
        return <List 
        pagination={{
            onChange:this.onPageChange,
            current:page,
            pageSize:size,
            total,
            itemRender:(page,type) => {
                let pageText = page
                if(type === "prev")
                    pageText = "上一页"
                else if(type === "next")
                    pageText = "下一页"
                else if(type === "jump-prev" || type === "jump-next")
                    pageText = <Icon type="ellipsis" />
                return (
                    <Link to={`/question?page=${page}`}>{pageText}</Link>
                )
            }
        }}
        dataSource={list.data}
        renderItem={item => (
            <List.Item
            key={item.question_id}
            >
            <div>
                {
                    item.tags && item.tags.length > 0 && (
                        <div className={styles.tags}>
                            {
                                item.tags.map(tag => (
                                    <Link key={tag.key} target="_blank" to={`/tag/${tag.name}`}>{tag.name}</Link>
                                ))
                            }
                            {
                                this.getRewardTip(item)
                            }
                        </div>
                    )
                }
                <h4 className={styles.title}>
                    <Link target="_blank" to={`/question/${item.question_id}`}>{item.question_title}</Link>
                </h4>
                <div className={styles.actions}>
                    <div className={styles.author}>
                        <Link to=""><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></Link>
                        <Link to="">{item.user.nickname}</Link>
                    </div>
                    <span>发布于 <Timer time={item.created_time} /></span>
                    <span><Icon type="eye" />{item.page_view}</span>
                    <span><Icon type="message" />{item.answer_count}</span>
                    <span><Icon type="heart" /></span>
                </div>
            </div>
            </List.Item>
        )}
        />
    }

    render(){
        return (
            <Row style={{marginLeft:'-8px',marginRight:'-8px'}}>
                <Col xs={24} sm={18} style={{paddingLeft:'8px',paddingRight:'8px'}}>
                    <Tabs>
                        <TabPane tab="最新问答" key="1">
                            { this.renderList() }
                        </TabPane>
                        <TabPane tab="Tab 2" key="2">
2
                        </TabPane>
                        <TabPane tab="Tab 3" key="3">
3
                        </TabPane>
                    </Tabs>
                </Col>
                <Col xs={24} sm={6} style={{paddingLeft:'8px',paddingRight:'8px'}}>dfdfsdf</Col>
            </Row>
        )
    }
}
export default connect(({ question ,loading }) => ({
    list:question.list,
    listLoading:loading.effects['question/getList']
}))(Index)