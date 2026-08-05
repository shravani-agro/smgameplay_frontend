import glob, os

files = [
    'app/admin/markets/page.tsx',
    'app/admin/page.tsx',
    'app/admin/settings/page.tsx',
    'app/admin/starline/page.tsx',
    'app/admin/users/page.tsx',
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('import {\nimport { parseApiError } from "@/lib/error-parser";', 'import { parseApiError } from "@/lib/error-parser";\nimport {')
    content = content.replace('// Need to import deductUserFunds from "@/lib/admin" first\nimport { parseApiError } from "@/lib/error-parser";', '// Need to import deductUserFunds from "@/lib/admin" first')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
