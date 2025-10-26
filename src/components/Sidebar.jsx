import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Upload, Folder, Paperclip } from 'lucide-react'

export default function Sidebar({ chats, currentChatId, onNewChat, onSelectChat, onDeleteChat, onUploadDocs, uploadedDocs, collapsed }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return chats.filter(c => c.title.toLowerCase().includes(q))
  }, [search, chats])

  // Local time greeting
  const [greeting, setGreeting] = useState('')
  useEffect(() => {
    const h = new Date().getHours()
    const g = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
    setGreeting(g)
  }, [])

  return (
    <aside className={`h-full w-full md:w-80 shrink-0 border-r border-white/10 bg-black/30 backdrop-blur ${collapsed ? 'hidden md:flex' : 'flex'} flex-col`}>      
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-white/80 text-sm">{greeting}</p>
          <button onClick={onNewChat} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition">
            <Plus size={16} />
            <span className="text-sm">New chat</span>
          </button>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chats"
          className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-white/40 text-sm p-4">No chats yet. Start a conversation!</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map(chat => (
              <li key={chat.id} className={`group flex items-center justify-between gap-2 px-4 py-3 cursor-pointer transition ${chat.id === currentChatId ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                <button onClick={() => onSelectChat(chat.id)} className="text-left flex-1">
                  <p className="text-white text-sm line-clamp-1">{chat.title}</p>
                  <p className="text-white/40 text-xs">{new Date(chat.updatedAt).toLocaleString()}</p>
                </button>
                <button onClick={() => onDeleteChat(chat.id)} className="opacity-0 group-hover:opacity-100 transition text-white/60 hover:text-rose-300">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Folder size={16} className="text-white/60" />
          <p className="text-white/80 text-sm">Knowledge base</p>
        </div>
        <label className="block">
          <div className="w-full flex items-center justify-center gap-2 rounded-md bg-white/5 border border-dashed border-white/10 px-3 py-2 text-sm text-white/70 hover:bg-white/10 transition cursor-pointer">
            <Upload size={16} /> Upload documents
            <input type="file" multiple className="hidden" onChange={(e) => onUploadDocs(Array.from(e.target.files || []))} />
          </div>
        </label>
        {uploadedDocs.length > 0 && (
          <div className="mt-3 space-y-2 max-h-32 overflow-y-auto pr-1">
            {uploadedDocs.map((f, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                <Paperclip size={14} className="text-white/40" />
                <span className="truncate">{f.name}</span>
                <span className="text-white/30">({Math.round(f.size/1024)} KB)</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
