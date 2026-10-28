const filters = [
  ['all', 'ทั้งหมด'],
  ['pending', 'รออนุมัติ'],
  ['approved', 'อนุมัติแล้ว'],
  ['rejected', 'ปฏิเสธ'],
  ['cancelled', 'ยกเลิกแล้ว'],
];

function FilterBar({ value, onFilterChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="กรองสถานะการจอง">
      {filters.map(([filterValue, label]) => (
        <button
          className={value === filterValue ? 'filter-active' : 'filter-button'}
          key={filterValue}
          type="button"
          onClick={() => onFilterChange(filterValue)}
          aria-pressed={value === filterValue}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
