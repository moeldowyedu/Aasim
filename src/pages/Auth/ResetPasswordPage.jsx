import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import toast from 'react-hot-toast'

const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      toast.success('Password reset successful!')
      navigate('/login')
      setIsLoading(false)
    }, 1000)
  }

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-3xl p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Reset Password</h1>
              <p className="text-gray-600">Enter your new password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="glass-input w-full"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="glass-input w-full"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full glass-btn-primary rounded-xl py-3 font-semibold disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default ResetPasswordPage
