require "rails_helper"

RSpec.describe "Api::V1::Bug", type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:headers) { user.create_new_auth_token }

  describe "GET /api/v1/bugs" do
    let!(:bugs) { create_list(:bug, 25, user: user, status: "published") }
    let(:draft_bug) { create(:bug, user: user) }
    let!(:tags) { create_list(:tag, 3) }

    context "ログインしている場合" do
      before do
        bugs.each do |bug|
          tags.each do |tag|
            create(:bug_tag, bug: bug, tag: tag)
          end
        end
        get "/api/v1/bugs", headers: headers, params: { page: page }
      end

      context "1ページ目" do
        let(:page) { 1 }

        it "ステータスコード200が返る" do
          expect(response).to have_http_status(:ok)
        end

        it "公開されているバグのリストが返る" do
          expect(response_json["bugs"].size).to eq(10)
          expect(response_json["bugs"].pluck("id")).to eq(bugs.sort_by(&:created_at).reverse.first(10).pluck(:id))
        end

        it "下書きのバグは含まれない" do
          expect(response_json["bugs"].pluck("id")).not_to include(draft_bug.id.to_s)
        end

        it "レスポンスにページネーションのメタデータが含まれる" do
          expect(response_json["meta"]["total_pages"]).to eq(3)
          expect(response_json["meta"]["current_page"]).to eq(1)
        end

        it "各バグにタグ情報が含まれている" do
          response_json["bugs"].each do |bug|
            expect(bug["tags"]).to be_present
            expect(bug["tags"].size).to eq(3)
          end
        end
      end

      context "2ページ目" do
        let(:page) { 2 }

        it "ステータスコード200が返る" do
          expect(response).to have_http_status(:ok)
        end

        it "公開されているバグのリストが返る" do
          expect(response_json["bugs"].size).to eq(10)
          expect(response_json["bugs"].pluck("id")).to eq(bugs.sort_by(&:created_at).reverse[10..19].pluck(:id))
        end

        it "下書きのバグは含まれない" do
          expect(response_json["bugs"].pluck("id")).not_to include(draft_bug.id.to_s)
        end

        it "レスポンスにページネーションのメタデータが含まれる" do
          expect(response_json["meta"]["total_pages"]).to eq(3)
          expect(response_json["meta"]["current_page"]).to eq(2)
        end
      end

      context "3ページ目" do
        let(:page) { 3 }

        it "ステータスコード200が返る" do
          expect(response).to have_http_status(:ok)
        end

        it "公開されているバグのリストが返る" do
          expect(response_json["bugs"].size).to eq(5)
          expect(response_json["bugs"].pluck("id")).to eq(bugs.sort_by(&:created_at).reverse[20..24].pluck(:id))
        end

        it "下書きのバグは含まれない" do
          expect(response_json["bugs"].pluck("id")).not_to include(draft_bug.id.to_s)
        end

        it "レスポンスにページネーションのメタデータが含まれる" do
          expect(response_json["meta"]["total_pages"]).to eq(3)
          expect(response_json["meta"]["current_page"]).to eq(3)
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
        expect(response_json["bugs"].size).to eq(10)
        expect(response_json["bugs"].pluck("id")).to eq(bugs.sort_by(&:created_at).reverse.first(10).pluck(:id))
      end

      it "下書きのバグは含まれない" do
        expect(response_json["bugs"].pluck("id")).not_to include(draft_bug.id.to_s)
      end

      it "レスポンスにページネーションのメタデータが含まれる" do
        expect(response_json["meta"]["total_pages"]).to eq(3)
        expect(response_json["meta"]["current_page"]).to eq(1)
      end
    end
  end

  describe "GET /api/v1/bugs/:id" do
    let(:other_published_bug) { create(:bug, :published, user: other_user) }
    let(:other_draft_bug) { create(:bug, user: other_user) }
    let(:draft_bug) { create(:bug, user: user) }
    let(:solved_draft_bug) { create(:bug, :solved_draft, user: user) }
    let(:published_bug) { create(:bug, :published, user: user) }
    let!(:tags) { create_list(:tag, 3) }

    context "ログインしている場合" do
      before do
        published_bug.bug_tags.destroy_all
        tags.each do |tag|
          create(:bug_tag, bug: published_bug, tag: tag)
        end
      end

      it "自分の下書きの未解決バグの詳細データが返る" do
        get "/api/v1/bugs/#{draft_bug.id}", headers: headers
        expect(response).to have_http_status(:ok)
        expect(response_json["id"]).to eq(draft_bug.id)
        expect(response_json["is_solved"]).to be(false)
        expect(response_json["status"]).to eq("draft")
      end

      it "自分の下書きの解決済バグの詳細データが返る" do
        get "/api/v1/bugs/#{solved_draft_bug.id}", headers: headers
        expect(response).to have_http_status(:ok)
        expect(response_json["id"]).to eq(solved_draft_bug.id)
        expect(response_json["is_solved"]).to be(true)
        expect(response_json["status"]).to eq("draft")
      end

      it "自分の公開中の解決済バグの詳細データとタグが返る" do
        get "/api/v1/bugs/#{published_bug.id}", headers: headers
        expect(response).to have_http_status(:ok)
        expect(response_json["id"]).to eq(published_bug.id)
        expect(response_json["is_solved"]).to be(true)
        expect(response_json["status"]).to eq("published")
        expect(response_json["tags"].size).to eq(3)
      end

      it "自分の公開中の解決済バグの詳細データが返り、コメント一覧も含まれる" do
        comment1 = create(:comment, bug: published_bug, user: user)
        comment2 = create(:comment, bug: published_bug, user: other_user)

        get "/api/v1/bugs/#{published_bug.id}", headers: headers

        expect(response).to have_http_status(:ok)
        expect(response_json["id"]).to eq(published_bug.id)
        expect(response_json["status"]).to eq("published")
        expect(response_json["comments"].size).to eq(2)
        expect(response_json["comments"].map {|c| c["id"] }).to contain_exactly(comment1.id, comment2.id)
      end

      it "他人の下書きのバグの詳細データが返されない" do
        get "/api/v1/bugs/#{other_draft_bug.id}", headers: headers
        expect(response).to have_http_status(:not_found)
      end

      it "他人の公開バグの詳細データが返る" do
        get "/api/v1/bugs/#{other_published_bug.id}", headers: headers
        expect(response).to have_http_status(:ok)
        expect(response_json["id"]).to eq(other_published_bug.id)
        expect(response_json["status"]).to eq("published")
      end
    end

    context "ログインしていない場合" do
      it "自分の下書きのバグの詳細データが返されない" do
        get "/api/v1/bugs/#{draft_bug.id}"
        expect(response).to have_http_status(:not_found)
      end

      it "自分の公開中の解決済バグの詳細データが返る" do
        get "/api/v1/bugs/#{published_bug.id}"
        expect(response).to have_http_status(:ok)
        expect(response_json["id"]).to eq(published_bug.id)
        expect(response_json["status"]).to eq("published")
      end

      it "他人の下書きのバグの詳細データが返されない" do
        get "/api/v1/bugs/#{other_draft_bug.id}"
        expect(response).to have_http_status(:not_found)
      end

      it "他人の公開バグの詳細データが返る" do
        get "/api/v1/bugs/#{other_published_bug.id}"
        expect(response).to have_http_status(:ok)
        expect(response_json["id"]).to eq(other_published_bug.id)
        expect(response_json["status"]).to eq("published")
      end
    end

    it "idが不適切だと 404 エラーが返る" do
      get "/api/v1/bugs/invalid_id"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/bugs" do
    let!(:tags) { create_list(:tag, 3) }
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
        tags: tags.map(&:id),
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
        tags: [],
      }
    end

    context "ログインしている場合" do
      it "正しい値が入力された場合、バグの登録が成功する" do
        expect {
          post "/api/v1/bugs", params: valid_params, headers: headers, as: :response_json
        }.to change { Bug.count }.by(1).
               and change { BugTag.count }.by(3)

        expect(response).to have_http_status(:created)
        expect(response_json["message"]).to eq("バグを保存しました")

        bug = Bug.last
        expect(bug.tags.count).to eq(3)
        expect(bug.tags.pluck(:id)).to match_array(tags.map(&:id))
      end

      it "タグなしでバグを登録できる" do
        params_without_tags = valid_params.except(:tags)
        expect {
          post "/api/v1/bugs", params: params_without_tags, headers: headers, as: :response_json
        }.to change { Bug.count }.by(1)

        bug = Bug.last
        expect(bug.bug_tags).to be_empty

        expect(response).to have_http_status(:created)
        expect(response_json["message"]).to eq("バグを保存しました")
      end

      it "間違った値が入力された場合、バグの登録が失敗し、422エラーを返す" do
        expect {
          post "/api/v1/bugs", params: invalid_params, headers: headers, as: :response_json
        }.not_to change { Bug.count }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(response_json["errors"].join).to include("を入力してください")
      end
    end

    context "ログインしていない場合" do
      it "401 エラーが返る" do
        post "/api/v1/bugs", params: valid_params, as: :response_json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "UPDATE /api/v1/bugs/:id" do
    let(:bug) { create(:bug, user: user) }
    let(:other_bug) { create(:bug, user: other_user) }
    let!(:tags) { create_list(:tag, 3) }

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
        tags: tags.map(&:id),
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
        tags: [],
      }
    end

    context "ログインしている場合" do
      context "バグが存在する場合" do
        it "正しい値を入力した場合バグの更新が成功する" do
          expect {
            patch "/api/v1/bugs/#{bug.id}", params: valid_params, headers: headers
          }.to change { BugTag.count }.by(3)

          expect(response).to have_http_status(:ok)
          expect(response_json["message"]).to eq("バグを更新しました")
          expect(bug.reload.tags.pluck(:id)).to match_array(tags.map(&:id))
        end

        it "間違った値を入力した場合バグの更新が失敗し、422 エラーを返す" do
          patch "/api/v1/bugs/#{bug.id}", params: invalid_params, headers: headers

          expect(response).to have_http_status(:unprocessable_entity)
        end

        it "タグを更新できる" do
          create(:bug_tag, bug: bug, tag: create(:tag))
          new_tags = [tags.first.id, tags.second.id]
          update_params = valid_params.merge(tags: new_tags)

          patch "/api/v1/bugs/#{bug.id}", params: update_params, headers: headers

          expect(response).to have_http_status(:ok)
          expect(bug.reload.tags.pluck(:id)).to match_array(new_tags)
        end

        it "タグを削除できる" do
          create(:bug_tag, bug: bug, tag: create(:tag))
          update_params = valid_params.merge(tags: [])

          patch "/api/v1/bugs/#{bug.id}", params: update_params, headers: headers

          expect(response).to have_http_status(:ok)
          expect(bug.reload.tags.count).to eq(0)
        end

        it "他人のバグは更新できない" do
          patch "/api/v1/bugs/#{other_bug.id}", params: valid_params, headers: headers

          expect(response).to have_http_status(:not_found)
          expect(response_json["message"]).to eq("バグが見つかりません")
          expect(Bug.find_by(id: other_bug.id)).to eq(other_bug)
        end
      end

      context "バグが存在しない場合" do
        it "バグが見つからないというエラーメッセージを返す" do
          patch "/api/v1/bugs/#{bug.id + 1}", headers: headers

          expect(response).to have_http_status(:not_found)
          expect(response_json["message"]).to eq("バグが見つかりません")
        end
      end
    end

    context "ログインしていない場合" do
      it "401 エラーが返る" do
        patch "/api/v1/bugs/#{bug.id}"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/bugs/:id" do
    let(:bug) { create(:bug, user: user) }
    let(:other_bug) { create(:bug, user: other_user) }

    context "ログインしている場合" do
      context "バグが存在する場合" do
        it "バグの削除が成功する" do
          delete "/api/v1/bugs/#{bug.id}", headers: headers

          expect(response).to have_http_status(:ok)
          expect(response_json["message"]).to eq("バグを削除しました")
          expect(Bug).not_to exist(bug.id)
        end

        it "他人のバグは削除できない" do
          delete "/api/v1/bugs/#{other_bug.id}", headers: headers

          expect(response).to have_http_status(:not_found)
          expect(response_json["message"]).to eq("バグが見つかりません")
          expect(Bug.find_by(id: other_bug.id)).to eq(other_bug)
        end
      end

      context "バグが存在しない場合" do
        it "バグが見つからないというエラーメッセージを返す" do
          delete "/api/v1/bugs/#{bug.id + 1}", headers: headers

          expect(response).to have_http_status(:not_found)
          expect(response_json["message"]).to eq("バグが見つかりません")
        end
      end
    end

    context "ログインしていない場合" do
      it "401 エラーが返る" do
        delete "/api/v1/bugs/#{bug.id}"

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
