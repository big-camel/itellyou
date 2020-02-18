import React from 'react'
import { Layout } from '@/components/Container'
import siderData from './sider'

export default ({ children , defaultKey }) => {

    return (
        <Layout siderData={siderData} siderKey={defaultKey}>
            { 
                children
            }
        </Layout>
    )
}