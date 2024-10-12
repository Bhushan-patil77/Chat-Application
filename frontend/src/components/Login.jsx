import React from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {

    const navigate = useNavigate()

    const handleLogin = (e) =>{
        e.preventDefault()
        const formData = new FormData(e.target);
        const user = {};
      

       for(let [key, value] of formData)
       {
          user[key]=value;
        
       }

       fetch('http://localhost:5000/Login', {method:'post', headers:{'Content-Type': 'application/json'}, body:JSON.stringify(user)})
       .then((response)=>{return response.json()})
       .then((data)=>{
        if(data.message=='User authenticated...')
        {
            localStorage.setItem('user', JSON.stringify(data.authenticUser))
            navigate('/')
        }
       })
       .catch((err)=>{alert(err)})

    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-md rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={(e)=>{handleLogin(e)}} >
            <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-500"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition duration-200"
            >
                Login
            </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
            Don't have an account? <span className="text-blue-500 hover:underline" onClick={()=>{navigate('/Register')}}>Register</span>
        </p>
    </div>
</div>
  )
}

export default Login