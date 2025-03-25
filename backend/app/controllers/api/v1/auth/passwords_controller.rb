class Api::V1::Auth::PasswordsController < DeviseTokenAuth::PasswordsController
  before_action :authenticate_api_v1_user!, only: [:update]

  def update
    user = current_api_v1_user

    unless user.valid_password?(password_update_params[:current_password])
      return render json: { errors: ["現在のパスワードが間違っています"] }, status: :unprocessable_entity
    end

    if password_update_params[:current_password] == password_update_params[:password]
      return render json: { errors: ["新しいパスワードは現在のパスワードと異なっている必要があります"] }, status: :unprocessable_entity
    end

    if user.update(password_update_params.except(:current_password))
      render json: { message: "パスワードが変更されました" }, status: :ok
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

    def password_update_params
      params.permit(:current_password, :password, :password_confirmation)
    end
end
