'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ArrowRight, Check } from 'lucide-react'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1: Company Info
    companyName: '',
    slug: '',
    
    // Step 2: Admin User
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    
    // Step 3: Plan
    plan: 'STARTER'
  })
  const router = useRouter()

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleCompanyNameChange = (name: string) => {
    setFormData({
      ...formData,
      companyName: name,
      slug: generateSlug(name)
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      // 1. Criar tenant
      const tenantResponse = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.companyName,
          slug: formData.slug,
          email: formData.adminEmail,
          password: formData.adminPassword,
          adminName: formData.adminName,
          plan: formData.plan
        })
      })

      if (!tenantResponse.ok) {
        const error = await tenantResponse.json()
        alert(error.error || 'Erro ao criar conta')
        return
      }

      const { tenant } = await tenantResponse.json()

      // 2. Criar checkout AbacatePay
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: tenant.id,
          plan: formData.plan
        })
      })

      if (checkoutResponse.ok) {
        const { checkout_url } = await checkoutResponse.json()
        window.location.href = checkout_url
      } else {
        setStep(4) // Success step sem pagamento
      }
    } catch (error) {
      alert('Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter',
      price: 'R$ 49',
      features: ['Até 100 membros', '5 comunidades', 'Suporte básico']
    },
    {
      id: 'PRO',
      name: 'Pro',
      price: 'R$ 99',
      features: ['Até 500 membros', 'Comunidades ilimitadas', 'Analytics avançado', 'Suporte prioritário']
    },
    {
      id: 'ENTERPRISE',
      name: 'Enterprise',
      price: 'R$ 199',
      features: ['Membros ilimitados', 'White-label', 'Domínio customizado', 'Suporte dedicado']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-nexo-lightGray via-white to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-nexo-orange to-nexo-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-nexo-navy mb-4">
            Crie sua Comunidade
          </h1>
          <p className="text-nexo-mediumGray text-lg">
            Configure sua plataforma em poucos minutos
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= i ? 'bg-nexo-orange text-white' : 'bg-nexo-lightGray text-nexo-mediumGray'
              }`}>
                {step > i ? <Check className="w-5 h-5" /> : i}
              </div>
              {i < 3 && (
                <div className={`w-16 h-1 mx-4 ${
                  step > i ? 'bg-nexo-orange' : 'bg-nexo-lightGray'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-nexo-lightGray p-8 max-w-2xl mx-auto">
          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nexo-navy mb-6">Informações da Empresa</h2>
              
              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleCompanyNameChange(e.target.value)}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  placeholder="Ex: Minha Empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">
                  URL da Comunidade *
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="flex-1 px-4 py-3 border border-nexo-lightGray rounded-l-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                    placeholder="minha-empresa"
                  />
                  <span className="px-4 py-3 bg-nexo-lightGray border border-l-0 border-nexo-lightGray rounded-r-lg text-nexo-mediumGray">
                    .nexo.com
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.companyName || !formData.slug}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Admin User */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nexo-navy mb-6">Conta do Administrador</h2>
              
              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  value={formData.adminPassword}
                  onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.adminName || !formData.adminEmail || !formData.adminPassword}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Plan Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-nexo-navy mb-6">Escolha seu Plano</h2>
              
              <div className="grid gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setFormData({...formData, plan: plan.id})}
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.plan === plan.id
                        ? 'border-nexo-orange bg-nexo-orange/5'
                        : 'border-nexo-lightGray hover:border-nexo-orange/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-nexo-navy">{plan.name}</h3>
                      <span className="text-2xl font-bold text-nexo-orange">{plan.price}/mês</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-nexo-mediumGray">
                          <Check className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 btn-secondary"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Criando...' : 'Criar Conta'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-nexo-navy">Conta Criada com Sucesso!</h2>
              <p className="text-nexo-mediumGray">
                Sua comunidade está pronta! Acesse em:
              </p>
              <div className="p-4 bg-nexo-lightGray rounded-lg">
                <code className="text-nexo-orange font-semibold">
                  https://{formData.slug}.nexo.com
                </code>
              </div>
              <button
                onClick={() => window.location.href = `https://${formData.slug}.nexo.com`}
                className="btn-primary"
              >
                Acessar Minha Comunidade
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}