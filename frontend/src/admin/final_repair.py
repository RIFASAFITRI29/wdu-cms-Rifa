
import re

path = r'c:\Users\Rifa Safitri\Downloads\rifa (pkl)\wdu-cms\frontend\src\admin\PagesManagementPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken div structure around TiptapEditor at line 892
# We look for the pattern: ) : ( ... <div ... TipTap Editor Active ... </div> ... <TiptapEditor
pattern = r'\) : \(\s+<div className="space-y-2">\s+<span className=".*?">TipTap Editor Active</span>\s+</div>\s+<TiptapEditor'

replacement = ') : (\n                        <div className="space-y-4">\n                           <div className="flex items-center gap-2 mb-2">\n                              <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>\n                              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">KONTEN HALAMAN UTAMA</h4>\n                           </div>\n                           <TiptapEditor'

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Also remove the unused applyFormat function
new_content = re.sub(r'const applyFormat = \(tag: string\) => \{.*?  \};', '', new_content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)
