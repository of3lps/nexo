async function testLogin() {
  try {
    console.log('Testando login...')
    
    const response = await fetch('http://localhost:3000/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        email: 'teste@exemplo.com',
        password: '123456',
        csrfToken: 'test'
      })
    })

    console.log('Status:', response.status)
    const result = await response.text()
    console.log('Resposta:', result)

  } catch (error) {
    console.error('Erro no login:', error)
  }
}

testLogin()