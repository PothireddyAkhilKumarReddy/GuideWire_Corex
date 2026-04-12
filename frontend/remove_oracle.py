import os

FRONTEND_DIR = 'src'

for root, dirs, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith('.jsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Preserve variable names if possible, but actually we can just replace text displayed.
            # "Oracle" -> "AI System"
            # "oracle" -> "aiSystem"
            # Since the user specifically complained about seeing "Oracle", 
            # I will just replace the display text first to be safe.
            
            content = content.replace("Autonomous Oracle Interception", "Autonomous AI Interception")
            content = content.replace("Zero-Touch Oracle", "Zero-Touch AI System")
            content = content.replace("Oracle Status", "System Status")
            content = content.replace("OracleStatus", "SystemStatus")
            
            # Catch any other random "Oracle" strings in UI text
            content = content.replace(">Oracle<", ">AI System<")
            content = content.replace("Oracle", "AI Engine")

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

print("Oracle references replaced successfully.")
