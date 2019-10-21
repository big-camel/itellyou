import React, { Component } from 'react';
import { Form } from 'antd';
import classNames from 'classnames';
import RegisterItem from './RegisterItem';
import RegisterSubmit from '../SubmitFormItem';
import FormContext from '../formContext';
import styles from './index.less'

class Register extends Component {

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
        <div className={classNames(className, styles.registerForm)}>
          <Form onSubmit={this.handleSubmit}>
            {children}
          </Form>
        </div>
      </FormContext.Provider>
    );
  }
}

Register.Submit = RegisterSubmit;
Object.keys(RegisterItem).forEach(item => {
    Register[item] = RegisterItem[item];
});

export default Form.create()(Register);
