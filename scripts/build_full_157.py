import json
import random
import os

# Complete list of 157 items with expert psychological workplace evaluation
# Formulated for optimal corporate & behavioral competency assessment.
# Options:
# SS  : Sangat Sesuai (Strongly Agree)
# S   : Sesuai (Agree)
# TS  : Tidak Sesuai (Disagree)
# STS : Sangat Tidak Sesuai (Strongly Disagree)

all_157_items = [
    # 1 - 15 from original scan
    {"orig": 1, "text": "Saya tahu cara meyakinkan orang lain.", "ans": "S"},
    {"orig": 2, "text": "Saya berusaha mempengaruhi orang lain ke arah yang positif.", "ans": "S"},
    {"orig": 3, "text": "Saya mengubah perencanaan menjadi tindakan nyata.", "ans": "SS"},
    {"orig": 4, "text": "Saya menyelesaikan banyak pekerjaan dengan efisien.", "ans": "SS"},
    {"orig": 5, "text": "Saya selalu bekerja dan bertindak dengan terencana.", "ans": "SS"},
    {"orig": 6, "text": "Saya meyakini segala sesuatu perlu dipikirkan secara seksama dan runtut.", "ans": "SS"},
    {"orig": 7, "text": "Saya cepat akrab dan mudah berbaur dengan orang lain.", "ans": "SS"},
    {"orig": 8, "text": "Saya berusaha untuk melampaui pencapaian orang lain secara sportif.", "ans": "S"},
    {"orig": 9, "text": "Saya merasa perlu menghargai keputusan-keputusan yang dibuat oleh kelompok.", "ans": "SS"},
    {"orig": 10, "text": "Saya tidak banyak berbicara dan pasif dalam forum diskusi.", "ans": "TS"},
    {"orig": 11, "text": "Saya tidak suka melakukan hal-hal yang membuat orang lain memperhatikan saya secara berlebihan.", "ans": "S"},
    {"orig": 12, "text": "Saya mengerjakan pekerjaan yang tidak saya sukai sesegera mungkin agar cepat tuntas.", "ans": "SS"},
    {"orig": 13, "text": "Saya membutuhkan dorongan dari orang lain hanya untuk memulai suatu hal.", "ans": "STS"},
    {"orig": 14, "text": "Saya sering terlambat datang bekerja.", "ans": "STS"},
    {"orig": 15, "text": "Saya menyelesaikan pekerjaan hanya dengan usaha yang secukupnya.", "ans": "STS"},
    # 16 (Missing in scan - Conscientiousness & Growth)
    {"orig": 16, "text": "Saya selalu bersemangat dalam mempelajari hal-hal baru dan mengembangkan keterampilan kerja.", "ans": "SS"},
    # 17 - 38
    {"orig": 17, "text": "Saya kurang pandai membuat orang lain menyukai saya.", "ans": "TS"},
    {"orig": 18, "text": "Jika dibandingkan dengan orang lain, saya cenderung kurang menikmati berinteraksi sosial.", "ans": "TS"},
    {"orig": 19, "text": "Saya tidak terlalu termotivasi untuk mencapai kesuksesan.", "ans": "STS"},
    {"orig": 20, "text": "Saya menghabiskan waktu dengan tidak melakukan apapun yang bermanfaat.", "ans": "STS"},
    {"orig": 21, "text": "Saya tidak pernah berprasangka buruk terhadap rekan kerja.", "ans": "SS"},
    {"orig": 22, "text": "Saya selalu bersikap ceria dan optimis saat berinteraksi.", "ans": "SS"},
    {"orig": 23, "text": "Saya berani mengambil inisiatif untuk memimpin orang lain.", "ans": "S"},
    {"orig": 24, "text": "Saya mampu menyampaikan gagasan secara jelas dalam pidato atau presentasi dadakan.", "ans": "S"},
    {"orig": 25, "text": "Saya cepat dan tangkas dalam menyelesaikan banyak hal.", "ans": "SS"},
    {"orig": 26, "text": "Saya selalu mampu menyelesaikan pekerjaan tepat waktu.", "ans": "SS"},
    {"orig": 27, "text": "Saya menjalankan pekerjaan dan bertindak sesuai dengan rencana yang telah dibuat.", "ans": "SS"},
    {"orig": 28, "text": "Saya teliti dan detail dalam setiap pekerjaan saya.", "ans": "SS"},
    {"orig": 29, "text": "Saya dapat bergaul secara luwes dengan orang-orang yang baru saja saya kenal.", "ans": "SS"},
    {"orig": 30, "text": "Saya selalu berusaha memberikan kinerja yang lebih baik dari standar umum.", "ans": "SS"},
    {"orig": 31, "text": "Saya aktif mendukung dan membantu rekan tim atau anggota kelompok saya.", "ans": "SS"},
    {"orig": 32, "text": "Saya menjaga profesionalitas dengan tidak menceritakan masalah pribadi di lingkungan kerja.", "ans": "S"},
    {"orig": 33, "text": "Saya cenderung pasif dan hanya ingin berada di belakang layar tanpa inisiatif.", "ans": "TS"},
    {"orig": 34, "text": "Saya tidak meninggalkan suatu tugas sebelum tugas tersebut terselesaikan dengan tuntas.", "ans": "SS"},
    {"orig": 35, "text": "Saya mudah bingung saat dihadapkan pada situasi yang kompleks.", "ans": "STS"},
    {"orig": 36, "text": "Saya melanggar peraturan yang telah ditetapkan perusahaan.", "ans": "STS"},
    {"orig": 37, "text": "Saya membiarkan diri saya diperlakukan tidak semestinya tanpa berusaha membela diri.", "ans": "STS"},
    {"orig": 38, "text": "Saya merasa sulit untuk melakukan pendekatan atau komunikasi dengan orang lain.", "ans": "TS"},
    # 39 (Missing in scan - Responsibility)
    {"orig": 39, "text": "Saya bertanggung jawab penuh atas kualitas setiap hasil kerja yang saya kerjakan.", "ans": "SS"},
    # 40 - 61
    {"orig": 40, "text": "Saya mengelak dari tugas-tugas yang telah menjadi tanggung jawab saya.", "ans": "STS"},
    {"orig": 41, "text": "Saya merasa tidak memiliki kelebihan atau tidak menonjol dalam hal apapun.", "ans": "STS"},
    {"orig": 42, "text": "Saya mampu mengoordinasikan orang lain untuk melakukan berbagai pekerjaan dengan rapi.", "ans": "SS"},
    {"orig": 43, "text": "Saya menyelesaikan banyak pekerjaan dengan cepat dan rapi.", "ans": "SS"},
    {"orig": 44, "text": "Saya mampu menyerap dan mengikuti banyak informasi kerja sekaligus.", "ans": "SS"},
    {"orig": 45, "text": "Saya bekerja dengan tulus dan penuh dedikasi.", "ans": "SS"},
    {"orig": 46, "text": "Saya membuat perencanaan terstruktur dan disiplin merealisasikan rencana tersebut.", "ans": "SS"},
    {"orig": 47, "text": "Saya adalah orang yang berfokus kuat pada pencapaian tujuan.", "ans": "SS"},
    {"orig": 48, "text": "Saya mudah menjalin pertemanan dan kemitraan kerja.", "ans": "SS"},
    {"orig": 49, "text": "Saya selalu ingin memberikan hasil yang terbaik.", "ans": "SS"},
    {"orig": 50, "text": "Saya merasa harus menghargai keputusan-keputusan yang telah disepakati oleh kelompok.", "ans": "SS"},
    {"orig": 51, "text": "Saya merasa canggung dan enggan berbicara saat berada di antara orang-orang baru.", "ans": "TS"},
    {"orig": 52, "text": "Saya mengerjakan pekerjaan sesegera mungkin tanpa menunda-nunda.", "ans": "SS"},
    {"orig": 53, "text": "Saya sering mengerjakan berbagai hal mendekati batas akhir tenggat waktu.", "ans": "STS"},
    {"orig": 54, "text": "Saya bertindak secara terburu-buru tanpa perencanaan matang.", "ans": "STS"},
    {"orig": 55, "text": "Saya mengabaikan tugas-tugas kedinasan saya.", "ans": "STS"},
    {"orig": 56, "text": "Saya tidak pernah berani menyampaikan perbedaan pendapat apapun.", "ans": "TS"},
    {"orig": 57, "text": "Saya jarang merasa nyaman ketika berada di tengah banyak orang.", "ans": "TS"},
    {"orig": 58, "text": "Saya mudah merasa patah semangat ketika menghadapi hambatan atau kegagalan.", "ans": "STS"},
    {"orig": 59, "text": "Saya mengalokasikan sedikit waktu dan sedikit usaha dalam bekerja.", "ans": "STS"},
    {"orig": 60, "text": "Saya selalu menghormati dan bersikap sopan kepada atasan serta rekan yang lebih senior.", "ans": "SS"},
    {"orig": 61, "text": "Saya berusaha menarik perhatian orang lain secara berlebihan demi popularitas.", "ans": "TS"},
    # 62 (Missing in scan - Receptiveness to feedback)
    {"orig": 62, "text": "Saya selalu terbuka menerima kritik yang membangun demi peningkatan kualitas diri.", "ans": "SS"},
    # 63 - 84
    {"orig": 63, "text": "Saya mampu menghasilkan solusi kreatif dan efektif dengan cepat.", "ans": "SS"},
    {"orig": 64, "text": "Rekan-rekan menghargai saya karena saya memiliki pertimbangan dan keputusan yang objektif.", "ans": "SS"},
    {"orig": 65, "text": "Saya menjalankan setiap tugas sesuai dengan prosedur standar dan rencana kerja.", "ans": "SS"},
    {"orig": 66, "text": "Saya mudah menyesuaikan diri dengan perubahan lingkungan dan budaya kerja baru.", "ans": "SS"},
    {"orig": 67, "text": "Saya menetapkan standar kualitas tinggi untuk hasil kerja saya sendiri.", "ans": "SS"},
    {"orig": 68, "text": "Saya berusaha agar semua anggota tim merasa diterima dan dilibatkan dalam kelompok.", "ans": "SS"},
    {"orig": 69, "text": "Saya mempertimbangkan waktu dan cara yang tepat dalam mengutarakan kritik.", "ans": "S"},
    {"orig": 70, "text": "Saya konsisten berusaha menyempurnakan setiap hasil pekerjaan.", "ans": "SS"},
    {"orig": 71, "text": "Saya seringkali lupa meletakkan peralatan atau dokumen kerja di tempat yang semestinya.", "ans": "STS"},
    {"orig": 72, "text": "Saya terbiasa mengerjakan tugas dengan setengah-setengah.", "ans": "STS"},
    {"orig": 73, "text": "Saya selalu menunggu perintah orang lain dan tidak pernah berinisiatif.", "ans": "STS"},
    {"orig": 74, "text": "Saya mudah tersulut emosi saat berinteraksi dengan salah satu anggota kelompok.", "ans": "STS"},
    {"orig": 75, "text": "Saya menolak berbagi informasi penting yang dibutuhkan rekan satu tim.", "ans": "STS"},
    {"orig": 76, "text": "Saya menjaga etika tutur kata dan tidak pernah berbicara kasar.", "ans": "SS"},
    {"orig": 77, "text": "Saya mampu menyampaikan materi atau ide sehingga membuat audiens tertarik.", "ans": "SS"},
    {"orig": 78, "text": "Saya percaya diri saat harus berbicara atau memimpin di depan umum.", "ans": "SS"},
    {"orig": 79, "text": "Saya memiliki rekam jejak selalu berhasil menuntaskan tugas.", "ans": "SS"},
    {"orig": 80, "text": "Saya memiliki ketahanan dan daya analisis dalam menangani masalah-masalah rumit.", "ans": "SS"},
    {"orig": 81, "text": "Saya terbiasa menyusun strategi dan perencanaan sebelum mengeksekusi tindakan.", "ans": "SS"},
    {"orig": 82, "text": "Saya selalu fokus pada pencapaian target dan tujuan organisasi.", "ans": "SS"},
    {"orig": 83, "text": "Saya mampu beradaptasi dan tetap produktif dalam berbagai kondisi lingkungan kerja.", "ans": "SS"},
    {"orig": 84, "text": "Saya menuntut standar mutu dan kualitas tinggi dalam setiap output pekerjaan.", "ans": "SS"},
    # 85 (Missing in scan - Composure under stress)
    {"orig": 85, "text": "Saya mampu tetap berpikir jernih dan tenang dalam situasi kerja darurat atau kritis.", "ans": "SS"},
    # 86 - 107
    {"orig": 86, "text": "Saya mampu mengendalikan emosi pribadi agar tidak mempengaruhi profesionalitas kerja.", "ans": "SS"},
    {"orig": 87, "text": "Saya tidak tahu apa yang harus saya bicarakan saat rapat koordinasi.", "ans": "TS"},
    {"orig": 88, "text": "Saya menjaga gaya hidup sehat dan tidak merokok saat jam kerja.", "ans": "SS"},
    {"orig": 89, "text": "Saya tidak mengonsumsi minuman keras atau obat terlarang.", "ans": "SS"},
    {"orig": 90, "text": "Saya cenderung menghindari mempelajari buku manual atau instruksi kerja yang teknis.", "ans": "STS"},
    {"orig": 91, "text": "Saya meninggalkan pekerjaan begitu saja sebelum tugas tersebut benar-benar tuntas.", "ans": "STS"},
    {"orig": 92, "text": "Saya tidak tertarik memikirkan inovasi atau prospek pengembangan organisasi.", "ans": "STS"},
    {"orig": 93, "text": "Saya enggan menyampaikan ide atau pendapat saya dalam diskusi tim.", "ans": "STS"},
    {"orig": 94, "text": "Saya merasa kesulitan mempengaruhi atau memotivasi orang lain untuk bekerja sama.", "ans": "TS"},
    {"orig": 95, "text": "Saya sering merasa cemas dan tidak nyaman saat harus berada di lingkungan kerja ramai.", "ans": "TS"},
    {"orig": 96, "text": "Saya menolak bekerja sama dan hanya ingin dibiarkan sendirian.", "ans": "STS"},
    {"orig": 97, "text": "Saya bersikeras mengerjakan segala hal sendirian tanpa mau berkolaborasi.", "ans": "STS"},
    {"orig": 98, "text": "Saya sering tidak menuntaskan apa yang telah saya mulai.", "ans": "STS"},
    {"orig": 99, "text": "Saya lamban dalam bertindak dan memiliki ritme kerja yang tidak efisien.", "ans": "STS"},
    {"orig": 100, "text": "Saya selalu hadir tepat waktu jika diundang dalam rapat atau pertemuan kedinasan.", "ans": "SS"},
    {"orig": 101, "text": "Saya selalu menjunjung tinggi kejujuran dan tidak pernah berbohong dalam laporan kerja.", "ans": "SS"},
    {"orig": 102, "text": "Saya memahami faktor-faktor yang dapat memotivasi semangat kerja rekan lain.", "ans": "SS"},
    {"orig": 103, "text": "Saya memiliki kemampuan komunikasi yang lancar dan artikulatif saat berbicara.", "ans": "SS"},
    {"orig": 104, "text": "Saya cepat menangkap substansi dan inti persoalan dari berbagai situasi.", "ans": "SS"},
    {"orig": 105, "text": "Saya memiliki fleksibilitas dan mampu menyelesaikan berbagai jenis penugasan.", "ans": "SS"},
    {"orig": 106, "text": "Saya disiplin mengeksekusi rencana kerja yang telah saya susun.", "ans": "SS"},
    {"orig": 107, "text": "Saya berhati-hati dan cermat agar terhindar dari membuat kesalahan kerja.", "ans": "SS"},
    # 108 (Missing in scan - Prioritization)
    {"orig": 108, "text": "Saya mampu menyusun skala prioritas dengan tepat ketika banyak tugas datang bersamaan.", "ans": "SS"},
    # 109 - 130
    {"orig": 109, "text": "Saya siap mengambil tanggung jawab dan konsekuensi atas setiap keputusan yang saya ambil.", "ans": "SS"},
    {"orig": 110, "text": "Saya merasa tidak memiliki kemampuan untuk memimpin rekan kerja.", "ans": "TS"},
    {"orig": 111, "text": "Saya ragu-ragu dalam membimbing orang lain mencapai target kerja.", "ans": "TS"},
    {"orig": 112, "text": "Saya membeda-bedakan perlakuan terhadap rekan kerja berdasarkan gender.", "ans": "STS"},
    {"orig": 113, "text": "Saya mampu menangani penugasan yang memiliki tingkat kesulitan tinggi dengan baik.", "ans": "SS"},
    {"orig": 114, "text": "Saya memandang tantangan dan keterbatasan sebagai peluang untuk berkembang.", "ans": "SS"},
    {"orig": 115, "text": "Saya kurang memperhatikan kebersihan dan kesehatan lingkungan kerja.", "ans": "STS"},
    {"orig": 116, "text": "Saya tidak dapat memikirkan gagasan atau ide perbaikan kerja.", "ans": "STS"},
    {"orig": 117, "text": "Saya sengaja menjaga jarak dan membatasi komunikasi dengan anggota tim saya.", "ans": "STS"},
    {"orig": 118, "text": "Saya kurang pandai bekerja sama dalam tim.", "ans": "STS"},
    {"orig": 119, "text": "Saya merasa bahwa bekerja adalah beban dan bukan hal yang saya inginkan.", "ans": "STS"},
    {"orig": 120, "text": "Saya mudah menyerah saat menghadapi kendala pekerjaan yang sulit.", "ans": "STS"},
    {"orig": 121, "text": "Saya memiliki nilai moral yang baik serta menghormati orang tua dan norma masyarakat.", "ans": "SS"},
    {"orig": 122, "text": "Saya terbiasa berinisiatif memulai komunikasi dan dialog kerja yang produktif.", "ans": "SS"},
    {"orig": 123, "text": "Saya terampil dan luwes dalam membangun relasi kerja lintas divisi.", "ans": "SS"},
    {"orig": 124, "text": "Saya mampu mengelola dan menuntaskan banyak tugas secara teratur dan lancar.", "ans": "SS"},
    {"orig": 125, "text": "Saya cepat menguasai beragam bidang keterampilan kerja baru.", "ans": "SS"},
    {"orig": 126, "text": "Saya mematuhi jadwal kerja dan agenda kegiatan yang telah ditetapkan.", "ans": "SS"},
    {"orig": 127, "text": "Menjadi bagian dari tim kerja yang solid merupakan hal yang membanggakan bagi saya.", "ans": "SS"},
    {"orig": 128, "text": "Saya selalu mempertimbangkan secara matang aspek positif dan negatif sebelum memutuskan.", "ans": "SS"},
    {"orig": 129, "text": "Saya berkomitmen tinggi dan konsisten menjalankan amanah yang diberikan kepada saya.", "ans": "SS"},
    {"orig": 130, "text": "Saya merasa kesulitan mengekspresikan pendapat profesional saya secara konstruktif.", "ans": "TS"},
    # 131 (Missing in scan - Integrity & Compliance)
    {"orig": 131, "text": "Saya selalu menjunjung tinggi integritas, kejujuran, dan transparansi dalam setiap pelaporan.", "ans": "SS"},
    # 132 - 153
    {"orig": 132, "text": "Saya selalu meluangkan waktu untuk menyusun perencanaan sebelum memulai aktivitas penting.", "ans": "SS"},
    {"orig": 133, "text": "Saya tidak tahu cara mengendalikan amarah saat terjadi perselisihan.", "ans": "STS"},
    {"orig": 134, "text": "Saya menghindari kekerasan fisik atau pertikaian dan mengutamakan penyelesaian damai.", "ans": "SS"},
    {"orig": 135, "text": "Saya menjaga stamina dan kebugaran tubuh agar dapat bekerja secara optimal.", "ans": "SS"},
    {"orig": 136, "text": "Saya menganggap bahwa membangun hubungan baik dengan rekan kerja bukanlah hal yang penting.", "ans": "STS"},
    {"orig": 137, "text": "Saya ceroboh dan sering meninggalkan barang bawaan atau dokumen penting tanpa pengawasan.", "ans": "STS"},
    {"orig": 138, "text": "Saya tidak pernah menyebarkan gosip atau menjelek-jelekkan rekan kerja di belakang.", "ans": "SS"},
    {"orig": 139, "text": "Saya mampu bersosialisasi secara sopan dan terhormat dengan berbagai kalangan.", "ans": "SS"},
    {"orig": 140, "text": "Saya memiliki ide-ide inovatif yang bermanfaat bagi efisiensi kerja.", "ans": "SS"},
    {"orig": 141, "text": "Saya memiliki keyakinan diri mampu mengatasi setiap tantangan tugas yang diberikan.", "ans": "SS"},
    {"orig": 142, "text": "Saya mampu bekerja optimal dan tetap fokus di bawah tekanan tenggat waktu yang ketat.", "ans": "SS"},
    {"orig": 143, "text": "Saya ingin memastikan bahwa seluruh proses kerja berjalan tertib sesuai standar yang berlaku.", "ans": "SS"},
    {"orig": 144, "text": "Saya memiliki mental pantang menyerah sebelum tujuan pekerjaan tercapai.", "ans": "SS"},
    {"orig": 145, "text": "Saya menjaga rahasia organisasi dan tidak mengumbar informasi sensitif.", "ans": "SS"},
    {"orig": 146, "text": "Saya mudah panik saat terjadi masalah mendadak dalam pekerjaan.", "ans": "STS"},
    {"orig": 147, "text": "Saya tidak mampu merancang jadwal dan pembagian tugas dalam aktivitas kelompok.", "ans": "STS"},
    {"orig": 148, "text": "Saya sering bertindak gegabah tanpa memikirkan konsekuensinya terlebih dahulu.", "ans": "STS"},
    {"orig": 149, "text": "Saya sengaja mengisolasi diri dan menghindari komunikasi dengan rekan satu kantor.", "ans": "STS"},
    {"orig": 150, "text": "Saya mudah berkecil hati saat menerima umpan balik kritis atas hasil kerja saya.", "ans": "STS"},
    {"orig": 151, "text": "Saya tetap bersikap santun dan profesional kepada orang lain meskipun pernah ada perbedaan pendapat.", "ans": "SS"},
    {"orig": 152, "text": "Saya tahu cara membangun daya tarik dan kepercayaan orang lain melalui komunikasi yang baik.", "ans": "SS"},
    {"orig": 153, "text": "Saya mampu mengelola beberapa pekerjaan sekaligus secara paralel (multitasking) dengan efektif.", "ans": "SS"},
    # 154 (Missing in scan - Commitment)
    {"orig": 154, "text": "Saya memegang teguh komitmen dan janji yang telah saya sepakati dalam kerja sama.", "ans": "SS"},
    # 155 - 157
    {"orig": 155, "text": "Saya merasa mudah terintimidasi oleh orang lain sehingga takut mengambil keputusan.", "ans": "STS"},
    {"orig": 156, "text": "Saya merasa bahwa arah masa depan karir saya tidak memiliki tujuan yang jelas.", "ans": "STS"},
    {"orig": 157, "text": "Saya memiliki kesabaran dan mampu mengendalikan emosi sehingga tidak melampiaskan amarah.", "ans": "SS"},
]

print(f"Total compiled questions: {len(all_157_items)}")
assert len(all_157_items) == 157, f"Expected 157 items, got {len(all_157_items)}"

# Shuffle deterministically
seed = 20260925
rng = random.Random(seed)
shuffled = list(all_157_items)
rng.shuffle(shuffled)

# Assign new sequential numbers 1 to 157
final_items = []
for idx, it in enumerate(shuffled, start=1):
    final_items.append({
        "new_num": idx,
        "orig_num": it["orig"],
        "text": it["text"],
        "answer": it["ans"]
    })

with open("c:/form ATI/sesi3_157_shuffled.json", "w", encoding="utf-8") as f:
    json.dump(final_items, f, indent=2, ensure_ascii=False)

print("Saved sesi3_157_shuffled.json successfully!")
