import json

with open("c:/form ATI/sesi3_157_shuffled.json", "r", encoding="utf-8") as f:
    items = json.load(f)

# Build TS keys text
lines = []
for it in items:
    lines.append(f'  {it["new_num"]}: \'{it["answer"]}\',')

new_keys_body = "\n".join(lines)

with open("c:/form ATI/src/data/defaultConfig.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Update totalQuestions for Sesi 3 to 157
content = content.replace("totalQuestions: 150,", "totalQuestions: 157,")
content = content.replace("Sesi 3: Lembar Jawaban Kuesioner (150 Butir)", "Sesi 3: Lembar Jawaban Kuesioner (157 Butir)")
content = content.replace("const total = session === 1 ? 20 : session === 2 ? 45 : 150;", "const total = session === 1 ? 20 : session === 2 ? 45 : 157;")

# Replace DEFAULT_ANSWER_KEYS_SESI_3
start_marker = "export const DEFAULT_ANSWER_KEYS_SESI_3: Record<number, string> = {"
end_marker = "};\n\nexport function buildQuestions("

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

if start_pos != -1 and end_pos != -1:
    replacement = f"{start_marker}\n{new_keys_body}\n"
    content = content[:start_pos] + replacement + content[end_pos:]
    print("Replaced DEFAULT_ANSWER_KEYS_SESI_3 with 157 accurate keys!")
else:
    print("Could not find markers:", start_pos, end_pos)

with open("c:/form ATI/src/data/defaultConfig.ts", "w", encoding="utf-8") as f:
    f.write(content)

# Update storage.ts
with open("c:/form ATI/src/services/storage.ts", "r", encoding="utf-8") as f:
    storage_code = f.read()

storage_code = storage_code.replace("ati_form_settings_v2", "ati_form_settings_v3")
storage_code = storage_code.replace("ati_answer_keys_sesi_3_v2", "ati_answer_keys_sesi_3_v3")
storage_code = storage_code.replace("totalQuestions: 150,", "totalQuestions: 157,")

with open("c:/form ATI/src/services/storage.ts", "w", encoding="utf-8") as f:
    f.write(storage_code)

print("Updated storage.ts with v3 keys and 157 items.")
