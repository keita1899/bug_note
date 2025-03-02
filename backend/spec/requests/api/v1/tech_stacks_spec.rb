require "rails_helper"

RSpec.describe "Api::V1::TechStack", type: :request do
  describe "GET /api/v1/tech_stack/operation_systems" do
    let!(:items) { create_list(:operation_system, 3) }

    it "OS のリストを返す" do
      get "/api/v1/tech_stack/operation_systems"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/operation_systems/:id" do
    let!(:item) { create(:operation_system) }

    it "特定の OS を返す" do
      get "/api/v1/tech_stack/operation_systems/#{item.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(item.id)
      expect(json["name"]).to eq(item.name)
    end
  end

  describe "GET /api/v1/tech_stack/programming_languages" do
    let!(:items) { create_list(:programming_language, 3) }

    it "プログラミング言語のリストを返す" do
      get "/api/v1/tech_stack/programming_languages"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/programming_languages/:id" do
    let!(:item) { create(:programming_language) }

    it "特定のプログラミング言語を返す" do
      get "/api/v1/tech_stack/programming_languages/#{item.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(item.id)
      expect(json["name"]).to eq(item.name)
    end
  end

  describe "GET /api/v1/tech_stack/frameworks" do
    let!(:items) { create_list(:framework, 3) }

    it "フレームワークのリストを返す" do
      get "/api/v1/tech_stack/frameworks"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/frameworks/:id" do
    let!(:item) { create(:framework) }

    it "特定のフレームワークを返す" do
      get "/api/v1/tech_stack/frameworks/#{item.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(item.id)
      expect(json["name"]).to eq(item.name)
    end
  end

  describe "GET /api/v1/tech_stack/databases" do
    let!(:items) { create_list(:database, 3) }

    it "データベースのリストを返す" do
      get "/api/v1/tech_stack/databases"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/databases/:id" do
    let!(:item) { create(:database) }

    it "特定のデータベースを返す" do
      get "/api/v1/tech_stack/databases/#{item.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(item.id)
      expect(json["name"]).to eq(item.name)
    end
  end

  describe "GET /api/v1/tech_stack/platforms" do
    let!(:items) { create_list(:platform, 3) }

    it "プラットフォームのリストを返す" do
      get "/api/v1/tech_stack/platforms"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/tools" do
    let!(:items) { create_list(:tool, 3) }

    it "ツールのリストを返す" do
      get "/api/v1/tech_stack/tools"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/editors" do
    let!(:items) { create_list(:editor, 3) }

    it "エディターのリストを返す" do
      get "/api/v1/tech_stack/editors"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/editors/:id" do
    let!(:item) { create(:editor) }

    it "特定のエディターを返す" do
      get "/api/v1/tech_stack/editors/#{item.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(item.id)
      expect(json["name"]).to eq(item.name)
    end
  end

  describe "GET /api/v1/tech_stack/browsers" do
    let!(:items) { create_list(:browser, 3) }

    it "ブラウザのリストを返す" do
      get "/api/v1/tech_stack/browsers"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/browsers/:id" do
    let!(:item) { create(:browser) }

    it "特定のブラウザを返す" do
      get "/api/v1/tech_stack/browsers/#{item.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(item.id)
      expect(json["name"]).to eq(item.name)
    end
  end

  describe "GET /api/v1/tech_stack/virtual_machines" do
    let!(:items) { create_list(:virtual_machine, 3) }

    it "仮想マシンのリストを返す" do
      get "/api/v1/tech_stack/virtual_machines"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/virtual_machines/:id" do
    let!(:item) { create(:virtual_machine) }

    it "特定の仮想マシンを返す" do
      get "/api/v1/tech_stack/virtual_machines/#{item.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(item.id)
      expect(json["name"]).to eq(item.name)
    end
  end

  describe "GET /api/v1/tech_stack/middlewares" do
    let!(:items) { create_list(:middleware, 3) }

    it "ミドルウェアのリストを返す" do
      get "/api/v1/tech_stack/middlewares"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json.size).to eq(3)
      expect(json.first.keys).to contain_exactly("id", "name")
    end
  end

  describe "GET /api/v1/tech_stack/middlewares/:id" do
    let!(:item) { create(:middleware) }

    it "特定のミドルウェアを返す" do
      get "/api/v1/tech_stack/middlewares/#{item.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(item.id)
      expect(json["name"]).to eq(item.name)
    end
  end
end
