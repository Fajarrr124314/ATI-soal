import json

with open("c:/form ATI/src/data/defaultConfig.ts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update totalQuestions and shuffleQuestions for Sesi 3 in DEFAULT_SETTINGS
content = content.replace("totalQuestions: 157,", "totalQuestions: 150,")
content = content.replace("shuffleQuestions: true, // Diacak sesuai permintaan user", "shuffleQuestions: false, // Sudah diacak permanen dan sinkron dengan PDF Soal")
content = content.replace("Pilihlah respon yang paling sesuai: SS (Sangat Setuju), S (Setuju), TS (Tidak Setuju), STS (Sangat Tidak Setuju). Urutan soal diacak untuk melatih fokus Anda.", "Pilihlah respon pada lembar jawaban: SS (Sangat Sesuai), S (Sesuai), TS (Tidak Sesuai), STS (Sangat Tidak Sesuai) sesuai nomor pada Lembar Soal Sesi 3.")

# 2. Replace DEFAULT_ANSWER_KEYS_SESI_3
with open("c:/form ATI/sesi3_keys_ts.txt", "r", encoding="utf-8") as f:
    new_keys_body = f.read()

start_marker = "export const DEFAULT_ANSWER_KEYS_SESI_3: Record<number, string> = {"
end_marker = "};\n\nexport function buildQuestions("

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

if start_pos != -1 and end_pos != -1:
    replacement = f"{start_marker}\n{new_keys_body}\n"
    content = content[:start_pos] + replacement + content[end_pos:]
    print("Replaced DEFAULT_ANSWER_KEYS_SESI_3 successfully!")
else:
    print("Could not find markers:", start_pos, end_pos)

# 3. Update buildQuestions
content = content.replace("const total = session === 1 ? 20 : session === 2 ? 45 : 157;", "const total = session === 1 ? 20 : session === 2 ? 45 : 150;")
content = content.replace("prompt: `Soal Nomor ${i}`,", "prompt: `Nomor ${i}`,")

with open("c:/form ATI/src/data/defaultConfig.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated defaultConfig.ts successfully!")
