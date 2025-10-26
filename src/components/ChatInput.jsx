import { useEffect, useRef, useState } from 'react'
import { Send, Paperclip, Mic, PauseCircle } from 'lucide-react'

export default function ChatInput({ onSend, onAttach, isRecording, onToggleRecording }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '0px'
    const scrollHeight = el.scrollHeight
    el.style.height = Math.min(scrollHeight, 160) + 'px'
  }, [value])

  const handleSend = () => {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
  }

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-4 md:px-8 py-4 border-t border-white/10 bg-black/40">
      <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
        <div className="flex items-end gap-2">
          <button
            onClick={() => onAttach()}
            className="shrink-0 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 h-10 w-10"
            aria-label="Attach files"
          >
            <Paperclip size={16} />
          </button>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Nebula..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-white placeholder-white/40 focus:outline-none max-h-40"
          />
          <button
            onClick={onToggleRecording}
            className={`shrink-0 inline-flex items-center justify-center rounded-lg border h-10 w-10 ${isRecording ? 'border-rose-500/40 bg-rose-500/20 text-rose-200' : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'}`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? <PauseCircle size={18} /> : <Mic size={16} />}
          </button>
          <button
            onClick={handleSend}
            className="shrink-0 inline-flex items-center justify-center rounded-lg border border-violet-500/40 bg-violet-500/20 text-violet-100 hover:bg-violet-500/30 h-10 w-10"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="px-2 pt-2 text-[10px] uppercase tracking-wider text-white/40">
          Press ⌘/Ctrl + Enter to send
        </div>
      </div>
    </div>
  )
}
