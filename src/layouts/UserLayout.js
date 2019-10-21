import React from 'react'
import { Row, Col } from 'antd'
import { connect } from 'dva'
import DocumentTitle from 'react-document-title'
import { ContainerQuery } from 'react-container-query'
import Header from './Header'
import Container from '@/components/Container'
import UserMenu from '@/components/UserMenu'

const query = {
    'middle': {
        minWidth: 1200,
        maxWidth: 1999,
    },
    'wider': {
        minWidth: 2000,
    },
}

class UserLayout extends React.Component {
    componentDidMount(){
        const { dispatch } = this.props
      
        dispatch({
            type: 'user/fetchCurrent',
        })
    }

    render(){
        const { children } = this.props
        return (
            <DocumentTitle title='I TELL YOU'>
                <ContainerQuery query={query}>
                    {params => (
                        <React.Fragment>
                            <Header mode={params}/>
                            <div className="main-wrapper">
                                <Container mode={params}>
                                    <Row style={{marginLeft:'-8px',marginRight:'-8px'}}>
                                        <Col xs={24} sm={4} style={{paddingLeft:'8px',paddingRight:'8px'}}>
                                           <UserMenu />
                                        </Col>
                                        <Col xs={24} sm={20} style={{paddingLeft:'8px',paddingRight:'8px'}}>{children}</Col>
                                    </Row>
                                </Container>
                            </div>
                        </React.Fragment>
                    )}
                </ContainerQuery>
            </DocumentTitle>
        )
    }
}

export default connect(({ user }) => ({
    user
}))(UserLayout)
