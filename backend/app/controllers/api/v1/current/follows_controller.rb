class Api::V1::Current::FollowsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :prevent_duplicate_follow, only: [:create]

  def create
    user = find_user
    if user == current_user
      return render json: { message: "自分をフォローすることはできません" }, status: :unprocessable_entity
    end

    current_user.follow(user)
    render json: { message: "フォローしました" }, status: :ok
  end

  def destroy
    user = find_user
    current_user.unfollow(user)
    render json: { message: "フォローを解除しました" }, status: :ok
  end

  private

    def find_user
      User.find(params[:id])
    end

    def prevent_duplicate_follow
      user = find_user
      if current_user.following?(user)
        render json: { message: "既にフォローしています" }, status: :unprocessable_entity
      end
    end
end
