module Pagination
  extend ActiveSupport::Concern

  def pagination(records)
    {
      current_page: records.current_page,
      total_pages: records.total_pages,
      total_count: records.total_count,
    }
  end
end
