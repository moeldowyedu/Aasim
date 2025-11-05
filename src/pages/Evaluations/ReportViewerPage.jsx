import MainLayout from '../../components/layout/MainLayout'
import { useParams } from 'react-router-dom'

const ReportViewerPage = () => {
  const { id } = useParams()

  return (
    <MainLayout>
      <div className="py-8">
        <h1 className="text-4xl font-bold text-gray-900 text-shadow mb-6">Report Viewer</h1>
        <div className="glass-card rounded-2xl p-8">
          <p className="text-gray-600 text-center py-12">
            Report viewer for evaluation #{id} coming soon...
          </p>
        </div>
      </div>
    </MainLayout>
  )
}

export default ReportViewerPage
