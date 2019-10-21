import React from 'react'
import { Layout } from 'antd'
import { connect } from 'dva'
import DocumentTitle from 'react-document-title'
import Header from './Header'
import Container from '@/components/Container'
const { Content } = Layout

class BasicLayout extends React.Component {
    componentDidMount(){
        const { dispatch , currentUser} = this.props
        if(!currentUser){
            dispatch({
                type: 'user/fetchCurrent',
            })
        }
    }

    render(){
        const { children } = this.props
        return (
            <DocumentTitle title='I TELL YOU'>
                <div className="main-wrapper">
                    <Header />
                    <Container >{children}</Container>
                </div>
            </DocumentTitle>
        )
    }
}

export default connect(({ user }) => ({
    currentUser:user.current
}))(BasicLayout)
