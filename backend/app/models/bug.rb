class Bug < ApplicationRecord
  belongs_to :user

  has_many :environments, dependent: :destroy
  has_many :attempts, dependent: :destroy
  has_many :references, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user
  has_many :bug_tags, dependent: :destroy
  has_many :tags, through: :bug_tags

  scope :published, -> { where(status: "published") }
  scope :newest, -> { order(created_at: :desc) }
  scope :oldest, -> { order(created_at: :asc) }

  def self.search(params)
    bugs = published.includes(:tags, user: { image_attachment: :blob })
    bugs = search_by_keyword(bugs, params[:keyword]) if params[:keyword].present?
    sort_bugs(bugs, params[:sort])
  end

  def self.search_by_keyword(bugs, keyword)
    sanitized_keyword = "%#{sanitize_sql_like(keyword)}%"
    bugs.where(
      "title LIKE :keyword OR " \
      "error_message LIKE :keyword OR " \
      "bugs.id IN (SELECT bug_id FROM bug_tags " \
      "INNER JOIN tags ON bug_tags.tag_id = tags.id " \
      "WHERE tags.name LIKE :keyword)",
      keyword: sanitized_keyword,
    )
  end

  def self.sort_bugs(bugs, sort_type)
    case sort_type
    when "newest"
      bugs.newest
    when "oldest"
      bugs.oldest
    when "most_liked"
      bugs.joins("LEFT OUTER JOIN likes ON likes.bug_id = bugs.id").
        group("bugs.id").
        order("COUNT(likes.id) DESC")
    when "least_liked"
      bugs.joins("LEFT OUTER JOIN likes ON likes.bug_id = bugs.id").
        group("bugs.id").
        order("COUNT(likes.id) ASC")
    else
      bugs.newest
    end
  end
end
