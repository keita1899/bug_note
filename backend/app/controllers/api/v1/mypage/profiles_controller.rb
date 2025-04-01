class Api::V1::Mypage::ProfilesController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    render json: current_user, serializer: ProfileSerializer
  end

  def update
    current_user.profile_update = true
    if current_user.update(profile_params)
      render json: { message: "プロフィールを更新しました" }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

    def profile_params
      params.permit(:image, :name, :nickname, :bio, :github_url, :website_url)
    end
end
