class Api::V1::BugsController < Api::V1::BaseController
  before_action :authenticate_user!

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
