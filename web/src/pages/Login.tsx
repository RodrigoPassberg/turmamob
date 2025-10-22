import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const uri = import.meta.env.VITE_API_URI || 'http://10.87.202.160:3000'
axios.defaults.baseURL = uri

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [alertData, setAlertData] = useState<{ title: string; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    setLoading(true)
    axios.post('/login', { email, senha })
      .then(response => { return { status: response.status, response: response.data } })
      .then(({ status, response }) => {
        if (status === 200) {
          setAlertData({ title: 'Sucesso', message: 'Login realizado com sucesso!' })
          window.localStorage.setItem('professor', JSON.stringify(response))
          setTimeout(() => {
            navigate('/home')
          }, 1000)
        }
      })
      .catch((error) => {
        const status = error?.response?.status
        if (status === 401) {
          setAlertData({ title: 'Erro', message: 'Falha no login. Verifique suas credenciais.' })
          return
        }
        setAlertData({ title: 'Erro', message: 'Erro ao conectar com o servidor. Tente novamente mais tarde.' })
      })
      .finally(() => setLoading(false))
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <form
        onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
        className="w-full max-w-sm"
      >
        <Card className="shadow-xl rounded-2xl border border-gray-700 bg-gray-900">
          <CardHeader className="text-center py-6 border-b border-gray-700">
            <CardTitle className="text-3xl font-extrabold text-white tracking-wide">Bem-vindo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 px-8 py-8 bg-gray-800 rounded-b-2xl">
            {alertData && (
              <Alert
                className={`rounded-md px-4 py-3 border ${
                  alertData.title === 'Sucesso'
                    ? 'bg-green-900 border-green-600 text-green-400'
                    : 'bg-red-900 border-red-600 text-red-400'
                }`}
              >
                <AlertTitle className="font-semibold">{alertData.title}</AlertTitle>
                <AlertDescription>{alertData.message}</AlertDescription>
              </Alert>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-3"
              required
              disabled={loading}
              autoComplete="username"
            />
            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
              className="w-full border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-3"
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              className={`w-full rounded-lg py-3 font-semibold text-white transition-colors duration-300 ${
                loading
                  ? 'bg-blue-600 cursor-not-allowed opacity-70'
                  : 'bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-400'
              }`}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  )
}

export default Login
