class Api::V1::BugsController < Api::V1::BaseController
  include Pagination

  before_action :authenticate_user!, only: [:create, :update, :destroy]

  def index
    bugs = Bug.where(status: "published").includes(:user).order(created_at: :desc).page(params[:page] || 1).per(10)
    render json: bugs, each_serializer: BugSerializer, status: :ok, meta: pagination(bugs), adapter: :json
  end

  def show
    bug = if user_signed_in?
            Bug.includes(:user, :environments, :attempts, :references, comments: :user).
              where(id: params[:id]).
              where("user_id = ? OR (user_id != ? AND status = ?)", current_user.id, current_user.id, "published").
              first
          else
            Bug.includes(:user, :environments, :attempts, :references, comments: :user).
              where(id: params[:id]).
              where(status: "published").
              first
          end

    if bug
      render json: bug, serializer: BugSerializer
    else
      render json: { error: "Bug not found" }, status: :not_found
    end
  end

  def create
    form = BugForm.new(bug_params, current_user)

    if form.save
      render json: { message: "バグを保存しました" }, status: :created
    else
      render json: { errors: form.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    bug = Bug.find_by(id: params[:id], user_id: current_user.id)

    if bug.nil?
      render json: { message: "バグが見つかりません" }, status: :not_found
      return
    end

    form = BugForm.new(bug_params, current_user, bug)

    if form.save
      render json: { message: "バグを更新しました" }, status: :ok
    else
      render json: { errors: form.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    bug = Bug.find_by(id: params[:id], user_id: current_user.id)

    if bug.nil?
      render json: { message: "バグが見つかりません" }, status: :not_found
      return
    end

    if bug.destroy
      render json: { message: "バグを削除しました" }, status: :ok
    else
      render json: { message: "バグの削除に失敗しました" }, status: :unprocessable_entity
    end
  end

  private

    def bug_params
      params.permit(
        :title, :error_message, :content, :expected_behavior, :solution, :cause, :etc, :is_solved, :status,
        environments: [:category, :name, :version],
        attempts: [:content],
        references: [:url]
      )
    end
end
