class Api::V1::UsersController < Api::V1::BaseController
  include Pagination

  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  def show
    user = User.find(params[:id])
    render json: user, serializer: UserSerializer, status: :ok
  end

  def bugs
    user = User.find(params[:id])
    bugs = user.bugs.where(status: "published").order(created_at: :desc).page(params[:page] || 1).per(10)
    render json: bugs, each_serializer: BugSerializer, status: :ok, meta: pagination(bugs), adapter: :json
  end

  private

    def not_found
      render json: { error: "ユーザーが見つかりません" }, status: :not_found
    end
end
