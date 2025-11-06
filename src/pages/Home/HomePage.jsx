import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'

const HomePage = () => {
  const industries = [
    { name: 'Education', icon: 'school' },
    { name: 'Technology', icon: 'computer' },
    { name: 'Law', icon: 'gavel' },
    { name: 'Healthcare', icon: 'local_hospital' },
    { name: 'Competitions', icon: 'emoji_events' },
    { name: 'Events', icon: 'event' },
    { name: 'Business', icon: 'business_center' },
    { name: 'Creative', icon: 'palette' },
  ]

  return (
    <MainLayout showFooter={true}>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center -mt-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-7xl md:text-9xl font-bold mb-8 text-gray-900 text-shadow-lg tracking-tight font-heading">
            <span className="gradient-text">AASIM</span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700">
            Your AI Judge Agent
          </h2>

          <div className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
            Effortless • Unbiased • Cost-Effective
          </div>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Save <strong>80% of your budget</strong> and <strong>90% of your time</strong> with AI-powered evaluation.<br/>
            No human feelings. Just pure objectivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="glass-btn-primary rounded-full px-10 py-4 text-lg glow">
              Start Free Trial
            </Link>
            <a href="#pricing" className="glass-btn-secondary rounded-full px-10 py-4 text-lg">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Why Aasim is Perfect Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900 font-heading">
            Why Aasim is Perfect
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Save Your Budget */}
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Save Your Budget</h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-lg">
                  <span className="line-through text-gray-400">Human judges: $50-200+/hour</span>
                </p>
                <p className="text-2xl font-bold text-primary-600">Aasim: $1/evaluation</p>
                <p className="text-xl font-semibold text-green-600">80% cost reduction</p>
              </div>
            </div>

            {/* Save Your Time */}
            <div className="glass-card rounded-3xl p-8 text-center border-2 border-primary-400 glow">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Save Your Time</h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-lg">
                  <span className="line-through text-gray-400">Humans: hours to days</span>
                </p>
                <p className="text-2xl font-bold text-primary-600">Aasim: minutes</p>
                <p className="text-xl font-semibold text-green-600">90% faster</p>
              </div>
            </div>

            {/* Zero Human Bias */}
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Zero Human Bias</h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-lg">No feelings, no favoritism, no bad days</p>
                <p className="text-xl font-semibold text-primary-600">100% objective criteria-based</p>
                <p className="text-lg">Consistent across all submissions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900 font-heading">
            Industries We Serve
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <span className="material-icons text-5xl text-primary-600 mb-3">{industry.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Human-in-the-Loop */}
      <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 font-heading">
            Worried about AI? We get it.
          </h2>

          <p className="text-xl text-gray-700 mb-12">
            That's why we built Aasim with <strong>Human-in-the-Loop</strong> capability.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center justify-center mb-4">
                <span className="material-icons text-4xl text-green-600">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Fully Automated</h3>
              <p className="text-gray-700">Let Aasim handle everything. Fast, efficient, objective.</p>
            </div>

            <div className="glass-card rounded-3xl p-8 border-2 border-primary-400">
              <div className="flex items-center justify-center mb-4">
                <span className="material-icons text-4xl text-primary-600">supervised_user_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Human Review</h3>
              <p className="text-gray-700">Optional human oversight. You approve final decisions.</p>
            </div>
          </div>

          <p className="text-2xl font-semibold text-gray-900 mb-4">
            You stay in control.
          </p>
          <p className="text-xl text-gray-700">
            Aasim is your <strong>assistant</strong>, not your replacement.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900 font-heading">
            Pricing
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12">
            See how much you'll save compared to human judges
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Small Business */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Small Business</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$100</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">vs. hiring humans:</p>
                <p className="text-2xl font-bold text-green-600">Save $4,900/month</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>100 evaluations/month</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>All AI agents</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link to="/register" className="w-full block text-center glass-btn-primary rounded-xl px-6 py-3 font-semibold">
                Get Started
              </Link>
            </div>

            {/* Medium */}
            <div className="glass-card rounded-3xl p-8 border-2 border-primary-400 glow">
              <div className="text-center mb-4">
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  POPULAR
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Medium</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$250</span>
                <span className="text-gray-600">/mo</span>
              </div>
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">vs. hiring humans:</p>
                <p className="text-2xl font-bold text-green-600">Save $14,750/month</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>300 evaluations/month</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>API access</span>
                </li>
              </ul>
              <Link to="/register" className="w-full block text-center glass-btn-primary rounded-xl px-6 py-3 font-semibold glow">
                Get Started
              </Link>
            </div>

            {/* Enterprise */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">vs. hiring humans:</p>
                <p className="text-xl font-bold text-green-600">Maximum savings</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>Unlimited evaluations</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>Custom AI models</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>24/7 support</span>
                </li>
              </ul>
              <Link to="/register" className="w-full block text-center glass-btn-secondary rounded-xl px-6 py-3 font-semibold">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 font-heading">
            Ready to Transform Your Evaluation Process?
          </h2>

          <p className="text-xl text-gray-700 mb-10">
            Join hundreds of organizations saving time and money with Aasim
          </p>

          <Link to="/register" className="glass-btn-primary rounded-full px-12 py-5 text-xl font-semibold inline-block glow mb-6">
            Start Free Trial
          </Link>

          <p className="text-gray-600">
            No credit card required • 5 free evaluations
          </p>
        </div>
      </section>
    </MainLayout>
  )
}

export default HomePage
