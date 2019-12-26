import React from 'react'
import DocumentTitle from 'react-document-title'
import getPageTitle from '@/utils/getPageTitle'
import defaultSettings from '../../../config/defaultSettings';

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
        }else{
            title = `${title} - ${defaultSettings.title}`
        }
        return (
            <DocumentTitle title={title}>
                <React.Fragment>
                    { children }
                </React.Fragment>
            </DocumentTitle>
        )
    }
}
export default GlobalLayout