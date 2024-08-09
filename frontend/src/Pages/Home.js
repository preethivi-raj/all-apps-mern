
import { Link } from 'react-router-dom'

const Home = () => {
  return (
      
    <div
    className="min-h-screen bg-gradient-to-br
  from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
  >
      <button 
         className='bg-green-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
       >
       <Link to="/dashboard" >Dashboard</Link>
        </button>
    </div>
  )
}

export default Home