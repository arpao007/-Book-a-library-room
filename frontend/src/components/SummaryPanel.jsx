const items = [
  ['total', 'การจองทั้งหมด'],
  ['pending', 'รออนุมัติ'],
  ['approved', 'อนุมัติแล้ว'],
  ['rejected', 'ปฏิเสธ'],
  ['cancelled', 'ยกเลิกแล้ว'],
];

function SummaryPanel({ summary }) {
  return (
    <section className="summary-grid" aria-label="สรุปการจอง">
      {items.map(([key, label]) => (
        <article className="summary-card" key={key}>
          <span>{label}</span>
          <strong>{summary[key]}</strong>
        </article>
      ))}
    </section>
  );
}

export default SummaryPanel;
