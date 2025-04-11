class Notification < ApplicationRecord
  belongs_to :user
  belongs_to :actor, class_name: "User"
  belongs_to :notifiable, polymorphic: true

  validates :user_id, presence: true
  validates :action, presence: true

  scope :read, -> { where(read: true) }
  scope :unread, -> { where(read: false) }
  scope :recent, -> { order(created_at: :desc) }
  scope :filter_by_tab, ->(tab) {
    case tab
    when "unread"
      unread
    when "read"
      read
    else
      all
    end
  }

  enum action: {
    liked: "liked",
    followed: "followed",
    commented: "commented",
    published: "published",
  }
end
