class Comment < ApplicationRecord
  include Notifiable

  belongs_to :user
  belongs_to :bug

  validates :content, presence: true, length: { maximum: 1000 }

  after_create :create_notification_for_comment

  private

    def create_notification_for_comment
      create_notification(bug.user, "commented", user)
    end
end
