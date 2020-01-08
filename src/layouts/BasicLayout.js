import React from 'react'
import { connect } from 'dva'
import Header from './Header'
import Container from '@/components/Container'
import GlobalLayout from '@/components/GlobalLayout'

class BasicLayout extends React.Component {

    render(){
        const { children , ...props} = this.props
        return (
            <GlobalLayout {...props}>
                <div className="main-wrapper">
                    <Header {...props} />
                    <Container >{children}</Container>
                </div>
            </GlobalLayout>
        )
    }
}

export default BasicLayout
