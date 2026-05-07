import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  theme: string;
}

const extensions = [StarterKit.configure()];

const TiptapEditor = ({ content, onChange, theme }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions,
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl outline-none min-h-[200px] max-w-none ${
          theme === 'dark' ? 'prose-invert text-white' : 'text-zinc-900'
        }`,
      },
    },
  });

  // Update content when it changes externally (e.g. when switching pages)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // ONLY update if the editor is not focused to avoid cursor jumping while typing
      if (!editor.isFocused) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const MenuButton = ({ icon, onClick, active = false }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-lg transition-all ${
        active 
          ? 'bg-emerald-600 text-white shadow-lg' 
          : theme === 'dark' ? 'text-zinc-400 hover:bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-100'
      }`}
    >
      <span className="material-symbols-outlined text-lg font-bold">{icon}</span>
    </button>
  );

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 ${
      theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
    }`}>
      {/* Toolbar */}
      <div className={`p-2 border-b flex flex-wrap gap-1 ${
        theme === 'dark' ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50/50 border-zinc-200'
      }`}>
        <MenuButton 
          icon="format_bold" 
          onClick={() => editor?.chain().focus().toggleBold().run()} 
          active={editor?.isActive('bold')} 
        />
        <MenuButton 
          icon="format_italic" 
          onClick={() => editor?.chain().focus().toggleItalic().run()} 
          active={editor?.isActive('italic')} 
        />
        <MenuButton 
          icon="format_strikethrough" 
          onClick={() => editor?.chain().focus().toggleStrike().run()} 
          active={editor?.isActive('strike')} 
        />
        <div className={`w-px h-6 mx-1 my-auto ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        <MenuButton 
          icon="format_h1" 
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} 
          active={editor?.isActive('heading', { level: 1 })} 
        />
        <MenuButton 
          icon="format_h2" 
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} 
          active={editor?.isActive('heading', { level: 2 })} 
        />
        <div className={`w-px h-6 mx-1 my-auto ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        <MenuButton 
          icon="format_list_bulleted" 
          onClick={() => editor?.chain().focus().toggleBulletList().run()} 
          active={editor?.isActive('bulletList')} 
        />
        <MenuButton 
          icon="format_list_numbered" 
          onClick={() => editor?.chain().focus().toggleOrderedList().run()} 
          active={editor?.isActive('orderedList')} 
        />
        <div className={`w-px h-6 mx-1 my-auto ${theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
        <MenuButton 
          icon="format_quote" 
          onClick={() => editor?.chain().focus().toggleBlockquote().run()} 
          active={editor?.isActive('blockquote')} 
        />
        <MenuButton 
          icon="undo" 
          onClick={() => editor?.chain().focus().undo().run()} 
        />
        <MenuButton 
          icon="redo" 
          onClick={() => editor?.chain().focus().redo().run()} 
        />
      </div>

      {/* Editor Content Area */}
      <div className="p-6 overflow-y-auto max-h-[400px] min-h-[200px] custom-scrollbar">
        <EditorContent editor={editor} />
      </div>

      <div className={`px-4 py-1 border-t text-[8px] font-black uppercase tracking-widest ${
        theme === 'dark' ? 'bg-zinc-950/30 border-zinc-800 text-zinc-500' : 'bg-zinc-50/30 border-zinc-100 text-zinc-400'
      }`}>
        Pro Rich Editor Active
      </div>
    </div>
  );
};

export default TiptapEditor;
