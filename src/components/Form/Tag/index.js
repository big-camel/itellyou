import React, { Component } from 'react';
import { Form } from 'antd';
import classNames from 'classnames';
import TagItem from './TagItem';
import TagSubmit from '../SubmitFormItem';
import FormContext from '../formContext';
import styles from './index.less'

class Tag extends Component {

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

Tag.Submit = TagSubmit;
Object.keys(TagItem).forEach(item => {
    Tag[item] = TagItem[item];
});

export default Form.create()(Tag)
