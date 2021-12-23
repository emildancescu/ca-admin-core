/* 
  Error: currentValue is undefined
  This happens when using "values" prop on Form component and also using dot notation on field (nested values)
  I guess this happens when "values" does not contain values for those nested values
*/

import * as React from 'react'
import { Form } from 'lib'
import { Card } from 'antd'

const FormInitValues = () => {
  const initialValues = {
    required_comment: false,
    name: {
      ro: 'rouma',
      ty: {
        two: 'ty two',
      },
    },
  }

  const config = [
    {
      label: 'Name EN',
      field: 'name.en',
    },
    {
      label: 'Name EN',
      field: 'name.ro',
    },
    {
      label: '3 nested',
      field: 'name.ty.one',
    },
    {
      label: '3 nested',
      field: 'name.ty.two',
    },
    {
      label: 'Required comment',
      field: 'required_comment',
      type: 'checkbox',
    },
  ]

  const onSubmit = values => {
    console.log(values)
  }

  return (
    <Card title="Form initialValues error">
      <Form config={config} onSubmit={onSubmit} values={initialValues} />
    </Card>
  )
}

export default FormInitValues
