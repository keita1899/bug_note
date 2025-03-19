require "rails_helper"

RSpec.describe "Api::V1::Likes", type: :request do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }
  let(:published_bug) { create(:bug, :published, user: user) }

  describe "POST /api/v1/bugs/:id/likes" do
    context "ログインしている場合" do
      it "いいねが成功する" do
        expect {
          post api_v1_bug_likes_path(published_bug.id), headers: headers
        }.to change { published_bug.reload.likes.count }.by(1)

        expect(response).to have_http_status(:created)
        expect(response_json["message"]).to eq("いいねしました")
      end

      it "すでにいいねされている場合、いいねが失敗する" do
        published_bug.likes.create!(user: user)

        expect {
          post api_v1_bug_likes_path(published_bug.id), headers: headers
        }.not_to change { published_bug.reload.likes.count }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_json["error"]).to eq("すでにいいねされています")
      end
    end

    context "ログインしていない場合" do
      it "401 エラーを返す" do
        post api_v1_bug_likes_path(published_bug.id)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/bugs/:id/likes" do
    context "ログインしている場合" do
      before do
        # 初回のいいね作成
        published_bug.likes.create(user: user)
      end

      it "いいね削除が成功する" do
        expect {
          delete api_v1_bug_likes_path(published_bug.id), headers: headers
        }.to change { published_bug.reload.likes.count }.by(-1)

        expect(response).to have_http_status(:ok)
        expect(response_json["message"]).to eq("いいねを削除しました")
      end

      it "いいねされていない場合、いいね削除が失敗する" do
        published_bug.likes.where(user: user).destroy_all

        expect {
          delete api_v1_bug_likes_path(published_bug.id), headers: headers
        }.not_to change { published_bug.reload.likes.count }

        expect(response).to have_http_status(:not_found)
        expect(response_json["error"]).to eq("いいねされていません")
      end
    end

    context "ログインしていない場合" do
      it "401 エラーを返す" do
        delete api_v1_bug_likes_path(published_bug.id)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
