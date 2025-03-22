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

  describe "DELETE /api/v1/auth" do
    let!(:user) { create(:user, password: "password123") }
    let(:headers) { user.create_new_auth_token }
    let(:valid_params) { { password: "password123" } }
    let(:invalid_params) { { password: "wrongpassword" } }

    context "ログインしている場合" do
      it "パスワードが正しければアカウントの削除が成功する" do
        expect {
          delete api_v1_user_registration_path, params: valid_params, headers: headers, as: :json
        }.to change { User.count }.by(-1)

        expect(response).to have_http_status(:ok)
        expect(response_json["message"]).to include("アカウントが削除されました")
      end

      it "パスワードが間違っていればアカウントの削除が失敗し、422 エラーが返る" do
        expect {
          delete api_v1_user_registration_path, params: invalid_params, headers: headers, as: :json
        }.not_to change { User.count }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_json["error"]).to include("パスワードが正しくありません")
      end
    end

    context "ログインしていない場合" do
      it "401 エラーが返る" do
        expect {
          delete api_v1_user_registration_path, params: valid_params, as: :json
        }.not_to change { User.count }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
