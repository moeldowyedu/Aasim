import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { useLanguage } from '../../contexts/LanguageContext'
import { translations } from '../../translations'

const HomePage = () => {
  const { language } = useLanguage()
  const t = translations[language]

  const industries = [
    { name: t.education, icon: 'school' },
    { name: t.technology, icon: 'computer' },
    { name: t.law, icon: 'gavel' },
    { name: t.healthcare, icon: 'local_hospital' },
    { name: t.competitions, icon: 'emoji_events' },
    { name: t.events, icon: 'event' },
    { name: t.business, icon: 'business_center' },
    { name: t.creative, icon: 'palette' },
  ]

  const agents = [
    {
      id: 'video-audio',
      icon: 'videocam',
      title: t.agent1Title,
      description: t.agent1Description,
      features: [t.agent1Feature1, t.agent1Feature2, t.agent1Feature3, t.agent1Feature4]
    },
    {
      id: 'document-image',
      icon: 'image',
      title: t.agent2Title,
      description: t.agent2Description,
      features: [t.agent2Feature1, t.agent2Feature2, t.agent2Feature3, t.agent2Feature4]
    },
    {
      id: 'code',
      icon: 'code',
      title: t.agent3Title,
      description: t.agent3Description,
      features: [t.agent3Feature1, t.agent3Feature2, t.agent3Feature3, t.agent3Feature4]
    },
    {
      id: 'custom',
      icon: 'tune',
      title: t.agent4Title,
      description: t.agent4Description,
      features: [t.agent4Feature1, t.agent4Feature2, t.agent4Feature3, t.agent4Feature4]
    },
    {
      id: 'report',
      icon: 'assessment',
      title: t.agent5Title,
      description: t.agent5Description,
      features: [t.agent5Feature1, t.agent5Feature2, t.agent5Feature3, t.agent5Feature4]
    },
    {
      id: 'consistent',
      icon: 'security',
      title: t.agent6Title,
      description: t.agent6Description,
      features: [t.agent6Feature1, t.agent6Feature2, t.agent6Feature3, t.agent6Feature4]
    },
  ]

  return (
    <MainLayout showFooter={true}>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center -mt-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-7xl md:text-9xl font-bold mb-8 text-gray-900 text-shadow-lg tracking-tight font-heading">
            <span className="gradient-text">{t.heroTitle}</span>
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-700">
            {t.heroSubtitle}
          </h2>

          <div className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
            {t.heroBenefits}
          </div>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t.heroDescription}<br/>
            {t.heroDescription2}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="glass-btn-primary rounded-full px-10 py-4 text-lg glow">
              {t.startFreeTrial}
            </Link>
            <a href="#pricing" className="glass-btn-secondary rounded-full px-10 py-4 text-lg">
              {t.viewPricing}
            </a>
          </div>
        </div>
      </section>

      {/* Why Aasim is Perfect Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900 font-heading">
            {t.whyAasimTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Save Your Budget */}
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.saveYourBudget}</h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-lg">
                  <span className="line-through text-gray-400">{t.humanJudges}</span>
                </p>
                <p className="text-2xl font-bold text-primary-600">{t.aasimPrice}</p>
                <p className="text-xl font-semibold text-green-600">{t.costReduction}</p>
              </div>
            </div>

            {/* Save Your Time */}
            <div className="glass-card rounded-3xl p-8 text-center border-2 border-primary-400 glow">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.saveYourTime}</h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-lg">
                  <span className="line-through text-gray-400">{t.humansTime}</span>
                </p>
                <p className="text-2xl font-bold text-primary-600">{t.aasimTime}</p>
                <p className="text-xl font-semibold text-green-600">{t.fasterTime}</p>
              </div>
            </div>

            {/* Zero Human Bias */}
            <div className="glass-card rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.zeroHumanBias}</h3>
              <div className="space-y-3 text-gray-700">
                <p className="text-lg">{t.noFeelings}</p>
                <p className="text-xl font-semibold text-primary-600">{t.objectiveBased}</p>
                <p className="text-lg">{t.consistentSubmissions}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Showcase Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center text-gray-900 font-heading">
            {t.aiAgentsTitle}
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-4xl mx-auto">
            {t.aiAgentsSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <div key={index} className="glass-card rounded-3xl p-8 hover:scale-105 transition-transform">
                <div className="flex items-center mb-4">
                  <span className="material-icons text-5xl text-primary-600 mr-3">{agent.icon}</span>
                  <h3 className="text-xl font-bold text-gray-900">{agent.title}</h3>
                </div>

                <p className="text-gray-700 mb-6">{agent.description}</p>

                <ul className="space-y-3">
                  {agent.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start text-gray-700">
                      <span className="material-icons text-green-600 text-sm mr-2 mt-1">check_circle</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 glass-card rounded-3xl p-8 bg-gradient-to-r from-purple-50 to-blue-50">
            <p className="text-center text-lg text-gray-700">
              <strong className="text-primary-600">💡 Customization:</strong> {t.customization}
            </p>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section id="use-cases" className="py-20 px-6 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900 font-heading">
            {t.industriesTitle}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {industries.map((industry, index) => (
              <div key={index} className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <span className="material-icons text-5xl text-primary-600 mb-3">{industry.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{industry.name}</h3>
              </div>
            ))}
          </div>

          {/* Industry Disclaimers */}
          {t.industriesDisclaimersTitle && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6 font-heading">
                {t.industriesDisclaimersTitle}
              </h3>
              <div className="space-y-4 max-w-4xl mx-auto">
                {t.lawDisclaimer && (
                  <div className="glass-card rounded-2xl p-6 bg-yellow-50 border-2 border-yellow-200">
                    <p className="text-gray-800 text-center leading-relaxed">{t.lawDisclaimer}</p>
                  </div>
                )}
                {t.healthcareDisclaimer && (
                  <div className="glass-card rounded-2xl p-6 bg-blue-50 border-2 border-blue-200">
                    <p className="text-gray-800 text-center leading-relaxed">{t.healthcareDisclaimer}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Human-in-the-Loop */}
      <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 font-heading">
            {t.humanLoopTitle}
          </h2>

          <p className="text-xl text-gray-700 mb-12">
            {t.humanLoopSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center justify-center mb-4">
                <span className="material-icons text-5xl text-green-600">bolt</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.fullyAutomated}</h3>
              <p className="text-gray-700">{t.fullyAutomatedDesc}</p>
            </div>

            <div className="glass-card rounded-3xl p-8 border-2 border-primary-400">
              <div className="flex items-center justify-center mb-4">
                <span className="material-icons text-5xl text-primary-600">supervised_user_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{t.humanReview}</h3>
              <p className="text-gray-700">{t.humanReviewDesc}</p>
            </div>
          </div>

          <p className="text-2xl font-semibold text-gray-900 mb-4">
            {t.youControl}
          </p>
          <p className="text-xl text-gray-700">
            {t.assistantNotReplacement}
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900 font-heading">
            {t.pricingTitle}
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12">
            {t.pricingSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Small Business */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.smallBusiness}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$100</span>
                <span className="text-gray-600">{t.perMonth}</span>
              </div>
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">{t.vsHiring}</p>
                <p className="text-2xl font-bold text-green-600">{t.saveMonth}</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>{t.evaluationsMonth}</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>{t.allAgents}</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>{t.prioritySupport}</span>
                </li>
              </ul>
              <Link to="/register" className="w-full block text-center glass-btn-primary rounded-xl px-6 py-3 font-semibold">
                {t.getStarted}
              </Link>
            </div>

            {/* Medium */}
            <div className="glass-card rounded-3xl p-8 border-2 border-primary-400 glow">
              <div className="text-center mb-4">
                <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  {t.popular}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.medium}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$250</span>
                <span className="text-gray-600">{t.perMonth}</span>
              </div>
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">{t.vsHiring}</p>
                <p className="text-2xl font-bold text-green-600">{t.save14k}</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>{t.evaluations300}</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>{t.advancedAnalytics}</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>{t.apiAccess}</span>
                </li>
              </ul>
              <Link to="/register" className="w-full block text-center glass-btn-primary rounded-xl px-6 py-3 font-semibold glow">
                {t.getStarted}
              </Link>
            </div>

            {/* Enterprise */}
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.enterprise}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{t.custom}</span>
              </div>
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-gray-600">{t.vsHiring}</p>
                <p className="text-xl font-bold text-green-600">{t.maximumSavings}</p>
              </div>
              <ul className="space-y-3 mb-8 text-gray-700">
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>{t.unlimitedEvaluations}</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>{t.customModels}</span>
                </li>
                <li className="flex items-start">
                  <span className="material-icons text-green-600 text-sm mr-2 mt-1">check</span>
                  <span>{t.support247}</span>
                </li>
              </ul>
              <Link to="/register" className="w-full block text-center glass-btn-secondary rounded-xl px-6 py-3 font-semibold">
                {t.contactUs}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 font-heading">
            {t.finalCtaTitle}
          </h2>

          <p className="text-xl text-gray-700 mb-10">
            {t.finalCtaSubtitle}
          </p>

          <Link to="/register" className="glass-btn-primary rounded-full px-12 py-5 text-xl font-semibold inline-block glow mb-6">
            {t.startFreeTrial}
          </Link>

          <p className="text-gray-600">
            {t.noCredit}
          </p>
        </div>
      </section>
    </MainLayout>
  )
}

export default HomePage
