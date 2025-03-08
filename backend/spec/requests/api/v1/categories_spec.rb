require "rails_helper"

RSpec.describe "Api::V1::Category", type: :request do
  describe "GET /api/v1/categories" do
    let!(:categories) { create_list(:category, 3) }

    it "カテゴリーのリストを返す" do
      get "/api/v1/categories"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end
end
