import { Bot, Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 'large', message = 'Loading...' }) {
  if (size === 'small') {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 size={16} className="animate-spin text-indigo-600" />
      </div>
    )
  }

  if (size === 'medium') {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 size={24} className="animate-spin text-indigo-600" />
          <span className="text-sm text-gray-600">{message}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center h-20 w-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg mx-auto mb-4 animate-pulse">
            <Bot size={40} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-ping"></div>
        </div>

        {/* Loading Animation */}
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-indigo-600 mx-auto"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-purple-600 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            {message}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base max-w-xs mx-auto">
            Setting up your AI chatbot experience...
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-1 mt-6">
          <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}