import { useEffect, useState } from 'react'
import { Brain, Settings, Mic, PauseCircle, Sparkles } from 'lucide-react'

export default function ChatHeader({ memoryEnabled, setMemoryEnabled, onToggleSidebar, isRecording, onToggleRecording }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="w-full flex items-center justify-between py-4 px-4 md:px-6 border-b border-white/10 backdrop-blur sticky top-0 z-20 bg-black/40">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-white/80 hover:text-white hover:border-white/20 transition" aria-label="Toggle sidebar">
          <Settings size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold leading-none">Nebula Chat</p>
            <p className="text-xs text-white/50">Your 3D-native AI copilot</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={() => setMemoryEnabled(!memoryEnabled)}
          className={`inline-flex items-center gap-2 rounded-full px-3 md:px-4 py-2 text-sm border transition ${
            memoryEnabled ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200' : 'bg-white/5 border-white/10 text-white/70'
          }`}
          aria-pressed={memoryEnabled}
        >
          <Brain size={16} />
          <span className="hidden sm:inline">Memory</span>
          <span className={`ml-1 text-[10px] uppercase tracking-wider ${memoryEnabled ? 'text-emerald-300' : 'text-white/50'}`}>
            {memoryEnabled ? 'On' : 'Off'}
          </span>
        </button>

        <button
          onClick={onToggleRecording}
          className={`inline-flex items-center gap-2 rounded-full px-3 md:px-4 py-2 text-sm border transition ${
            isRecording ? 'bg-rose-500/20 border-rose-500/40 text-rose-200' : 'bg-white/5 border-white/10 text-white/70'
          }`}
          aria-pressed={isRecording}
          aria-label={isRecording ? 'Stop voice input' : 'Start voice input'}
        >
          {isRecording ? <PauseCircle size={16} /> : <Mic size={16} />}
          <span className="hidden sm:inline">Voice</span>
        </button>
      </div>
    </header>
  )
}
