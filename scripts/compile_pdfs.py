import os
import shutil
from playwright.sync_api import sync_playwright

def compile_all():
    base_dir = os.path.abspath("c:/form ATI")
    soal_html = os.path.join(base_dir, "soal_sesi_3.html")
    kunci_html = os.path.join(base_dir, "kunci_jawaban_sesi_3.html")
    
    soal_pdf = os.path.join(base_dir, "public", "DOKUMEN_SOAL_SESI_3.pdf")
    kunci_pdf = os.path.join(base_dir, "public", "DOKUMEN_KUNCI_JAWABAN_SESI_3.pdf")

    print("Rendering PDFs with Playwright...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        
        # 1. Render Soal
        page = browser.new_page()
        page.goto(f"file:///{soal_html.replace(os.sep, '/')}")
        page.pdf(
            path=soal_pdf,
            format="A4",
            print_background=True,
            margin={"top": "10mm", "bottom": "10mm", "left": "12mm", "right": "12mm"}
        )
        print(f"Generated: {soal_pdf}")
        page.close()

        # 2. Render Kunci Jawaban
        page2 = browser.new_page()
        page2.goto(f"file:///{kunci_html.replace(os.sep, '/')}")
        page2.pdf(
            path=kunci_pdf,
            format="A4",
            print_background=True,
            margin={"top": "12mm", "bottom": "12mm", "left": "12mm", "right": "12mm"}
        )
        print(f"Generated: {kunci_pdf}")
        page2.close()

        browser.close()

    # Also sync copies to root files for consistency
    targets_soal = [
        os.path.join(base_dir, "DOKUMEN_SOAL_SESI_3.pdf"),
        os.path.join(base_dir, "DOKUMEN_SOAL_SESI_3_ACAK.pdf"),
        os.path.join(base_dir, "DOKUMEN_SOAL_SESI_3_LENGKAP_157.pdf"),
    ]
    for t in targets_soal:
        try:
            shutil.copyfile(soal_pdf, t)
            print(f"Synced copy to: {t}")
        except Exception as e:
            print(f"Could not copy to {t}: {e}")

    targets_kunci = [
        os.path.join(base_dir, "DOKUMEN_KUNCI_JAWABAN_SESI_3.pdf"),
        os.path.join(base_dir, "DOKUMEN_KUNCI_JAWABAN_SESI_3_ACAK.pdf"),
        os.path.join(base_dir, "DOKUMEN_KUNCI_JAWABAN_SESI_3_LENGKAP_157.pdf"),
    ]
    for t in targets_kunci:
        try:
            shutil.copyfile(kunci_pdf, t)
            print(f"Synced copy to: {t}")
        except Exception as e:
            print(f"Could not copy to {t}: {e}")

    print("All PDFs successfully re-rendered and updated!")

if __name__ == "__main__":
    compile_all()
