import React from 'react'
import { DetailsModal } from 'lib'
import { withRouter } from 'react-router-dom'

@withRouter
class ModalJumpTab extends React.Component {
  render() {
    const tabs = [
      {
        title: 'Details Tab',
        icon: 'idcard',
        component: <DetailsTab />,
        key: 'details',
      },
      {
        title: 'Edit Tab',
        icon: 'idcard',
        component: <EditTab />,
        key: 'edit',
      },
    ]

    const title = 'ModalJumpTab'

    return <DetailsModal title={title} backLocation="/dashboard" tabs={tabs} />
  }
}

const DetailsTab = () => {
  return <>Details</>
}

const EditTab = () => {
  return <>Edit</>
}

export default ModalJumpTab
