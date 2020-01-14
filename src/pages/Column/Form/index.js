import React, { Component } from 'react';
import { Form } from 'antd';
import classNames from 'classnames';
import Item from './Item';
import Submit from '@/components/Form/SubmitFormItem';
import FormContext from '@/components/Form/formContext';
import styles from './index.less'

class Column extends Component {

    getContext = () => {
        const { form } = this.props;
        return {
            form,
        };
    };

    handleSubmit = e => {
        e.preventDefault();
        const { form, onSubmit } = this.props;
        form.validateFields((err, values) => {
            onSubmit(err, values);
        });
    };

    render() {
        const { className, children } = this.props;
        return (
        <FormContext.Provider value={this.getContext()}>
            <div className={classNames(className, styles.tagForm)}>
            <Form onSubmit={this.handleSubmit}>
                {children}
            </Form>
            </div>
        </FormContext.Provider>
        );
    }
}

Column.Submit = Submit
Object.keys(Item).forEach(item => {
    Column[item] = Item[item]
});

export default Form.create()(Column)
