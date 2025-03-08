require "rails_helper"

RSpec.describe "Api::V1::Bug", type: :request do
  describe "POST /api/v1/bugs" do
    let!(:user) { create(:user) }
    let(:headers) { user.create_new_auth_token }
    let(:valid_params) do
      {
        title: "Example Bug Title",
        error_message: "Example error message",
        content: "Example bug content",
        expected_behavior: "Expected behavior content",
        solution: "Solution to the bug",
        cause: "Root cause of the bug",
        etc: "Other info",
        is_solved: false,
        status: "draft",
        environments: [
          { category: "プログラミング言語", name: "Ruby", version: "2.7.0" },
        ],
        attempts: [
          { content: "Tried restarting the server" },
        ],
        references: [
          { url: "http://example.com" },
        ],
      }
    end

    let(:invalid_params) do
      {
        title: "",
        error_message: "",
        content: "",
        expected_behavior: "",
        solution: "",
        cause: "",
        etc: "",
        is_solved: false,
        status: "draft",
        environments: [],
        attempts: [],
        references: [],
      }
    end

    context "ログインしている場合" do
      it "正しい値が入力された場合、バグの登録が成功する" do
        expect {
          post "/api/v1/bugs", params: valid_params, headers: headers, as: :json
        }.to change { Bug.count }.by(1)

        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)["message"]).to eq("メモを保存しました")
      end

      it "間違った値が入力された場合、バグの登録が失敗し、422エラーを返す" do
        expect {
          post "/api/v1/bugs", params: invalid_params, headers: headers, as: :json
        }.not_to change { Bug.count }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"].join).to include("を入力してください")
      end
    end

    context "ログインしていない場合" do
      it "401 エラーが返る" do
        post "/api/v1/bugs", params: valid_params, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
