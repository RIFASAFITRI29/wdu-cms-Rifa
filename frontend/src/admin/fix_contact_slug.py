
path = r'c:\Users\Rifa Safitri\Downloads\rifa (pkl)\wdu-cms\frontend\src\admin\PagesManagementPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Handle both 'contact' and 'kontak' slugs for the special contact fields UI
content = content.replace("editingPage.slug === 'contact'", "['contact', 'kontak'].includes(editingPage.slug)")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
