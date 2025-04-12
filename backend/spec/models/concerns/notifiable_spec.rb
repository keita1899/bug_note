require "rails_helper"

class TestNotifiable < ApplicationRecord
  self.table_name = "bugs"
  include Notifiable
  belongs_to :user
end

RSpec.describe Notifiable, type: :model do
  let(:user) { create(:user) }
  let(:actor) { create(:user) }
  let(:notifiable) { create(:bug, user: user) }

  describe "#create_notification" do
    context "通知対象がユーザー自身でない場合" do
      it "通知が作成されること" do
        expect {
          notifiable.create_notification(actor, "liked", user)
        }.to change { Notification.count }.by(1)

        notification = Notification.last
        expect(notification.user).to eq actor
        expect(notification.actor).to eq user
        expect(notification.notifiable).to eq notifiable
        expect(notification.action).to eq "liked"
      end

      it "actorが指定されていない場合、notifiableのユーザーがactorになること" do
        expect {
          notifiable.create_notification(actor, "liked")
        }.to change { Notification.count }.by(1)

        notification = Notification.last
        expect(notification.actor).to eq notifiable.user
      end
    end

    context "通知対象がユーザー自身の場合" do
      it "通知が作成されないこと" do
        expect {
          notifiable.create_notification(notifiable.user, "liked", actor)
        }.not_to change { Notification.count }
      end
    end
  end

  describe "#create_notifications_for_followers" do
    let(:first_follower) { create(:user) }
    let(:second_follower) { create(:user) }

    before do
      first_follower.follow(user)
      second_follower.follow(user)
    end

    context "フォロワーが存在する場合" do
      it "フォロワー全員に通知が作成されること" do
        expect {
          notifiable.create_notifications_for_followers("published")
        }.to change { Notification.count }.by(2)

        notifications = Notification.last(2)
        expect(notifications.map(&:user)).to contain_exactly(first_follower, second_follower)
        expect(notifications.map(&:actor)).to all(eq(user))
        expect(notifications.map(&:notifiable)).to all(eq(notifiable))
        expect(notifications.map(&:action)).to all(eq("published"))
      end

      it "フォロワーがnotifiableのユーザー自身の場合は通知が作成されないこと" do
        user.follow(user)
        expect {
          notifiable.create_notifications_for_followers("published")
        }.to change { Notification.count }.by(2)
      end
    end

    context "フォロワーが存在しない場合" do
      before do
        user.followers.destroy_all
      end

      it "通知が作成されないこと" do
        expect {
          notifiable.create_notifications_for_followers("published")
        }.not_to change { Notification.count }
      end
    end
  end
end
