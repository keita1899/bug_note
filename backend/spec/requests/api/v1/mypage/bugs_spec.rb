require "rails_helper"

RSpec.describe "Api::V1::Mypage::Bugs", type: :request do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "GET /mypage/bugs" do
    let!(:bugs) { create_list(:bug, 5, user: user) }

    context "ログインしている場合" do
      it "認証ユーザーのバグ一覧を取得できる" do
        get api_v1_mypage_bugs_path, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["bugs"].size).to eq(5)
      end
    end

    context "ログインしていない場合" do
      it "認証エラーが発生すること" do
        get api_v1_mypage_bugs_path

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /mypage/bugs/solved" do
    let!(:solved_bug) { create(:bug, user: user, is_solved: true) }
    let!(:unsolved_bug) { create(:bug, user: user, is_solved: false) }

    context "ログインしている場合" do
      it "解決済みのバグのみを取得できる" do
        get solved_api_v1_mypage_bugs_path, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["bugs"].size).to eq(1)
        expect(response_json["bugs"].first["is_solved"]).to be(true)
      end
    end

    context "ログインしていない場合" do
      it "認証エラーが発生すること" do
        get solved_api_v1_mypage_bugs_path

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /mypage/bugs/unsolved" do
    let!(:solved_bug) { create(:bug, user: user, is_solved: true) }
    let!(:unsolved_bug) { create(:bug, user: user, is_solved: false) }

    context "ログインしている場合" do
      it "未解決のバグのみを取得できる" do
        get unsolved_api_v1_mypage_bugs_path, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["bugs"].size).to eq(1)
        expect(response_json["bugs"].first["is_solved"]).to be(false)
      end
    end

    context "ログインしていない場合" do
      it "認証エラーが発生すること" do
        get unsolved_api_v1_mypage_bugs_path

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /mypage/bugs/published" do
    let!(:published_bug) { create(:bug, user: user, status: "published") }
    let!(:draft_bug) { create(:bug, user: user, status: "draft") }

    context "ログインしている場合" do
      it "公開済みのバグのみを取得できる" do
        get published_api_v1_mypage_bugs_path, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["bugs"].size).to eq(1)
        expect(response_json["bugs"].first["status"]).to eq("published")
      end
    end

    context "ログインしていない場合" do
      it "認証エラーが発生すること" do
        get published_api_v1_mypage_bugs_path

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /mypage/bugs/draft" do
    let!(:published_bug) { create(:bug, user: user, status: "published") }
    let!(:draft_bug) { create(:bug, user: user, status: "draft") }

    context "ログインしている場合" do
      it "下書きのバグのみを取得できる" do
        get draft_api_v1_mypage_bugs_path, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["bugs"].size).to eq(1)
        expect(response_json["bugs"].first["status"]).to eq("draft")
      end
    end

    context "ログインしていない場合" do
      it "認証エラーが発生すること" do
        get draft_api_v1_mypage_bugs_path

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /mypage/bugs/likes" do
    let!(:other_user) { create(:user) }
    let!(:liked_bug) { create(:bug, user: other_user, status: "published") }
    let!(:like) { create(:like, user: user, bug: liked_bug) }

    context "ログインしている場合" do
      it "いいねしたバグを取得できる" do
        get liked_api_v1_mypage_bugs_path, headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["bugs"].size).to eq(1)
        expect(response_json["bugs"].first["id"]).to eq(liked_bug.id)
      end
    end

    context "ログインしていない場合" do
      it "認証エラーが発生すること" do
        get liked_api_v1_mypage_bugs_path

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
