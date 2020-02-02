import React from 'react'
import WrapItem from '@/components/Form/WrapItem'
import FormContext from '@/components/Form/formContext'

export default map => {
    const Items = {}
    Object.keys(map).forEach(key => {
        const item = map[key]
        Items[key] = ({ rules , ...props }) => {
            if(rules && Array.isArray(rules)){
                rules.forEach(rule => {
                    if(!item.rules) item.rules = []
                    item.rules.push(rule)
                })
            }
            return (
                <FormContext.Consumer>
                    {
                        context => (
                            <WrapItem
                            customprops={item.props}
                            rules={item.rules}
                            tips={item.tips}
                            elementType={item.elementType}
                            element={item.element}
                            hasFeedback={item.hasFeedback}
                            {...props}
                            type={key}
                            form={context.form}
                        />
                    )}
                </FormContext.Consumer>
            )
        }
    })
    return Items
}