require "rails_helper"

RSpec.describe "Api::V1::Bug", type: :request do
  let!(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "GET /api/v1/bugs" do
    let!(:bugs) { create_list(:bug, 25, user: user, status: "published") }
    let!(:draft_bug) { create(:bug, user: user) }

    context "ログインしている場合" do
      before do
        get "/api/v1/bugs", headers: headers, params: { page: page }
      end

      context "1ページ目" do
        let(:page) { 1 }

        it "ステータスコード200が返る" do
          expect(response).to have_http_status(:ok)
        end

        it "公開されているバグのリストが返る" do
          json = JSON.parse(response.body)
          expect(json["bugs"].size).to eq(10)
          expect(json["bugs"].pluck("id")).to eq(bugs.sort_by(&:created_at).reverse.first(10).pluck(:id))
        end

        it "未公開のバグは含まれない" do
          json = JSON.parse(response.body)
          expect(json["bugs"].pluck("id")).not_to include(draft_bug.id.to_s)
        end

        it "レスポンスにページネーションのメタデータが含まれる" do
          json = JSON.parse(response.body)
          expect(json["meta"]["total_pages"]).to eq(3)
          expect(json["meta"]["current_page"]).to eq(1)
        end
      end

      context "2ページ目" do
        let(:page) { 2 }

        it "ステータスコード200が返る" do
          expect(response).to have_http_status(:ok)
        end

        it "公開されているバグのリストが返る" do
          json = JSON.parse(response.body)
          expect(json["bugs"].size).to eq(10)
          expect(json["bugs"].pluck("id")).to eq(bugs.sort_by(&:created_at).reverse[10..19].pluck(:id))
        end

        it "未公開のバグは含まれない" do
          json = JSON.parse(response.body)
          expect(json["bugs"].pluck("id")).not_to include(draft_bug.id.to_s)
        end

        it "レスポンスにページネーションのメタデータが含まれる" do
          json = JSON.parse(response.body)
          expect(json["meta"]["total_pages"]).to eq(3)
          expect(json["meta"]["current_page"]).to eq(2)
        end
      end

      context "3ページ目" do
        let(:page) { 3 }

        it "ステータスコード200が返る" do
          expect(response).to have_http_status(:ok)
        end

        it "公開されているバグのリストが返る" do
          json = JSON.parse(response.body)
          expect(json["bugs"].size).to eq(5)
          expect(json["bugs"].pluck("id")).to eq(bugs.sort_by(&:created_at).reverse[20..24].pluck(:id))
        end

        it "未公開のバグは含まれない" do
          json = JSON.parse(response.body)
          expect(json["bugs"].pluck("id")).not_to include(draft_bug.id.to_s)
        end

        it "レスポンスにページネーションのメタデータが含まれる" do
          json = JSON.parse(response.body)
          expect(json["meta"]["total_pages"]).to eq(3)
          expect(json["meta"]["current_page"]).to eq(3)
        end
      end
    end

    context "ログインしていない場合" do
      before do
        get "/api/v1/bugs"
      end

      it "ステータスコード200が返る" do
        expect(response).to have_http_status(:ok)
      end

      it "公開されているバグのリストが返る" do
        json = JSON.parse(response.body)
        expect(json["bugs"].size).to eq(10)
        expect(json["bugs"].pluck("id")).to eq(bugs.sort_by(&:created_at).reverse.first(10).pluck(:id))
      end

      it "未公開のバグは含まれない" do
        json = JSON.parse(response.body)
        expect(json["bugs"].pluck("id")).not_to include(draft_bug.id.to_s)
      end

      it "レスポンスにページネーションのメタデータが含まれる" do
        json = JSON.parse(response.body)
        expect(json["meta"]["total_pages"]).to eq(3)
        expect(json["meta"]["current_page"]).to eq(1)
      end
    end
  end

  describe "GET /api/v1/bugs/:id" do
    let(:other_user) { create(:user) }
    let(:published_bug) { create(:bug, :published, user: other_user) }
    let(:draft_bug) { create(:bug, user: other_user) }
    let(:own_draft_bug) { create(:bug, user: user) }
    let(:own_solved_draft_bug) { create(:bug, :solved_draft, user: user) }
    let(:own_published_bug) { create(:bug, :published, user: user) }

    context "ログインしている場合" do
      it "自分の下書きの未解決バグの詳細データが返る" do
        get "/api/v1/bugs/#{own_draft_bug.id}", headers: headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["id"]).to eq(own_draft_bug.id)
        expect(JSON.parse(response.body)["is_solved"]).to be(false)
        expect(JSON.parse(response.body)["status"]).to eq("draft")
      end

      it "自分の下書きの解決済バグの詳細データが返る" do
        get "/api/v1/bugs/#{own_solved_draft_bug.id}", headers: headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["id"]).to eq(own_solved_draft_bug.id)
        expect(JSON.parse(response.body)["is_solved"]).to be(true)
        expect(JSON.parse(response.body)["status"]).to eq("draft")
      end

      it "自分の公開中の解決済バグの詳細データが返る" do
        get "/api/v1/bugs/#{own_published_bug.id}", headers: headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["id"]).to eq(own_published_bug.id)
        expect(JSON.parse(response.body)["is_solved"]).to be(true)
        expect(JSON.parse(response.body)["status"]).to eq("published")
      end

      it "他人の下書きのバグの詳細データが返されない" do
        get "/api/v1/bugs/#{draft_bug.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end

      it "他人の公開バグの詳細データが返る" do
        get "/api/v1/bugs/#{published_bug.id}", headers: headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["id"]).to eq(published_bug.id)
        expect(JSON.parse(response.body)["status"]).to eq("published")
      end
    end

    context "ログインしていない場合" do
      it "自分の下書きのバグの詳細データが返されない" do
        get "/api/v1/bugs/#{own_draft_bug.id}"
        expect(response).to have_http_status(:not_found)
      end

      it "自分の公開中の解決済バグの詳細データが返る" do
        get "/api/v1/bugs/#{own_published_bug.id}"
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["id"]).to eq(own_published_bug.id)
        expect(JSON.parse(response.body)["status"]).to eq("published")
      end

      it "他人の下書きのバグの詳細データが返されない" do
        get "/api/v1/bugs/#{draft_bug.id}"
        expect(response).to have_http_status(:not_found)
      end

      it "他人の公開バグの詳細データが返る" do
        get "/api/v1/bugs/#{published_bug.id}"
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["id"]).to eq(published_bug.id)
        expect(JSON.parse(response.body)["status"]).to eq("published")
      end
    end

    it "idが不適切だと 404 エラーが返る" do
      get "/api/v1/bugs/invalid_id"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/bugs" do
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
        expect(JSON.parse(response.body)["message"]).to eq("バグを保存しました")
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
