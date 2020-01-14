import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';

const FormItem = Form.Item;

class WrapFormItem extends Component {

    state = {
        item:{
            isFocus:false,
            tipsVisible:false,
            tipsContent:null
        },
        capthcha:{
            defaultText:'获取验证码',
            text:null,
            secondText:'{s}s',
            loadingText:'发送中...',
            disabled:false
        }
    }
    constructor(){
        super()
        this.responseError = null
        this.requestVaildate = null
        this.isLoading = false
        this.capthchaInterval = null
        this.prevValue = null
    }

    componentWillMount(){
        const { captchaStatus,tips} = this.props
        if(captchaStatus){
            this.setState({
                capthcha:Object.assign({},this.state.capthcha,{
                    defaultText:captchaStatus.text || this.state.capthcha.defaultText,
                    secondText:captchaStatus.secondText || this.state.capthcha.secondText,
                    loadingText:captchaStatus.loadingText || this.state.capthcha.loadingText 
                })
            })
        }

        if(tips){
            this.setState({
                item:Object.assign({},this.state.item,{tipsVisible:tips.visible,tipsContent:tips.getContent})
            })
        }
    }

    componentWillUnmount(){
        if(this.capthchaInterval)
            clearInterval(this.capthchaInterval);
    }

    componentDidMount() {
        const { updateActive, name } = this.props;
        if (updateActive) {
          updateActive(name);
        }
    }

    componentWillReceiveProps({itemStatus,tips,name,form,captchaStatus }){
        if(itemStatus && itemStatus !== this.props.itemStatus){
            this.responseError = itemStatus.status ? null : itemStatus.message
            this.isLoading = itemStatus.status === 'loading'
            if(!this.isLoading){
                form.validateFields([name],{force:true})
            }
        }

        if(tips && tips !== this.props.tips){
            this.setState({
                item:Object.assign({},this.state.item,{tipsVisible:tips.visible,tipsContent:tips.getContent})
            })
        }
        if(captchaStatus && captchaStatus !== this.props.captchaStatus){
            if(captchaStatus.status === 'start' && !this.capthchaInterval){
                this.startInterval(captchaStatus.time)
            }else if(captchaStatus.status === 'stop' && this.capthchaInterval){
                clearInterval(this.capthchaInterval)
                this.capthchaInterval = null
            }
        }
    }

    handleItemValidator = (rule, value, callback) => {
        if( this.requestVaildate && rule.func){
            this.requestVaildate = false
            rule.func(value)
            return
        }else if(this.responseError){
            callback(this.responseError)
        }else if(this.isLoading){
            return
        }
        else{
            callback()
        }
    }

    handleItemFocus = (e) => {
        const { form ,name } = this.props
        if(form.getFieldError(name)){
            form.setFields({
                [name]: {
                    value:e.target.value,
                    errors: null,
                }
            });
        }
        const state = this.setTipsState({isFocus:true},'onFocus')

        this.setState({
            item:Object.assign({},this.state.item,state)
        })
        if(this.props.onFocus)
            this.props.onFocus(e)
    }

    handleItemBlur = (e) => {
        let state = {isFocus:false}
        if(this.prevValue !== e.target.value){
            if(this.responseError){
                state = Object.assign({},state,{tipsContent:null})
                this.responseError = null
            }
            this.requestVaildate = true
            this.prevValue = e.target.value
        }
        state = this.setTipsState(state,'onBlur')
        this.setState({
            item:Object.assign({},this.state.item,state)
        })
        if(this.props.onBlur)
            this.props.onBlur(e)
    }

    handleItemChange = (e) => {
        if(this.props.onChange)
            this.props.onChange(e)
    }

    setTipsState = (state,eventFunc) => {
        if(this.props.tips && (this.props.tips.show === eventFunc || this.props.tips.hide === eventFunc)){
            let tipsVisible = false
            if(this.props.tips.show === eventFunc){
                tipsVisible = true
            }
            state = Object.assign({},state,{tipsVisible})
        }
        return state
    }

    startInterval = (time) => {
        this.setState({
            capthcha:Object.assign({},this.state.capthcha,{
                disabled:true,
                text:this.state.capthcha.defaultText.replace(/{s}/g,time - Date.parse(new Date().toString()) / 1000),
            })
        })
        this.capthchaInterval = setInterval(() => {
            const s = time - Date.parse(new Date().toString()) / 1000
            if(s <= 0){
                if(this.capthchaInterval){
                    clearInterval(this.capthchaInterval)
                    this.capthchaInterval = null
                }
                this.setState({
                    capthcha:Object.assign({},this.state.capthcha,{seconds:0,disabled:false,text:null})
                })
            }else{
                this.setState({
                    capthcha:Object.assign({},this.state.capthcha,{seconds:s,text:this.state.capthcha.secondText.replace(/{s}/g,s)})
                })
            }
        })
    }

    getFormItemOptions = ({ defaultValue, customprops, rules,validateFirst,validateTrigger,ansyVaildate }) => {
        let newRules = rules || customprops.rules
        let lastRuels = []
        let haveAnsy = false
        newRules.forEach(rule => {
            if(rule.hasOwnProperty('ansyVaildate')){
                haveAnsy = true
                if(typeof(rule.ansyVaildate) === 'function'){
                    lastRuels.push({validator:this.handleItemValidator,func:rule.ansyVaildate})
                }else if(rule.ansyVaildate === true || rule.ansyVaildate === undefined || rule.ansyVaildate === null){
                    lastRuels.push({validator:this.handleItemValidator,func:ansyVaildate})
                }else if(typeof(rule.ansyVaildate) === 'number'){
                    lastRuels.push({validator:this.handleItemValidator,func:typeof(ansyVaildate) !== 'function' ? ansyVaildate[rule.ansyVaildate] : ansyVaildate})
                }
            }else{
                lastRuels.push(rule)
            }
        });
        if(!haveAnsy){
            lastRuels.push({validator:this.handleItemValidator})
        }
        const options = {
          rules: lastRuels,
          validateFirst:validateFirst || customprops.validateFirst || true,
          validateTrigger:validateTrigger || customprops.validateTrigger || 'onBlur',
        };
        options.onChange = this.handleItemChange
        options.onBlur = this.handleItemBlur
        if (defaultValue) {
          options.initialValue = defaultValue;
        }
        return options;
    };
    
    render(){

        const {
            form: { getFieldDecorator },
        } = this.props;

        const {
            label,
            onChange,
            onBlur,
            onFocus,
            customprops,
            defaultValue,
            rules,
            name,
            onGetCaptcha,
            type,
            tips,
            itemStatus,
            captchaStatus,
            ansyVaildate,
            updateActive,
            elementType,
            ...restProps
        } = this.props;
        const otherProps = restProps || {};
        const options = this.getFormItemOptions(this.props);
        const getElement = () => {
            if(elementType === "textarea"){
                return (
                    <Input.TextArea onFocus={this.handleItemFocus} {...customprops} {...otherProps}/>
                )
            }
            return (
                <Input onFocus={this.handleItemFocus} {...customprops} {...otherProps}/>
            )
        }
        if (type === 'Captcha') {
            return (
                <Row gutter={8}>
                    <Col span={14}>
                        <FormItem
                            help={this.state.item.tipsVisible ? ( tipsContent ? tipsContent : this.props.form.getFieldError(name)) : this.props.form.getFieldError(name)}
                            hasFeedback={this.props.form.isFieldValidating(name) || (!this.props.form.getFieldError(name) && !this.state.item.isFocus) ? true : false}
                        >
                            {getFieldDecorator(name, options)(
                                getElement() 
                            )}
                        </FormItem>
                    </Col>
                    <Col span={10}>
                    <Button
                        loading={captchaStatus && captchaStatus.status === 'loading'}
                        disabled={this.state.capthcha.disabled}
                        size="large"
                        type='primary'
                        block
                        onClick={onGetCaptcha}
                    >
                        {captchaStatus && captchaStatus.status === 'loading' ? this.state.capthcha.loadingText : (this.state.capthcha.text ? this.state.capthcha.text : this.state.capthcha.defaultText)}
                    </Button>
                    </Col>
                </Row>
            )
        }
        const tipsContent = this.state.item.tipsContent ? this.state.item.tipsContent(this.props.form.getFieldValue(name)) : null
        return (
            <FormItem
            label={label}
            help={this.state.item.tipsVisible ? ( tipsContent ? tipsContent : this.props.form.getFieldError(name)) : this.props.form.getFieldError(name)}
            hasFeedback={this.props.form.isFieldValidating(name) || (!this.props.form.getFieldError(name) && !this.state.item.isFocus) ? true : false}
            >
                {getFieldDecorator(name, options)(
                    getElement()
                )}
            </FormItem>
        );
    }
}

export default WrapFormItem;