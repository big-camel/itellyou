import React, { Component } from 'react'
import { Form } from 'antd';
import classNames from 'classnames'
import Submit from './Submit'
import Tab from './Tab'
import TabForm from './TabForm'
import FormContext from './formContext'
import formItem from './formItem'
import styles from './index.less'

class FormComponent extends Component {

    getContext = () => {
        const { form } = this.props;
        return {
            form,
        }
    };

    handleSubmit = e => {
        e.preventDefault()
        const { form, onSubmit } = this.props
        form.validateFields((err, values) => {
            onSubmit(err, values)
        })
    };

    render() {
        const { className, children , onSubmit , form , ...props} = this.props;
        return (
            <FormContext.Provider value={this.getContext()}>
                <div className={classNames(className, styles.tagForm)}>
                <Form onSubmit={this.handleSubmit} {...props}>
                    {children}
                </Form>
                </div>
            </FormContext.Provider>
        )
    }
}

FormComponent.createItem = formItem

export default Form.create()(FormComponent)
export {
    Submit,
    Tab,
    TabForm
}
