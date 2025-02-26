class Api::V1::User::ConfirmationsController < Api::V1::BaseController
  def update
    user = User.find_by(confirmation_token: params[:confirmation_token])
    return render json: { message: "ユーザーが見つかりません。" }, status: :not_found if user.nil?
    return render json: { message: "アカウントはすでに有効化されています。" }, status: :bad_request if user.confirmed?

    user.update!(confirmed_at: Time.current)

    render json: { message: "アカウントが有効化されました。" }, status: :ok
  end
end
