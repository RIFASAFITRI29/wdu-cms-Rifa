
import re

path = r'c:\Users\Rifa Safitri\Downloads\rifa (pkl)\wdu-cms\frontend\src\admin\PagesManagementPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix Intro Section
intro_pattern = r'<div className="space-y-2">\s+<label.*?>KATA PENGANTAR.*?</label>\s+<textarea.*?\/>\s+<\/div>'
intro_replacement = '''<div className="space-y-2">
                                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">KATA PENGANTAR (TEKS SAMPING FOTO)</label>
                                       <TiptapEditor 
                                         content={editingPage.sections?.intro?.content || editingPage.content || ""}
                                         theme={theme}
                                         onChange={(html) => updateSection("intro", "content", html)}
                                       />
                                    </div>'''

content = re.sub(intro_pattern, intro_replacement, content, flags=re.DOTALL)

# 2. Add Services Section before Stats
stats_pattern = r'{\/\* Home Stats Section \*\/}'
services_block = '''{/* Home Services Section */}
                           <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
                              <div className="flex items-center gap-2 mb-2">
                                 <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">DESKRIPSI LAYANAN UTAMA</h4>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">RINGKASAN SOLUSI (DI BAWAH JUDUL LAYANAN)</label>
                                 <TiptapEditor 
                                   content={editingPage.sections?.services?.content || ""}
                                   theme={theme}
                                   onChange={(html) => updateSection("services", "content", html)}
                                 />
                              </div>
                           </div>

                           {/* Home Stats Section */}'''

content = content.replace(stats_pattern, services_block)

# 3. Fix Trust Section textarea
trust_pattern = r'<label className="text-\[10px\] font-black uppercase tracking-widest text-zinc-400 ml-1">SUB JUDUL / DESKRIPSI</label>\s+<textarea.*?\/>'
trust_replacement = '''<label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">SUB JUDUL / DESKRIPSI</label>
                                    <TiptapEditor 
                                      content={editingPage.sections?.trust?.content || ""}
                                      theme={theme}
                                      onChange={(html) => updateSection("trust", "content", html)}
                                    />'''

content = re.sub(trust_pattern, trust_replacement, content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
