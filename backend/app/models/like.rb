class Like < ApplicationRecord
  include Notifiable

  belongs_to :user
  belongs_to :bug, counter_cache: true

  validates :user_id, uniqueness: { scope: :bug_id }

  after_create :create_notification_for_like

  private

    def create_notification_for_like
      create_notification(bug.user, "liked", user)
    end
end
