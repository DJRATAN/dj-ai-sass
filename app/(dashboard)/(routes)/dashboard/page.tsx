import { UserButton } from '@clerk/nextjs'
import React from 'react'

const DashboardPage = () => {
  return (
    <div>
      DashboardPage (Portected)
      <div>
        {/* <UserButton afterSignOutUrl='/sign-in'/> */}
      </div>
    </div>
  )
}

export default DashboardPage
