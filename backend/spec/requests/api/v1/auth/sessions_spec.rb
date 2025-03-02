require "rails_helper"

RSpec.describe "Api::V1::Auth::Sessions", type: :request do
  describe "POST /api/v1/auth/sign_in" do
    let!(:user) { create(:user, email: "test@example.com") }

    let(:valid_params) do
      {
        email: "test@example.com",
        password: "password123",
      }
    end

    let(:invalid_email_params) do
      {
        email: "wrong@example.com",
        password: "password123",
      }
    end

    let(:invalid_password_params) do
      {
        email: "test@example.com",
        password: "wrongpassword123",
      }
    end

    context "入力するパラメータが正しい場合" do
      it "ログインが成功する" do
        post "/api/v1/auth/sign_in", params: valid_params, as: :json

        expect(response).to have_http_status(:ok)
        expect(response.headers).to include("access-token")
        expect(response.headers).to include("client")
        expect(response.headers).to include("uid")
      end
    end

    context "入力するメールアドレスが間違っている場合" do
      it "401 エラーが返る" do
        post "/api/v1/auth/sign_in", params: invalid_email_params, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "入力するパスワードが間違っている場合" do
      it "401 エラーが返る" do
        post "/api/v1/auth/sign_in", params: invalid_password_params, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
