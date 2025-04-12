require "rails_helper"

RSpec.describe "Api::V1::Mypage::Notifications", type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "GET /api/v1/mypage/notifications" do
    before do
      create(:notification, :like, user: user, read: true)
      create(:notification, :comment, user: user, read: false)
      create(:notification, :follow, user: other_user)
    end

    context "ログインしている場合" do
      it "現在のユーザーの通知一覧をページネーション付きで返す" do
        get "/api/v1/mypage/notifications", headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["notifications"].size).to eq(2)
        expect(response_json["meta"]).to include("current_page", "total_pages", "total_count")
      end

      it "未読の通知のみを返す" do
        get "/api/v1/mypage/notifications", params: { tab: "unread" }, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["notifications"].size).to eq(1)
        expect(response_json["notifications"].first["read"]).to be_falsey
      end

      it "既読の通知のみを返す" do
        get "/api/v1/mypage/notifications", params: { tab: "read" }, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["notifications"].size).to eq(1)
        expect(response_json["notifications"].first["read"]).to be_truthy
      end
    end

    context "ログインしていない場合" do
      it "認証エラーを返す" do
        get "/api/v1/mypage/notifications"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/v1/mypage/notifications/header" do
    before do
      create_list(:notification, 6, user: user)
    end

    context "ログインしている場合" do
      it "最新5件の通知を返す" do
        get "/api/v1/mypage/notifications/header", headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json.size).to eq(5)
      end
    end

    context "ログインしていない場合" do
      it "認証エラーを返す" do
        get "/api/v1/mypage/notifications/header"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/v1/mypage/notifications/:id" do
    before do
      @notification = create(:notification, :like, user: user, read: false)
    end

    context "ログインしている場合" do
      it "通知を既読にする" do
        expect {
          patch "/api/v1/mypage/notifications/#{@notification.id}", headers: headers
        }.to change { @notification.reload.read }.from(false).to(true)

        expect(response).to have_http_status(:no_content)
      end

      it "他のユーザーの通知を更新しようとすると404エラーを返す" do
        other_notification = create(:notification, :comment, user: other_user)
        patch "/api/v1/mypage/notifications/#{other_notification.id}", headers: headers

        expect(response).to have_http_status(:not_found)
      end
    end

    context "ログインしていない場合" do
      it "認証エラーを返す" do
        patch "/api/v1/mypage/notifications/#{@notification.id}"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/mypage/notifications/:id" do
    before do
      @notification = create(:notification, :follow, user: user)
    end

    context "ログインしている場合" do
      it "通知を削除する" do
        expect {
          delete "/api/v1/mypage/notifications/#{@notification.id}", headers: headers
        }.to change { Notification.count }.by(-1)

        expect(response).to have_http_status(:no_content)
      end

      it "他のユーザーの通知を削除しようとすると404エラーを返す" do
        other_notification = create(:notification, :like, user: other_user)
        delete "/api/v1/mypage/notifications/#{other_notification.id}", headers: headers

        expect(response).to have_http_status(:not_found)
      end
    end

    context "ログインしていない場合" do
      it "認証エラーを返す" do
        delete "/api/v1/mypage/notifications/#{@notification.id}"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
