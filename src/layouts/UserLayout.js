import React from 'react'
import { Row, Col } from 'antd'
import { ContainerQuery } from 'react-container-query'
import Header from './Header'
import BlankLayout from '@/layouts/BlankLayout'
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

function UserLayout({ route , children }){

    return (
        <BlankLayout route={route}>
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
        </BlankLayout>
    )
}

export default UserLayout
