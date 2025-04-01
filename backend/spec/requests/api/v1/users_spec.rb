require "rails_helper"

RSpec.describe "Api::V1::Users", type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let!(:published_bug) { create(:bug, user: user, status: "published") }
  let!(:draft_bug) { create(:bug, user: user, status: "draft") }

  describe "GET /api/v1/users/:id" do
    it "ユーザーの詳細情報を返す" do
      get api_v1_user_path(user)

      expect(response).to have_http_status(:ok)
      expect(response_json["id"]).to eq(user.id)
      expect(response_json["name"]).to eq(user.name)
      expect(response_json["image_url"]).to eq(user.image_url)
      expect(response_json["nickname"]).to eq(user.nickname)
    end

    it "存在しないユーザーの場合は404を返す" do
      get api_v1_user_path(-1)

      expect(response).to have_http_status(:not_found)
      expect(response_json["error"]).to eq("ユーザーが見つかりません")
    end
  end

  describe "GET /api/v1/users/:id/bugs" do
    it "公開されているバグ一覧を返す" do
      get bugs_api_v1_user_path(user)

      expect(response).to have_http_status(:ok)
      expect(response_json["bugs"].length).to eq(1)
      expect(response_json["bugs"].first["id"]).to eq(published_bug.id)
      expect(response_json["bugs"].first["status"]).to eq("published")
    end

    it "下書き状態のバグは返さない" do
      get bugs_api_v1_user_path(user)

      expect(response).to have_http_status(:ok)
      expect(response_json["bugs"].length).to eq(1)
      expect(response_json["bugs"]).not_to be_any {|bug| bug["status"] == "draft" }
    end

    it "公開されているバグがない場合は空のリストを返す" do
      get bugs_api_v1_user_path(other_user)

      expect(response).to have_http_status(:ok)
      expect(response_json["bugs"].length).to eq(0)
    end

    it "ページネーションのメタデータを返す" do
      get bugs_api_v1_user_path(user)

      expect(response).to have_http_status(:ok)
      expect(response_json["meta"]["total_count"]).to eq(1)
      expect(response_json["meta"]["total_pages"]).to eq(1)
      expect(response_json["meta"]["current_page"]).to eq(1)
    end
  end

  describe "GET /api/v1/users/:id/followers" do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:third_user) { create(:user) }

    before do
      other_user.follow(user)
      third_user.follow(user)
      user.follow(third_user)
    end

    it "ユーザーのフォロワー一覧を返す" do
      get followers_api_v1_user_path(user)
      expect(response).to have_http_status(:ok)

      expect(response_json).to be_an(Array)
      expect(response_json.size).to eq(2)
      expect(response_json[0]["id"]).to eq(third_user.id)
      expect(response_json[1]["id"]).to eq(other_user.id)
    end

    it "存在しないユーザーのフォロワー一覧を返そうとすると404を返す" do
      get "/api/v1/users/0/followers"
      expect(response).to have_http_status(:not_found)

      expect(response_json["error"]).to eq("ユーザーが見つかりません")
    end
  end

  describe "GET /api/v1/users/:id/following" do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:third_user) { create(:user) }

    before do
      other_user.follow(user)
      third_user.follow(user)
      user.follow(third_user)
    end

    it "ユーザーのフォロー一覧を返す" do
      get following_api_v1_user_path(user)
      expect(response).to have_http_status(:ok)

      expect(response_json).to be_an(Array)
      expect(response_json.size).to eq(1)
      expect(response_json[0]["id"]).to eq(third_user.id)
    end

    it "存在しないユーザーのフォロー一覧を返そうとすると404を返す" do
      get "/api/v1/users/0/following"
      expect(response).to have_http_status(:not_found)

      expect(response_json["error"]).to eq("ユーザーが見つかりません")
    end
  end
end
