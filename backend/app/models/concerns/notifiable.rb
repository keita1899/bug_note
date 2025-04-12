module Notifiable
  extend ActiveSupport::Concern

  included do
    has_many :notifications, as: :notifiable, dependent: :destroy
  end

  def create_notification(user, action, actor = nil)
    return if user == self.user

    Notification.create!(
      user: user,
      actor: actor || self.user,
      notifiable: self,
      action: action,
    )
  end

  def create_notifications_for_followers(action)
    return unless respond_to?(:user) && user.respond_to?(:followers)

    user.followers.find_each do |follower|
      next if follower == self.user

      Notification.create!(
        user: follower,
        actor: self.user,
        notifiable: self,
        action: action,
      )
    end
  end
end
