import React from 'react'
import { Button, Popover } from 'antd'

export default class ActionButton extends React.Component {
  render() {
    const {
      popoverText = 'Are you sure?',
      buttonText = 'Dispatch Action',
      buttonType,
      buttonIcon,
      loading,
      onClick,
      ...rest
    } = this.props

    return (
      <Popover
        content={
          <div>
            {popoverText}{' '}
            <Button type={buttonType} className="ml-2" onClick={onClick} loading={loading}>
              Confirm
            </Button>
          </div>
        }
        trigger="click"
      >
        <Button icon={buttonIcon} type={buttonType} {...rest}>
          {buttonText}
        </Button>
      </Popover>
    )
  }
}
