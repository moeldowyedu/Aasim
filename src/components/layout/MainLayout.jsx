import Header from './Header'
import Footer from './Footer'

const MainLayout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-6">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

export default MainLayout
