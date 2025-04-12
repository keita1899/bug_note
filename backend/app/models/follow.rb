class Follow < ApplicationRecord
  belongs_to :follower, class_name: "User", inverse_of: :active_follows
  belongs_to :followed, class_name: "User", inverse_of: :passive_follows

  validates :follower_id, presence: true
  validates :followed_id, presence: true

  after_create :create_notification_for_follow

  private

    def create_notification_for_follow
      Notification.create!(
        user: followed,
        actor: follower,
        notifiable: self,
        action: "followed",
      )
    end
end
