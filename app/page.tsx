'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

type Todo = {
  id: string
  title: string
  done: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  // Mock API functions since we don't have actual backend
  async function refresh() {
    // Mock data for demonstration
    const mockTodos = [
      { id: '1', title: 'Belajar React', done: false },
      { id: '2', title: 'Membuat todo app', done: true },
      { id: '3', title: 'Deploy aplikasi', done: false }
    ]
    setTodos(mockTodos)
  }

  useEffect(() => { refresh() }, [])

  async function addTodo(e?: React.FormEvent | React.KeyboardEvent) {
    if (e) e.preventDefault()
    if (!title.trim()) return
    
    const newTodo = {
      id: Date.now().toString(),
      title: title.trim(),
      done: false
    }
    setTodos(prev => [...prev, newTodo])
    setTitle('')
  }

  async function toggle(id: string, done: boolean) {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, done: !done } : todo
    ))
  }

  async function remove(id: string) {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  async function startEdit(id: string, currentTitle: string) {
    setEditingId(id)
    setEditingTitle(currentTitle)
  }

  async function saveEdit() {
    if (!editingTitle.trim()) return
    
    setTodos(prev => prev.map(todo => 
      todo.id === editingId ? { ...todo, title: editingTitle.trim() } : todo
    ))
    setEditingId(null)
    setEditingTitle('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingTitle('')
  }

  const completedCount = todos.filter(t => t.done).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <main className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ✨ Todo CRUD App
          </h1>
          <p className="text-gray-600">
            Kelola tugas Anda dengan mudah
          </p>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
              <div className="text-sm text-gray-500">Total Tugas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-sm text-gray-500">Selesai</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{totalCount - completedCount}</div>
              <div className="text-sm text-gray-500">Tersisa</div>
            </div>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-3">
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Tambah tugas baru..." 
              onKeyPress={e => e.key === 'Enter' && addTodo(e)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Tambah
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">Belum ada tugas</p>
              <p className="text-gray-400">Tambah tugas pertama Anda!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {todos.map((todo, index) => (
                <li key={todo.id} className={`p-4 transition-all duration-200 ${todo.done ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggle(todo.id, todo.done)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                        todo.done 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {todo.done && <Check size={16} />}
                    </button>

                    {/* Todo Content */}
                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <div className="flex gap-2">
                          <input
                            value={editingTitle}
                            onChange={e => setEditingTitle(e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={saveEdit}
                            className="text-green-600 hover:text-green-700 p-1"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className={`text-lg ${todo.done ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {todo.title}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {editingId !== todo.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(todo.id, todo.title)}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => remove(todo.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>✨ Dibuat dengan React dan Tailwind CSS</p>
        </div>
      </main>
    </div>
  ) 
}