import React, { useState , useEffect } from 'react'
import List from './Default'
import Loading, { LoadingButton } from '../Loading'

const More = ({ dataSource , offset , limit , onChange , ...props }) => {

    offset = offset || 0
    limit = limit || 20

    const [ loading , setLoading ] = useState(false)
    onChange = onChange || function(){
        setLoading(false)
    }
    
    useEffect(() => {
        setLoading(false)
    },[dataSource])

    if(!dataSource || !dataSource.data) return <Loading />

    return (
        <React.Fragment>
            <List 
            dataSource={dataSource.data} 
            {...props}
            />
            {
                dataSource && !dataSource.end && <LoadingButton 
                loading={loading} 
                onClick={() => {
                    console.log(2342343)
                    setLoading(true)
                    onChange(offset+=limit,limit)
                }}
                />
            }
        </React.Fragment>
    )
}

More.Item = List.Item
export default More