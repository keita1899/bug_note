class Api::V1::UsersController < Api::V1::BaseController
  include Pagination

  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  def show
    user = find_user
    render json: user, serializer: UserDetailSerializer, status: :ok
  end

  def bugs
    user = find_user
    bugs = user.bugs.published.newest.includes(:tags).page(params[:page] || 1).per(10)
    render json: bugs, each_serializer: BugListSerializer, status: :ok, meta: pagination(bugs), adapter: :json
  end

  def followers
    user = find_user
    followers = user.followers.order(created_at: :desc)
    render json: followers, each_serializer: FollowUserSerializer, status: :ok
  end

  def following
    user = find_user
    following = user.following.order(created_at: :desc)
    render json: following, each_serializer: FollowUserSerializer, status: :ok
  end

  private

    def find_user
      User.find(params[:id])
    end

    def not_found
      render json: { error: "ユーザーが見つかりません" }, status: :not_found
    end
end
