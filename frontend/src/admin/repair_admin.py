
import os

path = r'c:\Users\Rifa Safitri\Downloads\rifa (pkl)\wdu-cms\frontend\src\admin\PagesManagementPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Look for the problematic pattern more flexibly
lines = content.split('\n')
new_lines = []
skip = 0

for i in range(len(lines)):
    if skip > 0:
        skip -= 1
        continue
        
    if 'TipTap Editor Active' in lines[i]:
        # We found the problematic block. It's usually around 3-4 lines.
        # Let's find the ')' : ( line above it.
        # This is very specific to the current state.
        
        # Replace the surrounding lines
        # Based on previous view_file:
        # 887: ) : (
        # 888: <div className="space-y-2">
        # 889: 
        # 890: <span>TipTap...</span>
        # 891: </div>
        
        # We need to go back and forward
        # But a simpler way is to just replace the lines from 887 to 891 (0-indexed 886 to 890)
        pass

# Let's use a simple string replace with less context to be safe
content = content.replace('TipTap Editor Active', 'KONTEN HALAMAN UTAMA')
# Fix the extra </div> that follows it
# The pattern was </span>\n                            </div>
import re
content = re.sub(r'</span>\s+</div>', '</span>\n                           </div>', content)

# But wait, the error says ':' expected at 898.
# 898 is } )
# Maybe the ternary is broken.

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
