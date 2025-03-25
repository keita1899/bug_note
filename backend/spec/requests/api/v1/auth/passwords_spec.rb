require "rails_helper"

RSpec.describe "Api::V1::Auth::Passwords", type: :request do
  describe "PATCH /api/v1/auth" do
    let(:user) { create(:user, password: "password123") }
    let(:headers) { user.create_new_auth_token }

    let(:valid_params) do
      {
        current_password: "password123",
        password: "newpassword123",
        password_confirmation: "newpassword123",
      }
    end

    let(:invalid_params_wrong_current_password) do
      {
        current_password: "wrongpassword",
        password: "newpassword123",
        password_confirmation: "newpassword123",
      }
    end

    let(:invalid_params_same_password) do
      {
        current_password: "password123",
        password: "password123",
        password_confirmation: "password123",
      }
    end

    let(:invalid_params_mismatch_confirmation) do
      {
        current_password: "password123",
        password: "newpassword123",
        password_confirmation: "wrongpassword123",
      }
    end

    context "ログインしている場合" do
      context "入力するパラメータが正しい場合" do
        it "パスワードの変更が成功する" do
          patch api_v1_user_password_path, params: valid_params, headers: headers

          expect(response).to have_http_status(:ok)
          expect(response_json["message"]).to eq("パスワードが変更されました")

          user.reload
          expect(user).not_to be_valid_password("password123")
          expect(user).to be_valid_password("newpassword123")
        end
      end

      context "入力するパラメータが間違っている場合" do
        it "現在のパスワードが異なる場合、パスワードの変更が失敗する" do
          patch api_v1_user_password_path, params: invalid_params_wrong_current_password, headers: headers
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response_json["errors"]).to include("現在のパスワードが間違っています")

          user.reload
          expect(user).to be_valid_password("password123")
        end

        it "新しいパスワードが現在のパスワードと同じ場合、パスワードの変更が失敗する" do
          patch api_v1_user_password_path, params: invalid_params_same_password, headers: headers
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response_json["errors"]).to include("新しいパスワードは現在のパスワードと異なっている必要があります")

          user.reload
          expect(user).to be_valid_password("password123")
        end

        it "新しいパスワードが確認用のパスワードと異なる場合、パスワードの変更が失敗する" do
          patch api_v1_user_password_path, params: invalid_params_mismatch_confirmation, headers: headers
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response_json["errors"]).to include("パスワード確認用とパスワードの入力が一致しません")

          user.reload
          expect(user).to be_valid_password("password123")
        end
      end
    end

    context "ログインしていない場合" do
      it "401 エラーが返る" do
        patch api_v1_user_password_path, params: valid_params

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
