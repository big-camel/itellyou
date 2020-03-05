import React from 'react'
import Header from '@/components/Header'
import Container from '@/components/Container'
import BlankLayout from '@/layouts/BlankLayout'

function BasicLayout({ route , children , ...props }){
    return (
        <BlankLayout route={route}>
            <div className="main-wrapper">
                <Header {...props} />
                <Container >{children}</Container>
            </div>
        </BlankLayout>
    )
}

export default BasicLayout
