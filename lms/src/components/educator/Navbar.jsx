import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {

  const educatorData = dummyEducatorData
  const { user } = useUser()

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-slate-200 py-3 bg-white/80 backdrop-blur'>
      <Link to="/">
        <img src={assets.logo} alt='Logo' className='w-28 lg:w-32' />
      </Link>
      <div className='flex items-center gap-5 text-slate-600 relative'>
          <p>Hi! {user ? user.fullName : 'Developers'}</p>
          {user ? <UserButton /> : <img className='max-w-8' src={assets.profile_img} />}
      </div>      
    </div>
  )
}

export default Navbar
