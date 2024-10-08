import React, { useState } from 'react'
import Input from '../Components/Input'
import { Loader, Lock, Mail, User} from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import PasswordStrength from "../Components/PasswordStrength"
import { useAuthStore } from '../Store/authStore'


const SignUpPage = () => {
    const [name , setName]=useState("")
    const [email , setEmail]=useState("")
    const [password , setPassword]=useState("")
    const navigate = useNavigate()

    const {signup , error , isLoading} =useAuthStore()

    const handleSubmit= async(e)=>{
        e.preventDefault()

        try {
            await signup(email , password , name);
            navigate("/verify-email")
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div
      className="min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
    <div className='max-w-sm w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <div className='p-8'>
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-gray-400 to-emerald-500 text-transparent bg-clip-text'>
                Create An Account
            </h2>
            <form onSubmit={handleSubmit}>
                <Input
                 icon={User}
                 type='text'
                 placeholder='Full Name'
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <Input
                 icon={Mail}
                 type='email'
                 placeholder='Email'
                 value={email}
                 onChange={(e)=>setEmail(e.target.value)}
                />
                <Input
                 icon={Lock}
                 type='password'
                 placeholder='Password'
                 value={password}
                 onChange={(e)=>setPassword(e.target.value)}
                />
                   {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                    {
                    password && <PasswordStrength password={password} />
                    }


                <button className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
                          disabled={isLoading}
                         >
                    {isLoading ? <Loader className='animate-spin mx-auto' size={24}/> : "Sign Up"}
                </button>
            </form>
        </div>
        
      

        <div className='py-4 px-8 bg-opacity-50 bg-gray-900 flex justify-center'>
            <p className='text-sm text-gray-400' >
                Already have an account?{" "}
                <Link to='/login' className='text-green-500 hover:underline'>
                    Login
                </Link>
            </p>
        </div>
    </div>
    </div>
  )
}

export default SignUpPage