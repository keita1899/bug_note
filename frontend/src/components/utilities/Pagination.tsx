type PaginationProps = {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | '...')[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages,
      )
    }

    return pages
  }

  return (
    <div className="flex space-x-2">
      <button
        className="btn btn-circle"
        onClick={() => onChange(1)}
        disabled={currentPage === 1}
      >
        «
      </button>
      <button
        className="btn btn-circle"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>
      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={index} className="btn btn-disabled btn-circle">
            ...
          </span>
        ) : (
          <button
            key={index}
            className={`btn btn-circle ${page === currentPage ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        ),
      )}
      <button
        className="btn btn-circle"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
      <button
        className="btn btn-circle"
        onClick={() => onChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        »
      </button>
    </div>
  )
}
