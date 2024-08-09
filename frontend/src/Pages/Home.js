import React from 'react'
import { useAuthStore } from '../Store/authStore'

const Home = () => {
  const {logout}=useAuthStore()
  const handleLogout =async () => {
        try {
          await logout()
        } catch (error) {
          console.log(error)
          
        }
  }
  return (
      
    <div>

      <button 
         className='bg-green-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
        onClick={handleLogout}
       >Logout</button>
    </div>
  )
}

export default Home