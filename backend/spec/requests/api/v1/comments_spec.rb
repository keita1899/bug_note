require "rails_helper"

RSpec.describe "Api::V1::Comments", type: :request do
  let(:user) { create(:user) }
  let(:headers) { user.create_new_auth_token }
  let(:bug) { create(:bug) }

  describe "POST /api/v1/bugs/:bug_id/comments" do
    let(:valid_params) { { comment: { content: "コメント" } } }
    let(:invalid_params) { { comment: { content: "" } } }

    context "ログインしている場合" do
      it "新しいコメントを作成する" do
        expect {
          post api_v1_bug_comments_path(bug), params: valid_params, headers: headers
        }.to change { bug.comments.count }.by(1)

        expect(response).to have_http_status(:created)
        expect(response.body).to include("コメントしました")
      end

      it "コメント内容が無効な場合、エラーを返す" do
        post api_v1_bug_comments_path(bug), params: invalid_params, headers: headers

        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.body).to include("Contentを入力してください")
      end
    end

    context "ログインしていない場合" do
      it "401 エラーを返す" do
        post api_v1_bug_comments_path(bug), params: valid_params

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/v1/bugs/:bug_id/comments/:id" do
    let!(:comment) { create(:comment, bug: bug, user: user) }

    context "ログインしている場合" do
      it "自分のコメントを削除できる" do
        expect {
          delete api_v1_bug_comment_path(bug, comment), headers: headers
        }.to change { bug.comments.count }.by(-1)

        expect(response).to have_http_status(:ok)
        expect(response.body).to include("コメントを削除しました")
      end
    end

    context "ログインしているが、他人のコメントを削除しようとした場合" do
      let(:other_user) { create(:user) }
      let(:other_headers) { other_user.create_new_auth_token }

      it "403 エラーを返す" do
        delete api_v1_bug_comment_path(bug, comment), headers: other_headers

        expect(response).to have_http_status(:forbidden)
        expect(response.body).to include("自分のコメントのみ削除できます")
      end
    end

    context "ログインしていない場合" do
      it "401 エラーを返す" do
        delete api_v1_bug_comment_path(bug, comment)

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
