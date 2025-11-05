import MainLayout from '../../components/layout/MainLayout'
import { Link } from 'react-router-dom'

const SubmissionsListPage = () => {
  return (
    <MainLayout>
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-900 text-shadow">My Submissions</h1>
          <Link to="/submissions/create" className="glass-btn-primary rounded-xl px-6 py-3">
            <span className="flex items-center">
              <span className="material-icons mr-2">add</span>
              New Submission
            </span>
          </Link>
        </div>
        <div className="glass-card rounded-2xl p-8">
          <p className="text-gray-600 text-center py-12">
            Submissions list coming soon...
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default SubmissionsListPage
