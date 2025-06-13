
# 🧩 Prompt #11 — Master Deployment Plan & Integration Checklist

## 🎯 วัตถุประสงค์
รวมระบบ Web App “ผู้ช่วยนักวิจัยอัจฉริยะ Next-Gen” ให้นำไปใช้งานได้จริง 100% โดยอ้างอิงจาก prompt 1–10

---

## 🗂️ รายชื่อไฟล์ทั้งหมด

| ไฟล์ | ประเภท | บทบาท |
|------|--------|--------|
| index.html | HTML | ศูนย์กลางรวมไฟล์ทั้งหมด |
| logic.js | JavaScript | วิเคราะห์คำถาม จับคู่ทฤษฎี/ระเบียบวิธี/SDGs/สถิติ |
| render.js | JavaScript | ควบคุมการรับ input → ส่งผลลัพธ์ไปยัง UI |
| ResultBlock.js | JavaScript (React Component) | แสดงผลลัพธ์ที่จับคู่แล้วแบบมืออาชีพ |
| core_theories.json | JSON | ฐานข้อมูลทฤษฎี |
| research_methods.json | JSON | ฐานข้อมูลระเบียบวิธีวิจัย |
| stats_tools.json | JSON | เครื่องมือวิเคราะห์ทางสถิติ |
| sdgs.json | JSON | เป้าหมาย SDGs |
| manifest.json | JSON | รองรับระบบ PWA |
| sw.js | JavaScript | รองรับ offline mode ด้วย Service Worker |
| app-icon.png | PNG | ไอคอนของ PWA |

---

## 📌 โครงสร้างไฟล์ Flat Structure

```
📁 project-root/
├── index.html
├── logic.js
├── render.js
├── ResultBlock.js
├── core_theories.json
├── research_methods.json
├── stats_tools.json
├── sdgs.json
├── manifest.json
├── sw.js
└── app-icon.png
```

---

## 🧪 Checklist สำหรับ QA

| รายการตรวจสอบ | คำอธิบาย | สถานะ |
|----------------|-----------|--------|
| เปิด `index.html` ใช้งานได้ | หน้าโหลดถูก แสดง textarea และปุ่ม | ✅ |
| ใส่ข้อความแล้วกด “วิเคราะห์” | มีผลลัพธ์แสดงบนหน้าจอ | ✅ |
| โหลดข้อมูลจาก JSON ถูกต้อง | ไม่ hardcode ใน logic.js | ✅ |
| ผลลัพธ์เรียงลำดับและจัดกลุ่ม | เช่น ทฤษฎี → ระเบียบวิธี → สถิติ → SDGs | ✅ |
| ฟอนต์ไทยแสดงได้สวยงาม | Responsive บนอุปกรณ์ต่าง ๆ | ✅ |
| PWA ใช้งานได้ | สามารถ add to home screen | ✅ |
| offline ใช้งานได้ | เปิดใหม่โดยไม่ต่อเน็ตได้ | ✅ |
| icon ตรงกับ `manifest.json` | แสดงผลตามที่ตั้งไว้ | ✅ |

---

## 📦 วิธี Deploy

### 📍 GitHub Pages
1. สร้าง repo
2. อัปโหลดไฟล์ทั้งหมด
3. ไปที่ Settings → Pages → เลือก branch
4. รอ 1–2 นาที แล้วเปิดใช้งานผ่าน URL

### 📍 Firebase Hosting

```bash
firebase init
# เลือก hosting
# ตั้ง public folder เป็น ./
# ไม่ overwrite index.html
firebase deploy
```

---

## 📄 README.md ควรมี

- คำอธิบายการใช้งาน
- รายการไฟล์ทั้งหมด
- วิธี deploy แบบ GitHub/Firebase
- เงื่อนไข License เช่น MIT
- แนบ Prompt ทั้งหมดในภาคผนวก
