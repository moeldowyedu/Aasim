import { useState } from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
      toast.success('Password reset link sent to your email')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-600">
                {isSubmitted
                  ? 'Check your email for reset instructions'
                  : 'Enter your email to reset your password'}
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full glass-btn-primary rounded-xl py-3 font-semibold disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="glass-card rounded-2xl p-6 mb-6">
                  <span className="material-icons text-6xl text-green-300 mb-4">check_circle</span>
                  <p className="text-gray-600">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link to="/login" className="text-primary-600 hover:text-primary-700">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ForgotPasswordPage
