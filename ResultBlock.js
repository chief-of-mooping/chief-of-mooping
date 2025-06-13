
// ResultBlock.js
import React from "react";

export default function ResultBlock({ theories, methods, stats, sdgs }) {
  return (
    <div className="space-y-6 p-4">
      <Section title="ทฤษฎีที่เกี่ยวข้อง" items={theories} renderItem={(t) => (
        <div key={t.id} className="p-4 border rounded-2xl shadow-sm bg-white">
          <div className="font-semibold text-lg">{t.name_th}</div>
          {t.matched_keywords && (
            <p className="text-sm text-gray-600 mt-1">คำที่ตรงกัน: {t.matched_keywords.join(", ")}</p>
          )}
        </div>
      )} />

      <Section title="ระเบียบวิธีวิจัยที่เหมาะสม" items={methods} renderItem={(m) => (
        <div key={m.id} className="p-4 border rounded-2xl shadow-sm bg-white">
          <div className="font-semibold text-lg">{m.name_th}</div>
          {m.matched_variables && (
            <p className="text-sm text-gray-600 mt-1">ตัวแปรที่ตรงกัน: {m.matched_variables.join(", ")}</p>
          )}
        </div>
      )} />

      <Section title="เครื่องมือวิเคราะห์ทางสถิติ" items={stats} renderItem={(s) => (
        <div key={s.id} className="p-4 border rounded-2xl shadow-sm bg-white">
          <div className="font-semibold text-lg">{s.name_th}</div>
          <p className="text-sm text-gray-600 mt-1">ระดับ: {s.level}</p>
        </div>
      )} />

      <Section title="เป้าหมาย SDGs ที่เกี่ยวข้อง" items={sdgs} renderItem={(g) => (
        <div key={g.id} className="p-4 border rounded-2xl shadow-sm bg-white">
          <div className="font-semibold text-lg">{g.goal_th}</div>
          <p className="text-sm text-gray-600 mt-1">{g.rationale || g.description}</p>
        </div>
      )} />
    </div>
  );
}

function Section({ title, items, renderItem }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h2 className="text-xl font-bold mb-2 text-gray-700">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {items.map(renderItem)}
      </div>
    </section>
  );
}
