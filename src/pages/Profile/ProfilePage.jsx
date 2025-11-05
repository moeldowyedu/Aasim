import MainLayout from '../../components/layout/MainLayout'
import { useAuthStore } from '../../store/authStore'

const ProfilePage = () => {
  const { user } = useAuthStore()

  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-4xl font-bold text-gray-900 text-shadow mb-6">Profile Settings</h1>
        <div className="glass-card rounded-2xl p-8">
          <div className="mb-6">
            <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-900 font-bold text-4xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">{user?.name || 'User'}</h2>
            <p className="text-gray-600 text-center">{user?.email || 'user@example.com'}</p>
          </div>
          <p className="text-gray-600 text-center py-12">
            Profile management coming soon...
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default ProfilePage
