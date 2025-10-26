import { motion, AnimatePresence } from 'framer-motion'
import { Bot, User } from 'lucide-react'

export default function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((m) => (
          <motion.div
            key={m.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className={`flex items-start gap-3 ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            {m.role === 'assistant' && (
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 backdrop-blur ${m.role === 'assistant' ? 'bg-white/5 text-white' : 'bg-violet-500/20 text-violet-50 border border-violet-500/30'}`}>
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
            {m.role === 'user' && (
              <div className="h-8 w-8 rounded-md bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <User size={16} className="text-white/80" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
