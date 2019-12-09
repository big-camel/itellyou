import React from 'react'
import { connect } from 'dva'
import Header from './Header'
import Container from '@/components/Container'
import GlobalLayout from '@/components/GlobalLayout'

class BasicLayout extends React.Component {
    componentDidMount(){
        const { dispatch , me } = this.props

        if(!me){
            dispatch({
                type: 'user/fetchMe',
            })
        }
    }

    render(){
        const { children , ...props} = this.props
        return (
            <GlobalLayout {...props}>
                <div className="main-wrapper">
                    <Header />
                    <Container >{children}</Container>
                </div>
            </GlobalLayout>
        )
    }
}

export default connect(({ user }) => ({
    me:user.me
}))(BasicLayout)
