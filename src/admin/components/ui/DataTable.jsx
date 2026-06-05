/* ============================================
   DataTable — shared admin UI
   ============================================
   Reusable sortable / filterable / paginated table that backs the Leads,
   Notices and Events modules so they stay visually and behaviourally
   consistent. Fully controlled internally — pass `columns` + `rows`.

   columns: [{
     key,                      // unique key + default field accessor
     header,                   // column label
     sortable,                 // enable header sort
     align,                    // 'left' | 'center' | 'right'
     width,                    // CSS width (e.g. '120px')
     render: (row) => node,    // custom cell renderer
     sortValue: (row) => any,  // value used for sorting (defaults to row[key])
     searchValue: (row) => any,// value used for search (defaults to row[key])
     searchable,               // set false to exclude from default search
   }]
   ============================================ */

import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './DataTable.module.css';

const compareValues = (a, b) => {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
};

const DataTable = ({
  columns = [],
  rows = [],
  getRowId,
  searchable = true,
  searchKeys,
  searchPlaceholder = 'Search…',
  initialSort = null, // { key, direction: 'asc' | 'desc' }
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  onRowClick,
  toolbar,
  emptyIcon = 'mdi:table-search',
  emptyTitle = 'Nothing here yet',
  emptyMessage = 'Records will appear here once they are added.',
  dense = false,
  rowKeyFallbackPrefix = 'row',
}) => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(pageSize);

  const rowId = (row, index) => {
    if (getRowId) return getRowId(row, index);
    return row?.id ?? row?.lead_id ?? `${rowKeyFallbackPrefix}-${index}`;
  };

  // ---- Filter ----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    const keys =
      searchKeys && searchKeys.length
        ? searchKeys
        : columns.filter((c) => c.searchable !== false).map((c) => c.key);
    return rows.filter((row) =>
      keys.some((key) => {
        const col = columns.find((c) => c.key === key);
        const value = col?.searchValue ? col.searchValue(row) : row[key];
        return String(value ?? '').toLowerCase().includes(q);
      })
    );
  }, [rows, query, searchKeys, columns]);

  // ---- Sort ----
  const sorted = useMemo(() => {
    if (!sort?.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const accessor = (row) => (col.sortValue ? col.sortValue(row) : row[col.key]);
    const dir = sort.direction === 'desc' ? -1 : 1;
    return [...filtered].sort((a, b) => compareValues(accessor(a), accessor(b)) * dir);
  }, [filtered, sort, columns]);

  // ---- Paginate ----
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * perPage;
  const pageRows = sorted.slice(start, start + perPage);
  const showingFrom = total === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + perPage, total);

  const handleSort = (col) => {
    if (!col.sortable) return;
    setPage(0);
    setSort((prev) => {
      if (prev?.key !== col.key) return { key: col.key, direction: 'asc' };
      if (prev.direction === 'asc') return { key: col.key, direction: 'desc' };
      return null; // third click clears sorting
    });
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(0);
  };

  const sortIcon = (col) => {
    if (!col.sortable) return null;
    if (sort?.key !== col.key) return 'mdi:unfold-more-horizontal';
    return sort.direction === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down';
  };

  const ariaSort = (col) => {
    if (!col.sortable || sort?.key !== col.key) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className={styles.wrapper}>
      {/* Control bar */}
      {(searchable || toolbar) && (
        <div className={styles.controls}>
          {searchable && (
            <div className={styles.search}>
              <Icon icon="mdi:magnify" width={18} height={18} className={styles.searchIcon} />
              <input
                type="search"
                value={query}
                onChange={handleSearch}
                placeholder={searchPlaceholder}
                aria-label="Search table"
                className={styles.searchInput}
              />
            </div>
          )}
          {toolbar && <div className={styles.toolbar}>{toolbar}</div>}
        </div>
      )}

      {/* Table */}
      <div className={styles.tableScroll}>
        <table className={`${styles.table} ${dense ? styles.dense : ''}`.trim()}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={ariaSort(col)}
                  style={{ width: col.width, textAlign: col.align || 'left' }}
                  className={col.sortable ? styles.sortableTh : undefined}
                >
                  {col.sortable ? (
                    <button type="button" className={styles.sortBtn} onClick={() => handleSort(col)}>
                      <span>{col.header}</span>
                      <Icon icon={sortIcon(col)} width={15} height={15} className={styles.sortIcon} />
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          {pageRows.length > 0 && (
            <tbody>
              {pageRows.map((row, index) => {
                const id = rowId(row, start + index);
                const clickable = Boolean(onRowClick);
                return (
                  <tr
                    key={id}
                    className={clickable ? styles.clickableRow : undefined}
                    onClick={clickable ? () => onRowClick(row) : undefined}
                    onKeyDown={
                      clickable
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                    tabIndex={clickable ? 0 : undefined}
                    role={clickable ? 'button' : undefined}
                  >
                    {columns.map((col) => (
                      <td key={col.key} style={{ textAlign: col.align || 'left' }} data-label={col.header}>
                        {col.render ? col.render(row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          )}
        </table>
      </div>

      {/* Empty state lives outside the horizontal scroll area so its message is
          never clipped on narrow screens where the table itself overflows. */}
      {pageRows.length === 0 && (
        <div className={styles.empty}>
          <Icon icon={emptyIcon} width={44} height={44} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>{query ? 'No matching records' : emptyTitle}</p>
          <p className={styles.emptyMessage}>{query ? 'Try a different search term.' : emptyMessage}</p>
        </div>
      )}

      {/* Pagination footer */}
      {total > 0 && (
        <div className={styles.footer}>
          <span className={styles.count}>
            Showing <strong>{showingFrom}</strong>–<strong>{showingTo}</strong> of <strong>{total}</strong>
          </span>

          <div className={styles.pager}>
            {pageSizeOptions.length > 1 && (
              <label className={styles.perPage}>
                Rows
                <select
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(0);
                  }}
                  aria-label="Rows per page"
                >
                  {pageSizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <div className={styles.pageNav}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                aria-label="Previous page"
                className={styles.pageBtn}
              >
                <Icon icon="mdi:chevron-left" width={20} height={20} />
              </button>
              <span className={styles.pageInfo}>
                {safePage + 1} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={safePage >= pageCount - 1}
                aria-label="Next page"
                className={styles.pageBtn}
              >
                <Icon icon="mdi:chevron-right" width={20} height={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
