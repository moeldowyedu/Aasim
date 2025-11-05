import MainLayout from '../../components/layout/MainLayout'
import { useParams } from 'react-router-dom'

const SubmissionDetailsPage = () => {
  const { id } = useParams()

  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-4xl font-bold text-gray-900 text-shadow mb-6">Submission Details #{id}</h1>
        <div className="glass-card rounded-2xl p-8">
          <p className="text-gray-600 text-center py-12">
            Submission details coming soon...
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default SubmissionDetailsPage
