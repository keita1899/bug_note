require "rails_helper"

RSpec.describe "Api::V1::Follows", type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "POST /api/v1/users/:id/follow" do
    context "ログインしている場合" do
      it "他のユーザーをフォローできる" do
        post follow_api_v1_user_path(other_user), headers: headers
        expect(response).to have_http_status(:ok)
        expect(response_json["message"]).to eq("フォローしました")
      end

      it "自分をフォローできない" do
        post follow_api_v1_user_path(user), headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_json["message"]).to eq("自分をフォローすることはできません")
      end

      it "既にフォローしている場合はエラーを返す" do
        user.follow(other_user)
        post follow_api_v1_user_path(other_user), headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_json["message"]).to eq("既にフォローしています")
      end
    end

    context "ログインしていない場合" do
      it "401 エラーを返す" do
        post follow_api_v1_user_path(other_user)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/users/:id/unfollow" do
    context "ログインしている場合" do
      before do
        user.follow(other_user)
      end

      it "他のユーザーのフォローを解除できる" do
        delete unfollow_api_v1_user_path(other_user), headers: headers
        expect(response).to have_http_status(:ok)
        expect(response_json["message"]).to eq("フォローを解除しました")
      end
    end

    context "ログインしていない場合" do
      it "401 エラーを返す" do
        delete unfollow_api_v1_user_path(other_user)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
