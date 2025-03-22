class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :authenticate_api_v1_user!, only: [:destroy]

  def destroy
    if current_api_v1_user.valid_password?(params[:password])
      current_api_v1_user.destroy!
      render json: { message: "アカウントが削除されました" }, status: :ok
    else
      render json: { error: "パスワードが正しくありません" }, status: :unprocessable_entity
    end
  end
end
