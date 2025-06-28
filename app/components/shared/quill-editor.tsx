'use client'

import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

type QuillEditorProps = {
  id: string
  value: string
  onChange: (val: string) => void
  height?: string 
}

const QuillEditor = ({ id, value, onChange, height = '200px' }: QuillEditorProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const quillInstanceRef = useRef<Quill | null>(null)

  useEffect(() => {
    if (!editorRef.current || quillInstanceRef.current) return

    quillInstanceRef.current = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: 'Enter text here...',
    })

    if (value) {
      quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value)
    }

    quillInstanceRef.current.on('text-change', () => {
      const html = quillInstanceRef.current!.root.innerHTML
      onChange(html)
    })
  }, [])

  useEffect(() => {
    if (quillInstanceRef.current && value) {
      const editor = quillInstanceRef.current
      const currentHTML = editor.root.innerHTML
      if (value !== currentHTML) {
        editor.clipboard.dangerouslyPasteHTML(value)
      }
    }
  }, [value])

  return <div id={id} ref={editorRef} style={{ height }} />
}

export default QuillEditor
