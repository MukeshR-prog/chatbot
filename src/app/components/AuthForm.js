'use client'

import { useState } from 'react'
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/nextjs'
import { Bot, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signInEmailPassword } = useSignInEmailPassword()
  const { signUpEmailPassword } = useSignUpEmailPassword()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        const result = await signInEmailPassword(email, password)
        if (result.error) {
          setError(result.error.message)
        }
        // On success, AuthGuard will show the main app
      } else {
        const result = await signUpEmailPassword(email, password)
        if (result.error) {
          setError(result.error.message)
        } else {
          setSuccess('Account created! Please check your email to verify your account, then sign in.')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
            <Bot size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          AI Chatbot
        </h1>
        <div className="flex items-center justify-center space-x-1 mb-6">
          <Sparkles size={16} className="text-indigo-500" />
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Powered by Claude 3 Haiku
          </p>
          <Sparkles size={16} className="text-indigo-500" />
        </div>
        <h2 className="text-center text-xl sm:text-2xl font-semibold text-gray-800">
          {isLogin ? 'Welcome back!' : 'Get started today'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin 
            ? 'Sign in to continue your conversations' 
            : 'Create your account and start chatting with AI'}
        </p>
      </div>

      {/* Form Section */}
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative animate-in slide-in-from-top-2 duration-300" role="alert">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl relative animate-in slide-in-from-top-2 duration-300" role="alert">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">{success}</span>
                </div>
              </div>
            )}
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  autoComplete={isLogin ? "current-password" : "new-password"} 
                  required
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base transition-all duration-200"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-2 text-xs text-gray-500">
                  Password should be at least 8 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit" 
                disabled={loading || !email || !password}
                className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{isLogin ? 'Sign in' : 'Create Account'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Toggle Section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  {isLogin ? "New to AI Chatbot?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => { 
                  setIsLogin(!isLogin); 
                  setError(''); 
                  setSuccess('');
                  setEmail('');
                  setPassword('');
                }}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {isLogin ? 'Create a new account' : 'Sign in to existing account'}
              </button>
            </div>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Bot size={20} className="text-indigo-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-indigo-800 mb-1">Try it out!</h4>
                <p className="text-xs text-indigo-700 leading-relaxed">
                  Create an account to start chatting with our AI assistant. 
                  Your conversations are private and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}