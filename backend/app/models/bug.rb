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

  def self.search(params)
    bugs = Bug.includes(:tags, :likes, :user).where(status: "published")

    if params[:keyword].present?
      bugs = bugs.where(
        "title LIKE :keyword OR error_message LIKE :keyword",
        keyword: "%#{params[:keyword]}%",
      )
    end

    bugs
  end
end
