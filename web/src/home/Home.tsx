import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from 'axios'

const uri = import.meta.env.VITE_API_URI || 'http://10.87.202.160:3000'
axios.defaults.baseURL = uri

function Home() {
  const navigate = useNavigate()
  const professor = JSON.parse(window.localStorage.getItem('professor') ?? '{}')
  const [turmas, setTurmas] = useState<Array<{ id: number; nome: string }>>([])
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!professor.id) {
      sair()
      return
    }
    axios.get('/turma/' + professor.id)
      .then(response => { setTurmas(response.data) })
      .catch(error => {
        console.error('Erro ao buscar turmas:', error)
      })
  }, [])

  function sair() {
    window.localStorage.removeItem('professor')
    navigate('/login')
  }

  function excluir(turmaId: number) {
    axios.delete('/turma/' + turmaId)
      .then(response => { return { status: response.status, response: response.data } })
      .then(({ status }) => {
        if (status == 204) {
          setTurmas(turmas.filter(turma => turma.id !== turmaId))
          return
        }
      })
      .catch((error) => {
        const status = error?.response?.status
        if (status === 409) {
          alert(error?.response.data?.message || 'Falha ao excluir turma.')
          return
        }
      })
  }

  return (<>
    {/* Header */}
    <header className="w-full bg-white text-gray-800 flex flex-row items-center justify-between px-8 h-16 shadow-sm border-b border-gray-200">
      <h1 className="font-semibold text-xl">{professor.nome}</h1>
      <Button
        variant="destructive"
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 rounded-md transition-colors"
        onClick={sair}
      >
        Sair
      </Button>
    </header>

    {/* Main content */}
    <main className="min-h-screen flex items-start justify-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl space-y-8">
        {/* Botão de cadastro */}
        <div className="w-full flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors px-6 py-2">
                + Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px] bg-white rounded-xl shadow-lg border border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-blue-900 text-lg font-semibold">Cadastrar nova turma</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Informe o nome da turma para adicioná-la à sua lista.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                const professorId = Number(professor?.id)
                if (!professorId) {
                  alert('Professor inválido. Faça login novamente.')
                  return
                }
                setSubmitting(true)
                axios.post('/turma', { nome, professorId })
                  .then(() => {
                    setNome("")
                    setOpen(false)
                    return axios.get('/turma/' + professorId)
                  })
                  .then((response) => {
                    if (response) setTurmas(response.data)
                  })
                  .catch((error) => {
                    console.error('Erro ao cadastrar turma:', error)
                    alert(error?.response?.data?.message || 'Erro ao cadastrar turma')
                  })
                  .finally(() => setSubmitting(false))
              }} className="space-y-5">
                <Input
                  type="text"
                  placeholder="Nome da turma"
                  value={nome}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                  className="border-gray-300 focus:ring-2 focus:ring-blue-400 rounded-md px-3 py-2"
                  required
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={submitting || !nome.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold px-6 py-2 transition-colors"
                  >
                    {submitting ? 'Enviando...' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de turmas */}
        <section>
          <h2 className="font-semibold text-blue-900 text-2xl mb-5">Suas Turmas</h2>
          {turmas.length === 0 ? (
            <p className="text-gray-500 italic">Nenhuma turma cadastrada ainda.</p>
          ) : (
            <ul className="space-y-4">
              {turmas.map(turma => (
                <li
                  key={turma.id}
                  className="w-full flex justify-between items-center px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-gray-800 font-semibold">{turma.id} — {turma.nome}</span>
                  <div className="flex space-x-3">
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 font-semibold transition-colors"
                      onClick={() => excluir(turma.id)}>
                      Excluir
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 font-semibold transition-colors"
                      onClick={() => {
                        navigate('/atividades', {
                          state: { turmaId: turma.id, nome: turma.nome }
                        })
                      }}>
                      Visualizar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  </>)
}

export default Home
