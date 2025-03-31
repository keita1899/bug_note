require "rails_helper"

RSpec.describe "Api::V1::Mypage::Profile", type: :request do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }
  let(:valid_params) do
    {
      name: "New Name",
      nickname: "New Nickname",
      bio: "New Bio",
      github_url: "https://github.com/newuser",
      website_url: "https://example.com",
    }
  end
  let(:invalid_params) do
    {
      name: "a" * 256,
      nickname: "a" * 256,
      bio: "a" * 501,
      github_url: "invalid-url",
      website_url: "invalid-url",
    }
  end

  describe "GET /api/v1/mypage/profile" do
    context "ログインしている場合" do
      it "プロフィールの情報を取得できる" do
        get api_v1_mypage_profile_path, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json).to include(
          "name" => user.name,
          "nickname" => user.nickname,
          "bio" => user.bio,
          "github_url" => user.github_url,
          "website_url" => user.website_url,
          "image_url" => user.image_url,
        )
      end
    end

    context "ログインしていない場合" do
      it "認証エラーが発生すること" do
        get api_v1_mypage_profile_path

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "PATCH /api/v1/mypage/profile" do
    context "ログインしている場合" do
      context "正しい値が入力された場合" do
        it "プロフィールの情報の更新が成功する" do
          patch api_v1_mypage_profile_path, params: valid_params, headers: headers

          expect(response).to have_http_status(:ok)
          expect(response_json["message"]).to eq("プロフィールを更新しました")

          user.reload
          expect(user.name).to eq(valid_params[:name])
          expect(user.nickname).to eq(valid_params[:nickname])
          expect(user.bio).to eq(valid_params[:bio])
          expect(user.github_url).to eq(valid_params[:github_url])
          expect(user.website_url).to eq(valid_params[:website_url])
        end
      end

      context "間違った値が入力された場合" do
        it "プロフィールの情報の更新が失敗する" do
          patch api_v1_mypage_profile_path, params: invalid_params, headers: headers

          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    context "ログインしていない場合" do
      it "認証エラーが発生すること" do
        patch api_v1_mypage_profile_path, params: valid_params

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
