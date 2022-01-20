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
  TimePicker,
  AutoComplete,
  Row,
  Col,
} from 'antd'
import moment from 'moment'
import _ from 'lodash'

import QRScanner from 'components/generic/QRScanner'
import countries from './countries.json'
import './style.css'
import RemoteSelect from './remoteSelect'

const formItemLayout = {
  labelCol: { md: 8 },
  wrapperCol: { md: 12 },
}

const formTailLayout = layout => ({
  wrapperCol: layout || { md: { span: 16, offset: 8 } },
})

@AntForm.create()
class Form extends React.Component {
  processValues = values => {
    const processed = {}

    Object.keys(values).forEach(key => {
      processed[key] = _.isUndefined(values[key]) ? null : values[key]
    })

    return processed
  }

  handleSubmit = e => {
    e.preventDefault()

    const { form, onSubmit, onError } = this.props

    form.validateFields((errors, values) => {
      if (!errors && onSubmit) {
        onSubmit(this.processValues(values))
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
    const { field, type, placeholder, options, disabled, ...rest } = itemConfig

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
        {...rest}
      >
        {options.map(option => {
          const isString = !_.isObject(option)

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
    const { field, type, placeholder, disabled, antdProps, ...rest } = itemConfig

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
      case 'time':
        return (
          <TimePicker
            onChange={() => this.handleOnChange(field)}
            placeholder={placeholder}
            disabled={disabled}
            {...antdProps}
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
        return <Input.TextArea placeholder={placeholder} disabled={disabled} {...rest} />
      case 'password':
        return (
          <Input.Password
            placeholder={placeholder}
            disabled={disabled}
            onChange={() => this.handleOnChange(field)}
            {...rest}
          />
        )
      case 'checkbox':
        return <Checkbox>{placeholder}</Checkbox>
      case 'file':
        return (
          <Upload name="file" {...rest}>
            <Button icon="upload">{placeholder}</Button>
          </Upload>
        )
      case 'autocomplete':
        return (
          <AutoComplete
            placeholder={placeholder}
            disabled={disabled}
            onChange={() => this.handleOnChange(field)}
            {...rest}
          />
        )
      case 'custom':
        return null
      default:
        return (
          <Input
            placeholder={placeholder}
            disabled={disabled}
            onChange={() => this.handleOnChange(field)}
            {...rest}
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
    const { form, errors, values, columnLayout } = this.props
    const { field, label, type, rules, items, render, layout: itemLayout } = itemConfig
    let { props, initialValue } = itemConfig

    const layout = itemLayout || columnLayout || { span: 24 }

    if (type === 'custom') {
      return (
        <Col key={field} {...layout}>
          <AntForm.Item label={label} className={isSubItem ? 'mb-0' : null} {...props}>
            {render && render(form)}
          </AntForm.Item>
        </Col>
      )
    }

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
      // This should enable field names like: 'a[0].b.c' to support arrays and objects
      initialValue = _.get(values, field)

      if (type === 'date' && initialValue) {
        initialValue = moment(initialValue)
      }

      if (type === 'time' && initialValue) {
        let format = 'HH:mm:ss'

        if (itemConfig.antdProps && itemConfig.antdProps.format) {
          // eslint-disable-next-line prefer-destructuring
          format = itemConfig.antdProps.format
        }

        initialValue = moment(initialValue, format)
      }
    }

    const fieldDecoratorOptions = { rules, initialValue, ...extraProps }

    return (
      <Col key={field} {...layout}>
        <AntForm.Item label={label} {...props} className={isSubItem ? 'mb-0' : null}>
          {!items && form.getFieldDecorator(field, fieldDecoratorOptions)(this.getItem(itemConfig))}
          {items && items.map(subItemConfig => this.getFormItem(subItemConfig, true))}
        </AntForm.Item>
      </Col>
    )
  }

  render() {
    const {
      loading,
      submitText,
      compact,
      submitType,
      submitBlock,
      children,
      sectionConfig,
      sectionLayout,
      submitLayout,
    } = this.props
    let { config, layout } = this.props

    // filter items based on hidden prop
    config = config && config.filter(item => item.hidden !== true)

    // backwords compatibility with older versions
    if (compact) {
      layout = 'vertical'
    }

    return (
      <AntForm
        {...((!layout || layout === 'horizontal') && formItemLayout)}
        hideRequiredMark
        onSubmit={this.handleSubmit}
        layout={layout}
        className={layout !== 'inline' && 'mb-4'}
      >
        {!sectionConfig && (
          <Row gutter={32}>{config.map(itemConfig => this.getFormItem(itemConfig))}</Row>
        )}

        {sectionConfig &&
          sectionConfig.map(section => {
            const { title, wrapper } = sectionLayout || {
              title: { md: 24, lg: 8 },
              wrapper: { md: 24, lg: 16 },
            }
            let { config: subConfig } = section

            subConfig = subConfig && subConfig.filter(item => item.hidden !== true)

            return (
              <Row
                key={section.title}
                gutter={[32, 32]}
                style={{ borderBottom: '1px solid #F0F0F0' }}
              >
                <Col {...title}>
                  <div style={{ fontSize: 16, fontWeight: 'bold' }}>{section.title}</div>
                </Col>
                <Col {...wrapper}>
                  <Row gutter={32}>{subConfig.map(itemConfig => this.getFormItem(itemConfig))}</Row>
                </Col>
              </Row>
            )
          })}

        {children}

        <AntForm.Item {...formTailLayout(compact ? { span: 24 } : submitLayout)}>
          <Button
            type={submitType || 'primary'}
            htmlType="submit"
            block={submitBlock}
            loading={loading}
            className={sectionConfig && 'mt-4'}
          >
            {submitText || 'Submit'}
          </Button>
        </AntForm.Item>
      </AntForm>
    )
  }
}

export default Form
