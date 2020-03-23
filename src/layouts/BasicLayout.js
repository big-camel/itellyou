import React from 'react'
import Header from '@/components/Header'
import Container from '@/components/Container'
import BlankLayout from '@/layouts/BlankLayout'
import Footer from '@/components/Footer'

function BasicLayout({ route , children , ...props }){
    return (
        <BlankLayout route={route}>
            <Header {...props} />
            <div className="main-wrapper">
                <Container >{children}</Container>
            </div>
            <Footer />
        </BlankLayout>
    )
}

export default BasicLayout
