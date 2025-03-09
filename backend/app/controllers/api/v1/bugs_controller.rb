class Api::V1::BugsController < Api::V1::BaseController
  include Pagination

  before_action :authenticate_user!, only: [:create]

  def index
    bugs = Bug.where(status: "published").includes(:user, :environments, :attempts, :references).order(created_at: :desc).page(params[:page] || 1).per(10)
    render json: bugs, each_serializer: BugSerializer, status: :ok, meta: pagination(bugs), adapter: :json
  end

  def create
    form = BugForm.new(bug_params, current_user)

    if form.save
      render json: { message: "バグを保存しました" }, status: :created
    else
      render json: { errors: form.errors.full_messages }, status: :unprocessable_entity
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
