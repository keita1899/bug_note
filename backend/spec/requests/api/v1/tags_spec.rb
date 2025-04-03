require "rails_helper"

RSpec.describe "Api::V1::Tags", type: :request do
  describe "GET /api/v1/tags" do
    let!(:tags) { create_list(:tag, 3) }

    it "タグのリストを返す" do
      get "/api/v1/tags"
      expect(response).to have_http_status(:ok)
      expect(response_json.size).to eq(3)
      expect(response_json.first.keys).to contain_exactly("id", "name")
    end
  end
end
