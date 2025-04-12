require "rails_helper"

RSpec.describe Notification, type: :model do
  describe "アソシエーション" do
    let(:notification) { build(:notification) }

    it "ユーザーに属していること" do
      expect(notification.user).to be_present
    end

    it "actor（User）に属していること" do
      expect(notification.actor).to be_present
      expect(notification.actor).to be_a(User)
    end

    it "通知対象（notifiable）に属していること" do
      expect(notification.notifiable).to be_present
    end
  end

  describe "バリデーション" do
    let(:notification) { build(:notification) }

    it "ユーザーIDが必須であること" do
      notification.user = nil
      expect(notification).not_to be_valid
      expect(notification.errors[:user_id]).to include("を入力してください")
    end

    it "アクションが必須であること" do
      notification.action = nil
      expect(notification).not_to be_valid
      expect(notification.errors[:action]).to include("を入力してください")
    end
  end

  describe "スコープ" do
    describe "既読/未読フィルター" do
      before do
        @read_notification = create(:notification, :read)
        @unread_notification = create(:notification, :unread)
      end

      describe ".read" do
        it "既読の通知のみを返すこと" do
          expect(Notification.read).to include(@read_notification)
          expect(Notification.read).not_to include(@unread_notification)
        end
      end

      describe ".unread" do
        it "未読の通知のみを返すこと" do
          expect(Notification.unread).to include(@unread_notification)
          expect(Notification.unread).not_to include(@read_notification)
        end
      end
    end

    describe ".filter_by_tab" do
      before do
        @read_notification = create(:notification, :read)
        @unread_notification = create(:notification, :unread)
      end

      it 'タブが"unread"の場合、未読の通知のみを返すこと' do
        expect(Notification.filter_by_tab("unread")).to include(@unread_notification)
        expect(Notification.filter_by_tab("unread")).not_to include(@read_notification)
      end

      it 'タブが"read"の場合、既読の通知のみを返すこと' do
        expect(Notification.filter_by_tab("read")).to include(@read_notification)
        expect(Notification.filter_by_tab("read")).not_to include(@unread_notification)
      end

      it 'タブが"all"の場合、全ての通知を返すこと' do
        expect(Notification.filter_by_tab("all")).to include(@read_notification, @unread_notification)
      end
    end

    describe ".recent" do
      before do
        @old_notification = create(:notification, created_at: 2.days.ago)
        @new_notification = create(:notification, created_at: 1.day.ago)
      end

      it "作成日時の降順で通知を返すこと" do
        expect(Notification.recent.to_a).to eq([@new_notification, @old_notification])
      end
    end
  end

  describe "アクションの種類" do
    it "いいね、フォロー、コメント、投稿の4種類が定義されていること" do
      expect(Notification.actions.keys).to contain_exactly("liked", "followed", "commented", "published")
    end

    it "各アクションの値が正しく設定されていること" do
      expect(Notification.actions["liked"]).to eq "liked"
      expect(Notification.actions["followed"]).to eq "followed"
      expect(Notification.actions["commented"]).to eq "commented"
      expect(Notification.actions["published"]).to eq "published"
    end
  end
end
