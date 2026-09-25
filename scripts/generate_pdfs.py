import json
import os
import subprocess

with open("sesi3_shuffled.json", "r", encoding="utf-8") as f:
    items = json.load(f)

# 1. HTML SOAL SAJA
# We will lay it out in 2 neat columns per page with clean typography
half = len(items) // 2
col1 = items[:half] # 1 to 75
col2 = items[half:] # 76 to 150

html_soal = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Lembar Soal Sesi 3</title>
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
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
    margin-left: 10px;
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
    vertical-align: top;
    font-size: 7.8pt;
  }}
  tr:nth-child(even) {{
    background: #fcfdfe;
  }}
  .num-col {{
    width: 28px;
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
      <h1>Dokumen Lembar Soal (Sesi 3)</h1>
      <p>Inventori Kepribadian & Evaluasi Diri — PT ATI</p>
    </div>
    <div class="badge">SESI 3 (150 BUTIR)</div>
  </div>

  <div class="instructions">
    <div><strong>Petunjuk:</strong> Bacalah setiap pernyataan dengan teliti, lalu pilih respon yang paling menggambarkan diri Anda pada Formulir Jawaban:</div>
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
            <td class="num-col">{it['new_num']}</td>
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
            <td class="num-col">{it['new_num']}</td>
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
    <span>Kerjakan seluruh nomor pada form/lembar jawaban yang telah disediakan</span>
  </div>

</body>
</html>
"""

with open("soal_sesi_3.html", "w", encoding="utf-8") as f:
    f.write(html_soal)


# 2. HTML KUNCI JAWABAN SAJA (TERPISAH)
# Formatted into 5 compact columns (30 items each)
chunks = [items[i:i+30] for i in range(0, len(items), 30)]

html_kunci = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Kunci Jawaban Sesi 3</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 15mm;
  }}
  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }}
  body {{
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
    font-size: 14pt;
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
    background: #fffbeb;
    border: 1px solid #fef3c7;
    border-left: 4px solid #d97706;
    padding: 8px 14px;
    border-radius: 4px;
    margin-bottom: 14px;
    font-size: 8pt;
    color: #92400e;
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
    width: 40%;
  }}
  .ans-td {{
    font-weight: 800;
    width: 60%;
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
      <h1>Kunci Jawaban Resmi — Sesi 3</h1>
      <p>Inventori Kepribadian / Kuesioner Evaluasi Diri (Urutan Acak)</p>
    </div>
    <div class="badge">RAHASIA / PENGUJI</div>
  </div>

  <div class="confidential-box">
    <strong>DOKUMEN PENGUJI / TIM PENILAI:</strong> Lembar kunci jawaban ini telah disesuaikan 100% dengan urutan nomor acak pada Dokumen Soal Sesi 3 (Total: 150 Butir).
  </div>

  <div class="table-row">
"""

for c_idx, chunk in enumerate(chunks):
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
        ans = it['answer']
        ans_class = f"ans-{ans}" if ans in ['SS', 'S', 'TS', 'STS'] else ""
        html_kunci += f"""
          <tr>
            <td class="num-td">{it['new_num']}</td>
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
    <span>Kunci Jawaban Sesi 3 — PT ATI</span>
    <span>Total 150 Butir Pertanyaan (Acak)</span>
  </div>

</body>
</html>
"""

with open("kunci_jawaban_sesi_3.html", "w", encoding="utf-8") as f:
    f.write(html_kunci)

print("Generated HTML files for Soal and Kunci successfully.")
