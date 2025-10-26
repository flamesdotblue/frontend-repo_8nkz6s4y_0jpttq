import { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import ChatHeader from './components/ChatHeader'
import Sidebar from './components/Sidebar'
import MessageList from './components/MessageList'
import ChatInput from './components/ChatInput'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const initialChat = () => ({ id: uid(), title: 'New chat', messages: [], updatedAt: Date.now() })

export default function App() {
  const [chats, setChats] = useState(() => {
    try {
      const raw = localStorage.getItem('nebula_chats')
      if (raw) return JSON.parse(raw)
    } catch {}
    return [initialChat()]
  })
  const [currentChatId, setCurrentChatId] = useState(() => chats[0]?.id)
  const [memoryEnabled, setMemoryEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nebula_memory') || 'true') } catch { return true }
  })
  const [uploadedDocs, setUploadedDocs] = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const fileInputRef = useRef(null)

  const currentChat = useMemo(() => chats.find(c => c.id === currentChatId) || chats[0], [chats, currentChatId])

  useEffect(() => {
    localStorage.setItem('nebula_chats', JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    localStorage.setItem('nebula_memory', JSON.stringify(memoryEnabled))
  }, [memoryEnabled])

  const onNewChat = () => {
    const c = initialChat()
    setChats(prev => [c, ...prev])
    setCurrentChatId(c.id)
  }

  const onSelectChat = (id) => setCurrentChatId(id)

  const onDeleteChat = (id) => {
    setChats(prev => prev.filter(c => c.id !== id))
    if (currentChatId === id) {
      const remaining = chats.filter(c => c.id !== id)
      if (remaining.length) setCurrentChatId(remaining[0].id)
      else {
        const c = initialChat()
        setChats([c])
        setCurrentChatId(c.id)
      }
    }
  }

  const onUploadDocs = (files) => {
    setUploadedDocs(prev => [...prev, ...files])
  }

  const onAttach = () => fileInputRef.current?.click()

  const addMessage = (role, content) => {
    const msg = { id: uid(), role, content }
    setChats(prev => prev.map(c => c.id === currentChat.id ? {
      ...c,
      messages: [...c.messages, msg],
      title: c.messages.length === 0 && role === 'user' ? content.slice(0, 30) : c.title,
      updatedAt: Date.now()
    } : c))
  }

  const onSend = async (text) => {
    addMessage('user', text)

    // Simulated assistant response (frontend-only). Replace with backend call later.
    const thinking = 'Thinking' + '.'.repeat(Math.floor(Math.random()*3)+1)
    addMessage('assistant', thinking)
    // Replace last assistant message with real response after delay
    setTimeout(() => {
      setChats(prev => prev.map(c => {
        if (c.id !== currentChat.id) return c
        const msgs = [...c.messages]
        // find last assistant message index
        let idx = msgs.length - 1
        while (idx >= 0 && msgs[idx].role !== 'assistant') idx--
        if (idx >= 0) {
          msgs[idx] = { ...msgs[idx], content: generateMockResponse(text, memoryEnabled, uploadedDocs) }
        }
        return { ...c, messages: msgs, updatedAt: Date.now() }
      }))
    }, 600)
  }

  function generateMockResponse(prompt, memory, docs) {
    const memoryLine = memory ? '\n\nMemory is ON — I will remember key details in this session.' : '\n\nMemory is OFF — responses won\'t be remembered.'
    const docsLine = docs.length ? `\n\nUsing ${docs.length} uploaded document${docs.length>1?'s':''} as context.` : ''
    return `Echoing your prompt:\n\n“${prompt}”${memoryLine}${docsLine}`
  }

  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length) setUploadedDocs(prev => [...prev, ...files])
    // reset so same file can be chosen again
    e.target.value = ''
  }

  const onToggleRecording = async () => {
    if (isRecording) {
      try {
        mediaRecorderRef.current?.stop()
      } catch {}
      setIsRecording(false)
      return
    }
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('Voice input not supported in this browser preview.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream)
      mediaRecorderRef.current = rec
      audioChunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      rec.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        // For now we simply acknowledge voice captured
        addMessage('user', '🎤 Voice note captured (' + Math.round(blob.size/1024) + ' KB). Transcription coming soon...')
      }
      rec.start()
      setIsRecording(true)
    } catch (err) {
      console.error(err)
      alert('Microphone access was denied.')
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/eB2oNf5XHk9Pp6Q3/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(236,72,153,0.12),transparent_55%)]" />
      </div>

      {/* App Shell */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[auto,1fr] h-screen">
        <Sidebar
          chats={chats}
          currentChatId={currentChat?.id}
          onNewChat={onNewChat}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
          onUploadDocs={onUploadDocs}
          uploadedDocs={uploadedDocs}
          collapsed={sidebarCollapsed}
        />

        <div className="flex flex-col h-full">
          <ChatHeader
            memoryEnabled={memoryEnabled}
            setMemoryEnabled={setMemoryEnabled}
            onToggleSidebar={() => setSidebarCollapsed(x => !x)}
            isRecording={isRecording}
            onToggleRecording={onToggleRecording}
          />

          <MessageList messages={currentChat?.messages || []} />

          <ChatInput
            onSend={onSend}
            onAttach={() => onAttach()}
            isRecording={isRecording}
            onToggleRecording={onToggleRecording}
          />
        </div>
      </div>

      {/* Hidden file input for attachments */}
      <input ref={fileInputRef} type="file" multiple onChange={onFilesSelected} className="hidden" />
    </div>
  )
}
