import React from 'react'
import { ConfigProvider } from 'antd'
import DocumentTitle from 'react-document-title'
import getPageTitle from '@/utils/getPageTitle'

class GlobalLayout extends React.Component {

    render(){
        const {
            route = {
                routes: []
            }
        } = this.props

        const { routes = [] } = route
        const {
            children,
            location = {
                pathname: ''
            }
        } = this.props
        let { title } = this.props
        if(!title){
            const breadcrumbNameMap = {}
            if(this.props.route && !this.props.route.routes){
                routes.push(this.props.route)
            }
            routes.forEach(item => {
                if(item && item.name && item.path){
                    breadcrumbNameMap[item.path] = item
                }
            })
            title = getPageTitle(location.pathname , breadcrumbNameMap)
        }
     
        return <DocumentTitle title={title}>
                { children }
        </DocumentTitle>
    }
}
export default GlobalLayout