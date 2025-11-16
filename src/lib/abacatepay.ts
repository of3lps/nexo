const ABACATEPAY_API_URL = 'https://api.abacatepay.com/v1'
const API_KEY = process.env.ABACATEPAY_API_KEY

class AbacatePayClient {
  private headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }

  async createCustomer(data: {
    name: string
    email: string
    document?: string
  }) {
    const response = await fetch(`${ABACATEPAY_API_URL}/customers`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async createSubscription(data: {
    customer_id: string
    plan_id: string
    trial_days?: number
  }) {
    const response = await fetch(`${ABACATEPAY_API_URL}/subscriptions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async createCheckout(data: {
    customer_id: string
    plan_id: string
    success_url: string
    cancel_url: string
    trial_days?: number
  }) {
    const response = await fetch(`${ABACATEPAY_API_URL}/checkout`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async getSubscription(subscriptionId: string) {
    const response = await fetch(`${ABACATEPAY_API_URL}/subscriptions/${subscriptionId}`, {
      headers: this.headers
    })
    return response.json()
  }

  async cancelSubscription(subscriptionId: string) {
    const response = await fetch(`${ABACATEPAY_API_URL}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: this.headers
    })
    return response.json()
  }
}

export const abacatepay = new AbacatePayClient()