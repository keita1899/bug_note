class Api::V1::Mypage::NotificationsController < Api::V1::BaseController
  include Pagination

  before_action :authenticate_user!

  def index
    notifications = current_user.notifications.
                      includes(:notifiable, :actor, notifiable: { comment: [:user] }).
                      filter_by_tab(params[:tab]).
                      recent.
                      page(params[:page]).per(10)

    render json: notifications, each_serializer: NotificationSerializer, status: :ok, meta: pagination(notifications), adapter: :json
  end

  def header
    notifications = current_user.notifications.
                      includes(:notifiable, :actor, notifiable: { comment: [:user] }).
                      recent.
                      limit(5)
    render json: notifications, each_serializer: NotificationSerializer, status: :ok
  end

  def update
    notification = current_user.notifications.find(params[:id])

    if notification.update(read: true)
      head :no_content
    else
      render json: { errors: notification.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    notification = current_user.notifications.find(params[:id])

    if notification.destroy
      head :no_content
    else
      render json: { errors: notification.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
