class BugForm
  include ActiveModel::Model
  include ActiveModel::Validations

  attr_accessor :title, :error_message, :content, :expected_behavior, :solution, :cause, :etc, :is_solved, :status, :environments, :attempts, :references, :user

  validates :title, presence: true, length: { maximum: 255 }
  validates :content, presence: true
  validate :solution_required_if_solved
  validate :status_published_if_unsolved
  validate :valid_references_urls
  validate :valid_environments_name_and_version

  def initialize(bug_params, user)
    @user = user
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
      bug = @user.bugs.create!(
        title: @title, error_message: @error_message, content: @content,
        expected_behavior: @expected_behavior, solution: @solution,
        cause: @cause, etc: @etc, is_solved: @is_solved, status: @status
      )

      import_environments(bug)
      import_attempts(bug)
      import_references(bug)

      bug
    end
  rescue ActiveRecord::RecordInvalid
    false
  end

  private

    def solution_required_if_solved
      if is_solved && solution.blank?
        errors.add(:solution, "解決済にするには解決方法を入力する必要があります")
      end
    end

    def status_published_if_unsolved
      if !is_solved && status == "published"
        errors.add(:status, "未解決の場合公開できません")
      end
    end

    def import_environments(bug)
      environments_data = @environments.map do |env|
        { category: env[:category], name: env[:name], version: env[:version], bug_id: bug.id }
      end

      bug.environments.import(environments_data, on_duplicate_key_ignore: true) if environments_data.present?
    end

    def import_attempts(bug)
      attempts_data = @attempts.map do |attempt|
        { content: attempt[:content], bug_id: bug.id }
      end

      bug.attempts.import(attempts_data, on_duplicate_key_ignore: true) if attempts_data.present?
    end

    def import_references(bug)
      references_data = @references.map do |reference|
        { url: reference[:url], bug_id: bug.id }
      end

      bug.references.import(references_data, on_duplicate_key_ignore: true) if references_data.present?
    end

    def valid_references_urls
      @references.each_with_index do |reference, _index|
        url = reference[:url]
        next if url.blank?

        unless url.length <= 255
          errors.add(:'references.url', "参考リンクは255文字以内で入力してください")
        end
        unless url =~ %r{\Ahttps?://[\S]+\z}
          errors.add(:'references.url', "有効なURLを入力してください")
        end
      end
    end

    def valid_environments_name_and_version
      @environments.each do |env|
        if env[:name].present? && env[:name].length > 255
          errors.add(:'environments.name', "環境の名前は255文字以内で入力してください")
        end
        if env[:version].present? && env[:version].length > 255
          errors.add(:'environments.version', "環境のバージョンは255文字以内で入力してください")
        end
      end
    end
end
