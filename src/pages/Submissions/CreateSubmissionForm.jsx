import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import { industries, industryRubrics, additionalFieldConfigs } from '../../utils/industryConfig'
import toast from 'react-hot-toast'

const CreateSubmissionForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const selectedAgent = searchParams.get('agent')

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    description: '',
    industry: '',
    agent: selectedAgent || '',

    // Step 2: Industry-specific fields
    industryFields: {},

    // Step 3: Rubric & Grading
    useDefaultRubric: true,
    customCriteria: [],
    gradingScale: [],

    // Step 4: File Upload
    files: [],
  })

  const [industryConfig, setIndustryConfig] = useState(null)

  // Agent configurations
  const agentConfigs = {
    'video-audio': {
      name: 'Video & Audio Analysis',
      acceptedFormats: 'video/*, audio/*',
      supportedTypes: 'MP4, MOV, AVI, MP3, WAV, M4A',
      icon: 'videocam',
      description: 'Upload your video or audio files for AI-powered analysis',
    },
    'document-image': {
      name: 'Documents and Images Review',
      acceptedFormats: 'image/*, .pdf, .doc, .docx',
      supportedTypes: 'JPG, PNG, GIF, PDF, DOC, DOCX',
      icon: 'image',
      description: 'Upload documents and images for comprehensive review',
    },
    'code': {
      name: 'Source Code Assessment',
      acceptedFormats: '.js, .jsx, .ts, .tsx, .py, .java, .cpp, .c, .go, .rb, .php, .zip',
      supportedTypes: 'JS, Python, Java, C++, Go, Ruby, PHP (or ZIP file)',
      icon: 'code',
      description: 'Upload your source code files or project archive',
    },
    'custom': {
      name: 'Custom Evaluation',
      acceptedFormats: '*',
      supportedTypes: 'All file types',
      icon: 'tune',
      description: 'Upload any type of file for custom evaluation',
    },
    'report': {
      name: 'AI Report Generation',
      acceptedFormats: '.pdf, .doc, .docx, .txt',
      supportedTypes: 'PDF, DOC, DOCX, TXT',
      icon: 'assessment',
      description: 'Upload content for detailed report generation',
    },
    'consistent': {
      name: 'Objective Evaluation',
      acceptedFormats: '*',
      supportedTypes: 'All file types',
      icon: 'security',
      description: 'Upload your content for fair and consistent evaluation',
    },
  }

  const currentAgentConfig = agentConfigs[formData.agent] || agentConfigs['custom']

  useEffect(() => {
    if (formData.industry) {
      const config = industryRubrics[formData.industry]
      setIndustryConfig(config)
      if (formData.useDefaultRubric && config) {
        setFormData(prev => ({
          ...prev,
          customCriteria: config.defaultCriteria,
          gradingScale: config.gradingScale,
        }))
      }
    }
  }, [formData.industry, formData.useDefaultRubric])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleIndustryFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      industryFields: {
        ...prev.industryFields,
        [fieldName]: value,
      },
    }))
  }

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...uploadedFiles],
    }))
    toast.success(`${uploadedFiles.length} file(s) added successfully`)
  }

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
    toast.success('File removed')
  }

  const handleCriteriaChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      customCriteria: prev.customCriteria.map((criterion, i) =>
        i === index ? { ...criterion, [field]: value } : criterion
      ),
    }))
  }

  const addCriterion = () => {
    setFormData(prev => ({
      ...prev,
      customCriteria: [
        ...prev.customCriteria,
        { name: '', weight: 0, description: '' },
      ],
    }))
  }

  const removeCriterion = (index) => {
    setFormData(prev => ({
      ...prev,
      customCriteria: prev.customCriteria.filter((_, i) => i !== index),
    }))
  }

  const handleNextStep = () => {
    // Validate current step
    if (step === 1 && (!formData.title || !formData.industry || !formData.agent)) {
      toast.error('Please fill in all required fields')
      return
    }
    setStep(prev => prev + 1)
  }

  const handlePrevStep = () => {
    setStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate final step
    if (formData.files.length === 0) {
      toast.error('Please upload at least one file')
      return
    }

    // Here you would send to N8n webhook
    console.log('Submitting to N8n:', formData)
    toast.success('Submission created successfully!')

    // Simulate API call
    setTimeout(() => {
      navigate('/submissions')
    }, 1000)
  }

  const totalWeight = formData.customCriteria.reduce((sum, c) => sum + Number(c.weight || 0), 0)

  // Check if file is an image
  const isImageFile = (file) => {
    return file.type.startsWith('image/')
  }

  // Get file preview
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'videocam'
    if (file.type.startsWith('audio/')) return 'audiotrack'
    if (file.type.includes('pdf')) return 'picture_as_pdf'
    if (file.type.includes('word') || file.type.includes('document')) return 'description'
    if (file.name.match(/\.(js|jsx|ts|tsx|py|java|cpp|c|go|rb|php)$/)) return 'code'
    return 'insert_drive_file'
  }

  return (
    <MainLayout>
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Submission</h1>
            <p className="text-gray-600 flex items-center">
              <span className="material-icons text-primary-600 mr-2">{currentAgentConfig.icon}</span>
              {currentAgentConfig.name}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['Basic Info', 'Industry Details', 'Evaluation Criteria', 'Upload Files'].map((label, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step > index + 1
                      ? 'bg-primary-500 text-white'
                      : step === index + 1
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step > index + 1 ? (
                      <span className="material-icons text-sm">check</span>
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step >= index + 1 ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                  {index < 3 && <div className="flex-1 h-1 bg-gray-300 mx-2"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-2">
                    Submission Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="glass-input w-full"
                    placeholder="e.g., Machine Learning Project Evaluation"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="glass-input w-full"
                    rows="4"
                    placeholder="Provide a brief description of what needs to be evaluated..."
                  />
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-800 mb-2">
                    Industry / Category *
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="glass-input w-full"
                    required
                  >
                    <option value="">Select an industry</option>
                    {industries.map((ind) => (
                      <option key={ind.id} value={ind.id}>
                        {ind.name} - {ind.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Selected AI Agent
                  </label>
                  <div className="glass-card rounded-xl p-4 flex items-center space-x-3">
                    <span className="material-icons text-primary-600 text-3xl">{currentAgentConfig.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{currentAgentConfig.name}</p>
                      <p className="text-sm text-gray-600">{currentAgentConfig.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Industry-Specific Fields */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Industry-Specific Details</h2>

                {industryConfig && industryConfig.additionalFields.length > 0 ? (
                  industryConfig.additionalFields.map((fieldName) => {
                    const fieldConfig = additionalFieldConfigs[fieldName]
                    if (!fieldConfig) return null

                    return (
                      <div key={fieldName}>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                          {fieldConfig.label}
                          {fieldConfig.required && ' *'}
                        </label>
                        {fieldConfig.type === 'select' ? (
                          <select
                            value={formData.industryFields[fieldName] || ''}
                            onChange={(e) => handleIndustryFieldChange(fieldName, e.target.value)}
                            className="glass-input w-full"
                            required={fieldConfig.required}
                          >
                            <option value="">Select {fieldConfig.label}</option>
                            {fieldConfig.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : fieldConfig.type === 'textarea' ? (
                          <textarea
                            value={formData.industryFields[fieldName] || ''}
                            onChange={(e) => handleIndustryFieldChange(fieldName, e.target.value)}
                            className="glass-input w-full"
                            rows="3"
                            placeholder={fieldConfig.label}
                            required={fieldConfig.required}
                          />
                        ) : fieldConfig.type === 'number' ? (
                          <input
                            type="number"
                            value={formData.industryFields[fieldName] || ''}
                            onChange={(e) => handleIndustryFieldChange(fieldName, e.target.value)}
                            className="glass-input w-full"
                            placeholder={fieldConfig.label}
                            required={fieldConfig.required}
                          />
                        ) : (
                          <input
                            type="text"
                            value={formData.industryFields[fieldName] || ''}
                            onChange={(e) => handleIndustryFieldChange(fieldName, e.target.value)}
                            className="glass-input w-full"
                            placeholder={fieldConfig.label}
                            required={fieldConfig.required}
                          />
                        )}
                      </div>
                    )
                  })
                ) : (
                  <p className="text-gray-600">No additional fields required for this industry.</p>
                )}
              </div>
            )}

            {/* Step 3: Evaluation Criteria */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Evaluation Criteria</h2>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="useDefaultRubric"
                      checked={formData.useDefaultRubric}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      Use default rubric for {formData.industry || 'selected industry'}
                    </span>
                  </label>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-800">
                      Evaluation Criteria
                    </label>
                    {!formData.useDefaultRubric && (
                      <button
                        type="button"
                        onClick={addCriterion}
                        className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center"
                      >
                        <span className="material-icons text-sm mr-1">add</span>
                        Add Criterion
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {formData.customCriteria.map((criterion, index) => (
                      <div key={index} className="glass-card rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input
                            type="text"
                            value={criterion.name}
                            onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                            className="glass-input"
                            placeholder="Criterion name"
                            disabled={formData.useDefaultRubric}
                          />
                          <input
                            type="number"
                            value={criterion.weight}
                            onChange={(e) => handleCriteriaChange(index, 'weight', e.target.value)}
                            className="glass-input"
                            placeholder="Weight %"
                            min="0"
                            max="100"
                            disabled={formData.useDefaultRubric}
                          />
                          <input
                            type="text"
                            value={criterion.description}
                            onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                            className="glass-input"
                            placeholder="Description"
                            disabled={formData.useDefaultRubric}
                          />
                        </div>
                        {!formData.useDefaultRubric && formData.customCriteria.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCriterion(index)}
                            className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center"
                          >
                            <span className="material-icons text-sm mr-1">delete</span>
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {totalWeight !== 100 && !formData.useDefaultRubric && (
                    <p className="text-red-600 text-sm mt-2">
                      ⚠️ Total weight should equal 100% (currently {totalWeight}%)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-4">
                    Grading Scale
                  </label>
                  <div className="space-y-2">
                    {formData.gradingScale.map((grade, index) => (
                      <div key={index} className="glass-card rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-gray-900">{grade.name}</span>
                          <span className="text-primary-600 font-medium">{grade.range}</span>
                        </div>
                        <span className="text-sm text-gray-600">{grade.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: File Upload */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Files</h2>

                {/* Agent-specific file upload instructions */}
                <div className="glass-card rounded-xl p-4 bg-primary-50 border border-primary-200">
                  <div className="flex items-start space-x-3">
                    <span className="material-icons text-primary-600">{currentAgentConfig.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{currentAgentConfig.name}</p>
                      <p className="text-sm text-gray-700 mb-2">{currentAgentConfig.description}</p>
                      <p className="text-xs text-gray-600">
                        Supported formats: <strong>{currentAgentConfig.supportedTypes}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="dropzone">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    accept={currentAgentConfig.acceptedFormats}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-center">
                      <span className="material-icons text-6xl text-primary-600 mb-4">cloud_upload</span>
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        Drop files here or click to upload
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        {currentAgentConfig.supportedTypes}
                      </p>
                      <p className="text-xs text-gray-500">
                        Multiple files supported
                      </p>
                    </div>
                  </label>
                </div>

                {formData.files.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 mb-3">
                      Uploaded Files ({formData.files.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.files.map((file, index) => (
                        <div key={index} className="glass-card rounded-lg p-4">
                          {/* Image preview for document-image agent */}
                          {formData.agent === 'document-image' && isImageFile(file) && (
                            <div className="mb-3 rounded-lg overflow-hidden">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-40 object-cover"
                              />
                            </div>
                          )}

                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                              <span className="material-icons text-primary-600 flex-shrink-0">
                                {getFileIcon(file)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-600">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                {isImageFile(file) && (
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    Image
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-700 flex-shrink-0 ml-2"
                            >
                              <span className="material-icons text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="glass-btn-secondary rounded-xl px-6 py-3 flex items-center"
                >
                  <span className="material-icons mr-2">arrow_back</span>
                  Previous
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="glass-btn-primary rounded-xl px-6 py-3 ml-auto flex items-center"
                >
                  Next
                  <span className="material-icons ml-2">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="glass-btn-primary rounded-xl px-8 py-3 ml-auto glow flex items-center"
                >
                  Submit for Evaluation
                  <span className="material-icons ml-2">send</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  )
}

export default CreateSubmissionForm
