'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/Toast'
import { formatDateTime } from '@/lib/utils'

interface Note {
  id: string
  content: string
  author_id: string
  created_at: string
}

export function InternalNotesPanel({ clientId, authorId, initialNotes }: {
  clientId: string
  authorId: string
  initialNotes: Note[]
}) {
  const supabase = createClient()
  const { success, error: toastError } = useToast()

  const [notes,   setNotes]   = useState<Note[]>(initialNotes)
  const [content, setContent] = useState('')
  const [saving,  setSaving]  = useState(false)

  async function addNote() {
    if (!content.trim()) return
    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('internal_notes')
        .insert({ client_id: clientId, author_id: authorId, content: content.trim() })
        .select().single()
      if (error) throw new Error(error.message)
      setNotes((prev) => [data as Note, ...prev])
      setContent('')
      success('Note saved')
    } catch (err: unknown) {
      toastError('Error', err instanceof Error ? err.message : 'Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  async function deleteNote(id: string) {
    await supabase.from('internal_notes').delete().eq('id', id)
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white sticky top-6">
      <div className="px-4 py-3 border-b border-[#f1f5f9] bg-[#f8fafc]">
        <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest">Internal Notes</p>
        <p className="text-[11px] text-[#94a3b8] mt-0.5">Visible to admin team only</p>
      </div>

      <div className="p-4 border-b border-[#f1f5f9]">
        <textarea value={content} onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote() }}
          placeholder="Add a note… (Cmd+Enter to save)" rows={3}
          className="w-full rounded-xl border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f172a] placeholder:text-[#94a3b8] outline-none focus:border-[#94a3b8] focus:ring-2 focus:ring-[#eef2f6] resize-none transition-all" />
        <button onClick={addNote} disabled={!content.trim() || saving}
          className="mt-2 w-full py-1.5 rounded-xl text-xs font-semibold bg-[#0f172a] text-white transition-all disabled:opacity-40 hover:bg-[#1e293b]">
          {saving ? 'Saving…' : 'Add Note'}
        </button>
      </div>

      <div className="divide-y divide-[#f1f5f9] max-h-[480px] overflow-y-auto">
        {notes.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-[#94a3b8]">No notes yet.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="p-4 group">
              <p className="text-sm text-[#0f172a] leading-relaxed whitespace-pre-wrap">{note.content}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-[#94a3b8]">{formatDateTime(note.created_at)}</p>
                {note.author_id === authorId && (
                  <button onClick={() => deleteNote(note.id)}
                    className="text-[11px] text-[#94a3b8] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}