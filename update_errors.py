import os
import re
import glob

FRONTEND_DIR = r"c:\Users\raman\Pictures\satta matka\sattaamatka gameplay\frontend\app\admin"

# We want to replace patterns like:
# setError(e?.response?.data?.detail || "Failed to load withdrawals");
# with:
# setError(parseApiError(e, "Failed to load withdrawals"));
# and ensure import { parseApiError } from "@/lib/error-parser"; is present.

pattern = re.compile(r"setError\(\s*e\?\.response\?\.data\?\.detail\s*\|\|\s*(\".*?\")\s*\)")
alert_pattern = re.compile(r"alert\(\s*e\?\.response\?\.data\?\.detail\s*\|\|\s*(\".*?\")\s*\)")

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    content = pattern.sub(r'setError(parseApiError(e, \1))', content)
    content = alert_pattern.sub(r'alert(parseApiError(e, \1))', content)
    
    # Also replace setActionError
    content = re.sub(
        r"setActionError\(\s*e\?\.response\?\.data\?\.detail\s*\|\|\s*(\".*?\")\s*\)",
        r'setActionError(parseApiError(e, \1))',
        content
    )

    if content != original_content:
        # Check if we need to add the import
        if "parseApiError" in content and "error-parser" not in content:
            # add import after the first import block
            import_statement = "import { parseApiError } from \"@/lib/error-parser\";\n"
            
            # Simple heuristic: find last import
            last_import_idx = content.rfind("import ")
            if last_import_idx != -1:
                end_of_line = content.find("\n", last_import_idx)
                content = content[:end_of_line+1] + import_statement + content[end_of_line+1:]
            else:
                content = import_statement + content

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(FRONTEND_DIR):
    for name in files:
        if name.endswith(".tsx") or name.endswith(".ts"):
            process_file(os.path.join(root, name))
