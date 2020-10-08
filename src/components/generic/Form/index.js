import React from 'react'
import {
  Form as AntForm,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Checkbox,
  Upload,
} from 'antd'
import moment from 'moment'
import QRScanner from 'components/generic/QRScanner'
import countries from './countries.json'
import './style.css'
import RemoteSelect from './remoteSelect'

const formItemLayout = {
  labelCol: { md: 8 },
  wrapperCol: { md: 12 },
}

const formItemLayoutSmall = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const formTailLayout = {
  wrapperCol: { md: { span: 16, offset: 8 } },
}

const formTailLayoutSmall = {
  wrapperCol: { span: 24 },
}

@AntForm.create()
class Form extends React.Component {
  handleSubmit = e => {
    e.preventDefault()

    const { form, onSubmit, onError } = this.props

    form.validateFields((errors, values) => {
      if (!errors && onSubmit) {
        onSubmit(values)
      } else if (onError) {
        onError(errors)
      }
    })
  }

  handleOnChange = field => {
    const {
      form: { getFieldsValue, setFieldsValue },
      onChange,
    } = this.props

    if (onChange) {
      // handle state update delays
      setTimeout(() => {
        onChange(field, getFieldsValue(), setFieldsValue)
      }, 1)
    }
  }

  getQRScanner = field => {
    const {
      form: { setFieldsValue },
    } = this.props

    const handleScan = data => {
      if (data) {
        setFieldsValue({
          [field]: data,
        })
        // manually trigger on change after scan
        this.handleOnChange(field)
      }
    }

    return <QRScanner className="ant-input-search-button" onScan={handleScan} />
  }

  getSelectItem = itemConfig => {
    const { field, type, placeholder, options, disabled } = itemConfig

    const select = mode => (
      <Select
        mode={mode}
        showSearch
        placeholder={placeholder}
        disabled={disabled}
        onChange={() => this.handleOnChange(field)}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {options.map(option => {
          const isString = typeof option === 'string'

          return (
            <Select.Option key={option} value={isString ? option : option.value}>
              {isString ? option : option.text}
            </Select.Option>
          )
        })}
      </Select>
    )

    return select(type)
  }

  getCountrySelectItem = (itemConfig, longNames = false) => {
    return this.getSelectItem({
      ...itemConfig,
      type: 'select',
      options: longNames ? countries : countries.map(country => country.value),
    })
  }

  getPrefixSelector = () => {
    const {
      form: { getFieldDecorator },
      values,
    } = this.props

    return getFieldDecorator('country_code', {
      initialValue: (values && values.country_code) || 'RO',
    })(this.getCountrySelectItem())
  }

  fileUploadEvent = e => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  getItem = itemConfig => {
    const { field, type, placeholder, disabled, ...rest } = itemConfig

    switch (type) {
      case 'remoteSelect':
        return <RemoteSelect onChange={() => this.handleOnChange(field)} itemConfig={itemConfig} />
      case 'select':
      case 'tags':
      case 'multiple':
        return this.getSelectItem(itemConfig)
      case 'country':
        return this.getCountrySelectItem(itemConfig, true)
      case 'phone':
        return (
          <Input
            placeholder={placeholder}
            disabled={disabled}
            addonBefore={this.getPrefixSelector()}
            onChange={() => this.handleOnChange(field)}
            {...rest}
          />
        )
      case 'date':
        return (
          <DatePicker
            placeholder={placeholder}
            disabled={disabled}
            onChange={() => this.handleOnChange(field)}
            {...rest}
          />
        )
      case 'number':
        return (
          <InputNumber
            placeholder={placeholder}
            disabled={disabled}
            onChange={() => this.handleOnChange(field)}
            {...rest}
          />
        )
      case 'qrcode':
        return (
          <Input
            placeholder={placeholder}
            disabled={disabled}
            addonAfter={this.getQRScanner(field)}
            className="ant-input-search-enter-button"
            onChange={() => this.handleOnChange(field)}
            {...rest}
          />
        )
      case 'textarea':
        return <Input.TextArea placeholder={placeholder} disabled={disabled} />
      case 'checkbox':
        return <Checkbox>{placeholder}</Checkbox>
      case 'file':
        return (
          <Upload name="file" {...rest}>
            <Button icon="upload">{placeholder}</Button>
          </Upload>
        )
      default:
        return (
          <Input
            placeholder={placeholder}
            disabled={disabled}
            onChange={() => this.handleOnChange(field)}
          />
        )
    }
  }

  getExtraProps = type => {
    switch (type) {
      case 'checkbox':
        return { valuePropName: 'checked' }
      case 'file':
        return { valuePropName: 'fileList', getValueFromEvent: this.fileUploadEvent }
      default:
        return { valuePropName: 'value' }
    }
  }

  getFormItem = (itemConfig, isSubItem) => {
    const {
      form: { getFieldDecorator },
      errors,
      values,
    } = this.props
    const { field, label, type, rules, items } = itemConfig
    let { props, initialValue } = itemConfig

    // adjust value prop name, depending on input type
    const extraProps = this.getExtraProps(type)

    // set field errors, if any
    if (errors && errors[field]) {
      props = {
        ...props,
        help: errors[field],
        validateStatus: 'error',
      }
    }

    // set field values, based on values array
    // note: initialValue will be overridden
    if (values) {
      if (field.includes('.')) {
        // try to get nested values assuming dot notation
        let currentValue = values
        const fieldArray = field.split('.')

        while (fieldArray.length > 0) {
          currentValue = currentValue[fieldArray[0]]
          fieldArray.shift()
        }

        if (currentValue) {
          initialValue = currentValue
        }
      } else if (values[field]) {
        initialValue = values[field]
      }

      if (type === 'date' && initialValue) {
        initialValue = moment(initialValue)
      }
    }

    const fieldDecoratorOptions = { rules, initialValue, ...extraProps }

    return (
      <AntForm.Item key={field} label={label} {...props} className={isSubItem ? 'mb-0' : null}>
        {!items && getFieldDecorator(field, fieldDecoratorOptions)(this.getItem(itemConfig))}
        {items && items.map(subItemConfig => this.getFormItem(subItemConfig, true))}
      </AntForm.Item>
    )
  }

  render() {
    const { loading, submitText, compact, layout, submitType, children } = this.props
    let { config } = this.props
    let itemLayout
    let tailLayout

    // filter items based on hidden prop
    config = config.filter(item => item.hidden !== true)

    if (layout !== 'inline') {
      itemLayout = compact ? formItemLayoutSmall : formItemLayout
      tailLayout = compact ? formTailLayoutSmall : formTailLayout
    }

    return (
      <AntForm
        {...itemLayout}
        hideRequiredMark
        onSubmit={this.handleSubmit}
        layout={layout}
        className={layout !== 'inline' && 'mb-4'}
      >
        {config.map(itemConfig => this.getFormItem(itemConfig))}
        {children}

        <AntForm.Item {...tailLayout}>
          <Button type={submitType || 'primary'} htmlType="submit" loading={loading}>
            {submitText || 'Submit'}
          </Button>
        </AntForm.Item>
      </AntForm>
    )
  }
}

export default Form
