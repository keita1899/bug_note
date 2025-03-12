class BugForm
  include ActiveModel::Model
  include ActiveModel::Validations
  include BugFormValidations

  attr_accessor :title, :error_message, :content, :expected_behavior, :solution, :cause, :etc, :is_solved, :status, :environments, :attempts, :references,
                :user, :bug

  def initialize(bug_params, user, bug = nil)
    @user = user
    @bug = bug
    @title = bug_params[:title]
    @error_message = bug_params[:error_message]
    @content = bug_params[:content]
    @expected_behavior = bug_params[:expected_behavior]
    @solution = bug_params[:solution]
    @cause = bug_params[:cause]
    @etc = bug_params[:etc]
    @is_solved = bug_params[:is_solved]
    @status = bug_params[:status]
    @environments = bug_params[:environments] || []
    @attempts = bug_params[:attempts] || []
    @references = bug_params[:references] || []
  end

  def save
    return false unless valid?

    ActiveRecord::Base.transaction do
      @bug ? update_bug : create_bug
      update_environments(@bug)
      update_attempts(@bug)
      update_references(@bug)
      @bug
    end
  rescue ActiveRecord::RecordInvalid
    false
  end

  private

    def update_bug
      @bug.update!(
        title: @title, error_message: @error_message, content: @content,
        expected_behavior: @expected_behavior, solution: @solution,
        cause: @cause, etc: @etc, is_solved: @is_solved, status: @status
      )
    end

    def create_bug
      @bug = @user.bugs.create!(
        title: @title, error_message: @error_message, content: @content,
        expected_behavior: @expected_behavior, solution: @solution,
        cause: @cause, etc: @etc, is_solved: @is_solved, status: @status
      )
    end

    def update_environments(bug)
      bug.environments.delete_all
      environments_data = @environments.map do |env|
        { category: env[:category], name: env[:name], version: env[:version], bug_id: bug.id }
      end

      bug.environments.import(environments_data, on_duplicate_key_ignore: true) if environments_data.present?
    end

    def update_attempts(bug)
      bug.attempts.delete_all
      attempts_data = @attempts.map do |attempt|
        { content: attempt[:content], bug_id: bug.id }
      end

      bug.attempts.import(attempts_data, on_duplicate_key_ignore: true) if attempts_data.present?
    end

    def update_references(bug)
      bug.references.delete_all
      references_data = @references.map do |reference|
        { url: reference[:url], bug_id: bug.id }
      end

      bug.references.import(references_data, on_duplicate_key_ignore: true) if references_data.present?
    end
end
