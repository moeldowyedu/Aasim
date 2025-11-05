import MainLayout from '../../components/layout/MainLayout'
import { useAuthStore } from '../../store/authStore'
import { Link } from 'react-router-dom'

const DashboardPage = () => {
  const { user } = useAuthStore()

  const stats = [
    { label: 'Total Submissions', value: '12', icon: 'upload_file', color: 'primary' },
    { label: 'Completed Evaluations', value: '8', icon: 'check_circle', color: 'green' },
    { label: 'In Progress', value: '3', icon: 'pending', color: 'yellow' },
    { label: 'Avg. Score', value: '85', icon: 'star', color: 'accent' },
  ]

  const recentSubmissions = [
    { id: 1, title: 'Project Alpha Submission', status: 'completed', score: 87, date: '2025-11-01' },
    { id: 2, title: 'Code Review Task', status: 'in_progress', score: null, date: '2025-11-03' },
    { id: 3, title: 'Presentation Analysis', status: 'completed', score: 92, date: '2025-10-28' },
  ]

  return (
    <MainLayout>
      <div className="py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-shadow mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Here's an overview of your evaluation activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card-hover rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`material-icons text-4xl text-${stat.color}-300`}>{stat.icon}</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Submissions */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Submissions</h2>
            <Link to="/submissions" className="text-primary-600 hover:text-primary-700 flex items-center">
              View All
              <span className="material-icons ml-1">arrow_forward</span>
            </Link>
          </div>

          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <Link
                key={submission.id}
                to={`/submissions/${submission.id}`}
                className="block glass-card rounded-xl p-4 hover:bg-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="material-icons text-gray-600">description</span>
                    <div>
                      <h3 className="text-gray-900 font-semibold">{submission.title}</h3>
                      <p className="text-gray-500 text-sm">{submission.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {submission.score && (
                      <div className="glass-card px-4 py-2 rounded-full">
                        <span className="text-gray-900 font-semibold">{submission.score}/100</span>
                      </div>
                    )}
                    <span className={`badge ${
                      submission.status === 'completed' ? 'badge-success' : 'badge-warning'
                    }`}>
                      {submission.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/agent-select" className="glass-card-hover rounded-2xl p-6 text-center">
            <span className="material-icons text-5xl text-primary-300 mb-4">add_circle</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">New Evaluation</h3>
            <p className="text-gray-600 text-sm">Choose an AI agent and submit for evaluation</p>
          </Link>

          <Link to="/criteria" className="glass-card-hover rounded-2xl p-6 text-center">
            <span className="material-icons text-5xl text-accent-300 mb-4">tune</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Manage Criteria</h3>
            <p className="text-gray-600 text-sm">Create custom evaluation criteria</p>
          </Link>

          <Link to="/submissions" className="glass-card-hover rounded-2xl p-6 text-center">
            <span className="material-icons text-5xl text-blue-300 mb-4">history</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">View History</h3>
            <p className="text-gray-600 text-sm">Browse past submissions</p>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}

export default DashboardPage
