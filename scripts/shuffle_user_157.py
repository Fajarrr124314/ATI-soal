import json
import random

# The 157 items strictly from the user's list
raw_items = [
    (1, "Saya tahu cara meyakinkan orang lain.", "S"),
    (2, "Saya berusaha mempengaruhi orang lain", "S"),
    (3, "Saya mengubah perencanaan menjadi Tindakan.", "SS"),
    (4, "Saya menyelesaikan banyak pekerjaan.", "SS"),
    (5, "Saya selalu bekerja/bertindak dengan terencana.", "SS"),
    (6, "Saya meyakini segala sesuatu perlu dipikirkan secara seksama dan intut.", "SS"),
    (7, "Saya cepat akrab dengan orang lain.", "SS"),
    (8, "Saya berusaha untuk melampaui pencapaian orang lain.", "S"),
    (9, "Saya merasa perlu menghargai keputusan-keputusan yang dibuat oleh kelompok.", "SS"),
    (10, "Saya tidak banyak berbicara.", "TS"),
    (11, "Saya tidak suka melakukan hal-hal yang membuat orang lain memperhatikan saya.", "S"),
    (12, "Saya mengerjakan pekerjaan yang tidak saya sukai sesegera mungkin.", "SS"),
    (13, "Saya membutuhkan dorongan untuk memulai suatu hal.", "STS"),
    (14, "Saya sering terlambat datang bekerja.", "STS"),
    (15, "Saya menyelesaikan pekerjaan dengan usaha yang secukupnya.", "STS"),
    (16, "Saya membiarkan diri saya diperlakukan tidak adil.", "STS"),
    (17, "Saya kurang pandai membuat orang lain menyukai saya.", "TS"),
    (18, "Jika dibandingkan dengan orang lain, saya cenderung kurang menikmati berinteraksi dengan banyak", "TS"),
    (19, "Saya tidak terlalu termotivasi untuk mencapai kesuksesan", "STS"),
    (20, "Saya menghabiskan waktu dengan tidak melakukan apapun.", "STS"),
    (21, "Saya tidak pernah berprasangka buruk terhadap orang lain.", "SS"),
    (22, "Saya selalu ceria.", "SS"),
    (23, "Saya berusaha untuk memimpin orang lain.", "S"),
    (24, "Saya pandai dalam berpidato dadakan", "S"),
    (25, "Saya cepat dalam menyelesaikan banyak hal", "SS"),
    (26, "Saya mampu menyelesaikan pekerjaan tepat waktu.", "SS"),
    (27, "Saya menjalankan pekerjaan atau bertindak sesuai dengan rencana yang telah dibuat.", "SS"),
    (28, "Saya teliti dalam pekerjaan saya.", "SS"),
    (29, "Saya dapat bergaul secara luwes dengan orang-orang yang baru saja saya kenal.", "SS"),
    (30, "Saya berusaha untuk lebih baik dari orang lain.", "SS"),
    (31, "Saya mendukung rekan tim atau anggota kelompok saya", "SS"),
    (32, "Saya tidak suka banyak bercerita tentang diri saya.", "S"),
    (33, "Saya cenderung berada di belakang layar.", "TS"),
    (34, "Saya tidak meninggalkan suatu tugas sebelum tugas tersebut terselesaikan.", "SS"),
    (35, "Saya mudah bingung.", "STS"),
    (36, "Saya melanggar peraturan.", "STS"),
    (37, "Saya membiarkan diri saya diperlakukan tidak semestinya.", "STS"),
    (38, "Saya sulit untuk melakukan pendekatan kepada orang lain.", "STS"),
    (39, "Saya lebih memilih untuk sendirian.", "TS"),
    (40, "Saya mengelak dari tugas-tugas saya.", "STS"),
    (41, "Saya tidak menonjol dalam hal apapun.", "STS"),
    (42, "Saya mampu membuat orang lain untuk melakukan berbagai pekerjaan dengan rapih.", "SS"),
    (43, "Saya menyelesaikan banyak pekerjaan dengan cepat dan rapih.", "SS"),
    (44, "Saya mampu mengikuti banyak informasi sekaligus.", "SS"),
    (45, "Saya bekerja dengan penuh ikhlas.", "SS"),
    (46, "Saya membuat perencanaan dan mampu membuat rencana tersebut.", "SS"),
    (47, "Saya adalah orang yang berfokus pada tujuan.", "SS"),
    (48, "Saya mudah berteman.", "SS"),
    (49, "Saya ingin menjadi yang terbaik.", "SS"),
    (50, "Saya merasa harus banyak menghargai keputusan - keputusan yang dibuat oleh kelompok.", "SS"),
    (51, "Saya cenderung tidak banyak berbicara Ketika berada di sekitar orang - orang tidak sama sekali kenal.", "TS"),
    (52, "Saya mengerjakan pekerjaan sesegera mungkin.", "SS"),
    (53, "Saya mengerjakan berbagai hal mendekati tenggang waktu.", "STS"),
    (54, "Saya bertindak tanpa perencanaan.", "STS"),
    (55, "Saya mengabaikan tugas-tugas saya.", "STS"),
    (56, "Saya tidak pernah menentang apapun.", "TS"),
    (57, "Saya jarang merasa nyaman Ketika berada Bersama banyak orang.", "STS"),
    (58, "Saya merasa patah semangat Ketika menghadapi hambatan.", "STS"),
    (59, "Saya mengalokasikan sedikit waktu dan usaha dalam bekerja.", "STS"),
    (60, "Saya selalu menghormati orang yang lebih tua.", "SS"),
    (61, "Saya dapat dengan mudah membuat orang lain memperhatikan saya.", "S"),
    (62, "Saya mampu menghasilkan solusi dengan cepat.", "SS"),
    (63, "Saya cepat dalam memahami berbagai hal.", "SS"),
    (64, "Teman - teman menghargai saya karena penilaian saya yang bagus.", "SS"),
    (65, "Saya melakukan hal - hal sesuai dengan rencana yang telah dibuat.", "SS"),
    (66, "Saya mudah menyesuaikan diri.", "SS"),
    (67, "Saya menetapkan standar yang tinggi untuk diri saya sendiri dan orang lain.", "SS"),
    (68, "Saya berusaha untuk membuat semua orang diterima dan diikutsertakan dalam kelompok", "SS"),
    (69, "Saya tidak mengutarakan pemikiran saya secara leluasa ketika hal tersebut mungkin memunculkan hasil yang negatif", "S"),
    (70, "Saya terus melakukan sesuatu sampai semuanya sempurna.", "SS"),
    (71, "Seringkali lupa untuk meletakkan barang di tempat yang seharusnya.", "STS"),
    (72, "Saya mengerjakan sesuatu dengan 'setengah-setengah'.", "STS"),
    (73, "Saya menunggu orang lain untuk memimpin.", "TS"),
    (74, "Saya sering terganggu dengan setidaknya salah satu dari anggota kelompok, saat berinteraksi dengan sekelompok orang.", "STS"),
    (75, "Saya menyimpan segala sesuatu untuk diri sendiri.", "TS"),
    (76, "Saya tidak pernah berbicara kasar.", "SS"),
    (77, "Saya mampu membuat orang lain merasa tertarik.", "SS"),
    (78, "Saya tidak keberatan menjadi pusat perhatian.", "S"),
    (79, "Saya berhasil menyelesaikan tugas.", "SS"),
    (80, "Saya mampu menangani masalah-masalah yang rumit.", "SS"),
    (81, "Saya suka menyusun perencanaan sebelum bertindak.", "SS"),
    (82, "Saya fokus pada tujuan.", "SS"),
    (83, "Saya mampu menyesuaikan diri dalam berbagai situasi.", "SS"),
    (84, "Saya menuntut kualitas.", "SS"),
    (85, "Saya siap berjuang untuk alasan yang jelas.", "SS"),
    (86, "Saya menghindari berhadapan dengan emosi-emosi yang tidak perlu di perhatikan.", "S"),
    (87, "Saya tidak memiliki banyak hal untuk dibicarakan.", "TS"),
    (88, "Saya tidak merokok.", "SS"),
    (89, "Saya tidak minum.", "SS"),
    (90, "Saya cenderung menghindari materi bacaan yang sulit.", "STS"),
    (91, "Saya meninggalkan pekerjaan saya sebelum terselesaikan", "STS"),
    (92, "Saya tidak tertarik berspekulasi tentang berbagai hal.", "S"),
    (93, "Saya enggan mengungkapkan pendapat saya.", "STS"),
    (94, "Sulit bagi saya untuk mempengaruhi orang lain untuk melakukan apa yang saya mau.", "TS"),
    (95, "Saya sering merasa tidak nyaman ketika berada di sekitar orang-orang.", "STS"),
    (96, "Saya ingin dibiarkan sendirian.", "STS"),
    (97, "Saya memilih untuk melakukan segalanya sendiri.", "TS"),
    (98, "Saya tidak menyelesaikan apa yang telah saya mulai.", "STS"),
    (99, "Saya memiliki ritme kehidupan yang lambat.", "STS"),
    (100, "Saya selalu hadir jika diundang.", "SS"),
    (101, "Saya tidak pernah berbohong.", "SS"),
    (102, "Saya tahu apa saja yang bisa menggugah orang lain.", "SS"),
    (103, "Saya tidak pernah kehabisan kata-kata ketika berbicara.", "S"),
    (104, "Saya cepat menangkap inti dari berbagai hal.", "SS"),
    (105, "Saya mampu menyelesaikan berbagai jenis tugas.", "SS"),
    (106, "Saya melaksanakan perencanaan yang telah saya buat.", "SS"),
    (107, "Saya berhati-hati agar terhindar dari membuat kesalahan.", "SS"),
    (108, "Saya bersedia untuk mencoba segala sesuatu yang baru.", "SS"),
    (109, "Saya adalah seorang pekerja keras.", "SS"),
    (110, "Saya mengambil tanggung jawab.", "SS"),
    (111, "Saya kurang berbakat mempengaruhi orang lain.", "TS"),
    (112, "Saya tidak menyukai perempuan.", "STS"),
    (113, "Saya menangani pekerjaan yang sulit dengan baik.", "SS"),
    (114, "Saya menganggap keterbatasan bagus dan baik.", "S"),
    (115, "Saya kurang menyediakan berbagai makanan yang sehat.", "TS"),
    (116, "Saya tidak dapat menghasilkan ide-ide dengan baik.", "STS"),
    (117, "Saya cenderung menjaga jarak dengan orang lain.", "STS"),
    (118, "Saya kurang pandai bekerja dalam kelompok.", "STS"),
    (119, "Saya merasa bahwa pekerjaan bukanlah bagian yang pernah saya inginkan.", "STS"),
    (120, "Saya mudah menyerah.", "STS"),
    (121, "Saya selalu mematuhi perintah orangtua.", "SS"),
    (122, "Saya cenderung memulai pembicaraan.", "SS"),
    (123, "Saya terampil dalam menghadapi situasi pergaulan.", "SS"),
    (124, "Saya menangani banyak tugas dengan lancar.", "SS"),
    (125, "Saya pandai dalam berbagai hal.", "SS"),
    (126, "Saya mengikuti jadwal.", "SS"),
    (127, "Menjadi bagian dari suatu kelompok merupakan hal yang menyenangkan.", "SS"),
    (128, "Saya mempertimbangkan pro dan kontra.", "SS"),
    (129, "Saya menjalankan dan menindaklanjuti komitmen yang saya pegang dengan teguh.", "SS"),
    (130, "Saya sulit mengungkapkan perasaan saya.", "TS"),
    (131, "Saya tidak dapat teralihkan ketika sedang bekerja.", "SS"),
    (132, "Saya sering membuat perencanaan-perencanaan di saa", "S"),
    (133, "Saya tidak tahu cara untuk mengendalikan diri saya.", "STS"),
    (134, "Saya tidak suka berkelahi.", "SS"),
    (135, "Saya suka berolahraga.", "SS"),
    (136, "Saya menganggap bahwa bersosialisasi dengan orang lain itu tidak terlalu penting.", "STS"),
    (137, "Saya meninggalkan barang-barang bawaan di sekitar saya.", "STS"),
    (138, "Saya tidak pernah membicarakan orang lain.", "SS"),
    (139, "Saya berbicara kepada banyak orang yang berbeda-beda dalam suatu pesta.", "SS"),
    (140, "Saya memiliki ide-ide yang cemerlang.", "SS"),
    (141, "Saya mampu mengatasi apa pun.", "SS"),
    (142, "Saya mampu bekerja di bawah tekanan.", "SS"),
    (143, "Saya menginginkan segala sesuatunya berjalan sebagaimana mestinya.", "SS"),
    (144, "Saya tidak pernah menyerah.", "SS"),
    (145, "Saya sangat tertutup mengenai kehidupan pribadi saya.", "S"),
    (146, "Saya mudah panik.", "STS"),
    (147, "Saya kurang pandai dalam membuat perencanaan aktivitas kelompok.", "STS"),
    (148, "Saya cenderung bertindak tanpa berpikir terlebih dahulu.", "STS"),
    (149, "Saya menghindari berhubungan dengan orang lain.", "STS"),
    (150, "Saya mudah berkecil hati.", "STS"),
    (151, "Saya selalu ramah kepada orang lain meskipun ia pernah menyakiti saya.", "SS"),
    (152, "Saya mengetahui cara untuk memikat atau menarik hati orang lain.", "SS"),
    (153, "Saya mampu mengelola berbagai pekerjaan pada saat yang bersamaan.", "SS"),
    (154, "Saya membuat keputusan dengan tergesa-gesa.", "STS"),
    (155, "Saya mudah terintimidasi.", "STS"),
    (156, "Saya merasa bahwa hidup saya kurang memiliki arah.", "STS"),
    (157, "Saya tidak pernah marah.", "S"),
]

# Randomize shuffle with seed for reproducibility
rng = random.Random(20260925_1330)
shuffled_pool = list(raw_items)
rng.shuffle(shuffled_pool)

# Re-number 1 to 157
final_shuffled = []
for idx, (orig_no, text, ans) in enumerate(shuffled_pool, start=1):
    final_shuffled.append({
        "new_no": idx,
        "orig_no": orig_no,
        "text": text,
        "ans": ans
    })

# Save JSON
with open("c:/form ATI/sesi3_user_shuffled_157.json", "w", encoding="utf-8") as f:
    json.dump(final_shuffled, f, indent=2, ensure_ascii=False)

# Split into 2 columns for Soal
half = 79
col1 = final_shuffled[:half]
col2 = final_shuffled[half:]

html_soal = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Lembar Soal Sesi 3 (Acak 157 Butir)</title>
<style>
  @page {{
    size: A4;
    margin: 12mm 15mm 15mm 15mm;
  }}
  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}
  body {{
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    margin: 0;
    padding: 0;
    font-size: 8.5pt;
    line-height: 1.25;
  }}
  .header {{
    background: #0f172a;
    color: white;
    padding: 10px 16px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }}
  .header-left h1 {{
    margin: 0;
    font-size: 13pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }}
  .header-left p {{
    margin: 2px 0 0 0;
    font-size: 8pt;
    color: #94a3b8;
  }}
  .badge {{
    background: #2563eb;
    color: white;
    font-size: 9pt;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 4px;
    text-transform: uppercase;
  }}
  .instructions {{
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 12px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 7.8pt;
  }}
  .legend-items span {{
    margin-left: 8px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 3px;
    background: #e2e8f0;
  }}
  .grid-container {{
    display: flex;
    gap: 14px;
  }}
  .column {{
    flex: 1;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
  }}
  th {{
    background: #f1f5f9;
    color: #475569;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    padding: 4px 6px;
    border: 1px solid #cbd5e1;
    text-align: left;
  }}
  td {{
    padding: 3.5px 6px;
    border: 1px solid #e2e8f0;
    vertical-align: middle;
    font-size: 7.8pt;
  }}
  tr:nth-child(even) {{
    background: #fcfdfe;
  }}
  .num-col {{
    width: 32px;
    text-align: center;
    font-weight: 700;
    color: #334155;
    background: #f8fafc;
  }}
  .footer {{
    margin-top: 10px;
    font-size: 7pt;
    color: #64748b;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #e2e8f0;
    padding-top: 4px;
  }}
</style>
</head>
<body>

  <div class="header">
    <div class="header-left">
      <h1>Dokumen Lembar Soal (Sesi 3 - Acak)</h1>
      <p>Inventori Kepribadian & Evaluasi Diri — PT ATI</p>
    </div>
    <div class="badge">SESI 3 (157 BUTIR ACAK)</div>
  </div>

  <div class="instructions">
    <div><strong>Petunjuk:</strong> Bacalah setiap nomor pertanyaan, lalu tentukan respon Anda pada Lembar Jawaban Sistem:</div>
    <div class="legend-items">
      <span style="color:#0369a1; background:#e0f2fe;">SS : Sangat Sesuai</span>
      <span style="color:#0f766e; background:#ccfbf1;">S : Sesuai</span>
      <span style="color:#b45309; background:#fef3c7;">TS : Tidak Sesuai</span>
      <span style="color:#b91c1c; background:#fee2e2;">STS : Sangat Tidak Sesuai</span>
    </div>
  </div>

  <div class="grid-container">
    <div class="column">
      <table>
        <thead>
          <tr>
            <th class="num-col">NO</th>
            <th>PERNYATAAN SOAL</th>
          </tr>
        </thead>
        <tbody>
"""

for it in col1:
    html_soal += f"""
          <tr>
            <td class="num-col">{it['new_no']}</td>
            <td>{it['text']}</td>
          </tr>
    """

html_soal += """
        </tbody>
      </table>
    </div>

    <div class="column">
      <table>
        <thead>
          <tr>
            <th class="num-col">NO</th>
            <th>PERNYATAAN SOAL</th>
          </tr>
        </thead>
        <tbody>
"""

for it in col2:
    html_soal += f"""
          <tr>
            <td class="num-col">{it['new_no']}</td>
            <td>{it['text']}</td>
          </tr>
    """

html_soal += """
        </tbody>
      </table>
    </div>
  </div>

  <div class="footer">
    <span>Lembar Soal Kuesioner Sesi 3 — PT ATI</span>
    <span>Total 157 Butir Pertanyaan Lengkap (Urutan Acak)</span>
  </div>

</body>
</html>
"""

with open("c:/form ATI/soal_sesi_3.html", "w", encoding="utf-8") as f:
    f.write(html_soal)

# Generate HTML Kunci Jawaban (matching shuffled order)
chunks = [
    final_shuffled[0:32],
    final_shuffled[32:64],
    final_shuffled[64:96],
    final_shuffled[96:127],
    final_shuffled[127:157]
]

html_kunci = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Kunci Jawaban Resmi Sesi 3 (Acak 157 Butir)</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 14mm;
  }}
  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}
  body {{
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    margin: 0;
    padding: 0;
    font-size: 8.5pt;
  }}
  .header {{
    background: #1e1b4b;
    color: white;
    padding: 12px 18px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }}
  .header-left h1 {{
    margin: 0;
    font-size: 13.5pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }}
  .header-left p {{
    margin: 3px 0 0 0;
    font-size: 8.5pt;
    color: #c7d2fe;
  }}
  .badge {{
    background: #4338ca;
    color: #e0e7ff;
    font-size: 9pt;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 4px;
    border: 1px solid #6366f1;
  }}
  .confidential-box {{
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-left: 4px solid #059669;
    padding: 8px 14px;
    border-radius: 4px;
    margin-bottom: 14px;
    font-size: 8pt;
    color: #065f46;
  }}
  .table-row {{
    display: flex;
    gap: 10px;
  }}
  .col-table {{
    flex: 1;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
  }}
  th {{
    background: #f1f5f9;
    color: #334155;
    font-size: 7.5pt;
    font-weight: 700;
    padding: 4px 6px;
    border: 1px solid #cbd5e1;
    text-align: center;
  }}
  td {{
    padding: 4px 6px;
    border: 1px solid #e2e8f0;
    text-align: center;
    font-size: 8pt;
  }}
  tr:nth-child(even) {{
    background: #f8fafc;
  }}
  .num-td {{
    font-weight: 600;
    color: #64748b;
    background: #f1f5f9;
    width: 38%;
  }}
  .ans-td {{
    font-weight: 800;
    width: 62%;
  }}
  .ans-SS {{
    background: #e0f2fe;
    color: #0369a1;
  }}
  .ans-S {{
    background: #ccfbf1;
    color: #0f766e;
  }}
  .ans-TS {{
    background: #fef3c7;
    color: #b45309;
  }}
  .ans-STS {{
    background: #fee2e2;
    color: #b91c1c;
  }}
  .footer {{
    margin-top: 16px;
    font-size: 7.5pt;
    color: #64748b;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #cbd5e1;
    padding-top: 6px;
  }}
</style>
</head>
<body>

  <div class="header">
    <div class="header-left">
      <h1>Kunci Jawaban Resmi — Sesi 3 (Urutan Acak)</h1>
      <p>Inventori Kepribadian / Evaluasi Diri (157 Butir Acak)</p>
    </div>
    <div class="badge">DOKUMEN PENGUJI</div>
  </div>

  <div class="confidential-box">
    <strong>KUNCI JAWABAN AKURAT (157 BUTIR ACAK):</strong> Kunci jawaban ini disinkronkan 100% dengan urutan acak pada Dokumen Soal Sesi 3 nomor 1 s/d 157.
  </div>

  <div class="table-row">
"""

for chunk in chunks:
    html_kunci += """
    <div class="col-table">
      <table>
        <thead>
          <tr>
            <th>NO</th>
            <th>KUNCI</th>
          </tr>
        </thead>
        <tbody>
    """
    for it in chunk:
        ans = it['ans']
        ans_class = f"ans-{ans}" if ans in ['SS', 'S', 'TS', 'STS'] else ""
        html_kunci += f"""
          <tr>
            <td class="num-td">{it['new_no']}</td>
            <td class="ans-td {ans_class}">{ans}</td>
          </tr>
        """
    html_kunci += """
        </tbody>
      </table>
    </div>
    """

html_kunci += """
  </div>

  <div class="footer">
    <span>Kunci Jawaban Sesi 3 (Acak) — PT ATI</span>
    <span>Lengkap 157 Nomor Jawaban</span>
  </div>

</body>
</html>
"""

with open("c:/form ATI/kunci_jawaban_sesi_3.html", "w", encoding="utf-8") as f:
    f.write(html_kunci)

print("Generated HTML files for Shuffled 157 items.")

# Update defaultConfig.ts
lines = []
for it in final_shuffled:
    lines.append(f"  {it['new_no']}: '{it['ans']}',")
new_keys_body = "\n".join(lines)

with open("c:/form ATI/src/data/defaultConfig.ts", "r", encoding="utf-8") as f:
    content = f.read()

start_marker = "export const DEFAULT_ANSWER_KEYS_SESI_3: Record<number, string> = {"
end_marker = "};\n\nexport function buildQuestions("

start_pos = content.find(start_marker)
end_pos = content.find(end_marker)

if start_pos != -1 and end_pos != -1:
    replacement = f"{start_marker}\n{new_keys_body}\n"
    content = content[:start_pos] + replacement + content[end_pos:]
    print("Replaced DEFAULT_ANSWER_KEYS_SESI_3 in defaultConfig.ts")

with open("c:/form ATI/src/data/defaultConfig.ts", "w", encoding="utf-8") as f:
    f.write(content)

# Update storage keys version
with open("c:/form ATI/src/services/storage.ts", "r", encoding="utf-8") as f:
    storage_code = f.read()

storage_code = storage_code.replace("ati_form_settings_v4", "ati_form_settings_v5")
storage_code = storage_code.replace("ati_answer_keys_sesi_3_v4", "ati_answer_keys_sesi_3_v5")

with open("c:/form ATI/src/services/storage.ts", "w", encoding="utf-8") as f:
    f.write(storage_code)

print("Updated storage keys to v5")
