import React,{useState} from 'react'
import { motion } from 'framer-motion';
import Input from '../Components/Input';
import { Lock, Loader } from 'lucide-react';
import { useAuthStore } from '../Store/authStore';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {resetPassword , error , isLoading , message}=useAuthStore()
    const {token}  = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(password !== confirmPassword){
           toast.error("Passwords do not match")
            return
        }

        try {
            if(password === confirmPassword){
                await resetPassword(token , password)
                toast.success("Password reset successfully ,redirecting to login page...")
                setTimeout(()=>{
                    navigate('/login')
                },2000) 
            }
        } catch (error) {
            toast.error(error.message || "An error occurred")
        }
    }
  return (
    <motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
            <div className='p-8'>
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Reset Password
				</h2>
                <form onSubmit={handleSubmit}>
                        <p className='text-gray-300 mb-6 text-center'>Enter your Email address and we`ll send you a link to reset your password.</p>
					<Input
						icon={Lock}
						type='password'
						placeholder='New Password'
						value={password}
                        required
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Confirm Password'
						value={confirmPassword}
                        required
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className='w-6 h-6 animate-spin  mx-auto' /> : "Reset Password"}
					</motion.button>
				</form>   
            </div>
        </motion.div>
  )
}

export default ResetPasswordPage