import json

with open("sesi3_shuffled.json", "r", encoding="utf-8") as f:
    items = json.load(f)

lines = []
for it in items:
    lines.append(f'  {it["new_num"]}: \'{it["answer"]}\',')

with open("sesi3_keys_ts.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Generated {len(items)} key lines")
