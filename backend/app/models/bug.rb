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

  def self.search(params)
    bugs = published.includes(:tags, user: { image_attachment: :blob })

    return bugs if params[:keyword].blank?

    keyword = "%#{params[:keyword]}%"
    bugs.where(
      "title LIKE :keyword OR " \
      "error_message LIKE :keyword OR " \
      "id IN (SELECT bug_id FROM bug_tags " \
      "INNER JOIN tags ON bug_tags.tag_id = tags.id " \
      "WHERE tags.name LIKE :keyword)",
      keyword: keyword,
    )
  end
end
