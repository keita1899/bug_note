class Api::V1::CategoriesController < Api::V1::BaseController
  def index
    categories = Category.all
    render json: categories
  end
end
