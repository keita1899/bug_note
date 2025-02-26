require "rails_helper"

RSpec.describe "Api::V1::User::Confirmations", type: :request do
  let(:user) { create(:user, confirmation_token: "test_token", confirmed_at: nil) }

  describe "PATCH /api/v1/user/confirmations" do
    context "有効な確認トークンが渡された場合" do
      it "アカウントを有効化し、成功メッセージを返す" do
        patch "/api/v1/user/confirmations", params: { confirmation_token: user.confirmation_token }

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["message"]).to eq("アカウントが有効化されました。")
        expect(user.reload.confirmed_at).not_to be_nil
      end
    end

    context "無効なトークンが渡された場合" do
      it "ユーザーが見つからず、404を返す" do
        patch "/api/v1/user/confirmations", params: { confirmation_token: "invalid_token" }

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)["message"]).to eq("ユーザーが見つかりません。")
      end
    end

    context "すでにアカウントが有効化されている場合" do
      before { user.update!(confirmed_at: Time.current) }

      it "400エラーを返す" do
        patch "/api/v1/user/confirmations", params: { confirmation_token: user.confirmation_token }

        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)["message"]).to eq("アカウントはすでに有効化されています。")
      end
    end
  end
end
