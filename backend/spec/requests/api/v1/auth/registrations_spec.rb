require "rails_helper"

RSpec.describe "Api::V1::Auth::Registrations", type: :request do
  describe "POST /api/v1/auth" do
    let(:valid_params) do
      {
        email: "test@example.com",
        password: "password123",
        password_confirmation: "password123",
        confirm_success_url: "http://localhost:8080/signin",
      }
    end

    let(:invalid_params) do
      {
        email: "",
        password: "password123",
        password_confirmation: "password123",
        confirm_success_url: "http://localhost:8080/signin",
      }
    end

    let(:duplicate_params) do
      {
        email: "duplicate@example.com",
        password: "password123",
        password_confirmation: "password123",
        confirm_success_url: "http://localhost:8080/signin",
      }
    end

    context "ログインしていない場合" do
      context "入力するパラメータが正しい場合" do
        it "新規登録が成功し、確認メールが送信される" do
          post "/api/v1/auth", params: valid_params, as: :json

          expect(response).to have_http_status(:ok)
          user = User.find_by(email: valid_params[:email])

          expect(user.confirmed_at).to be_nil
          expect(ActionMailer::Base.deliveries.count).to eq(1)
        end
      end

      context "入力するパラメータが間違っている場合" do
        it "422 エラーが返る" do
          post "/api/v1/auth", params: invalid_params, as: :json

          expect(response).to have_http_status(:unprocessable_entity)
          expect(JSON.parse(response.body)["errors"]["email"]).to include("を入力してください")
        end
      end

      context "メールアドレスが重複している場合" do
        before { create(:user, email: "duplicate@example.com") }

        it "422 エラーが返る" do
          post "/api/v1/auth", params: duplicate_params, as: :json

          expect(response).to have_http_status(:unprocessable_entity)
          expect(JSON.parse(response.body)["errors"]["email"]).to include("はすでに存在します")
        end
      end
    end
  end
end
