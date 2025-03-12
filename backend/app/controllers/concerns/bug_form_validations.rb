module BugFormValidations
  extend ActiveSupport::Concern

  included do
    validates :title, presence: true, length: { maximum: 255 }
    validates :content, presence: true
    validate :solution_required_if_solved
    validate :status_published_if_unsolved
    validate :valid_references_urls
    validate :valid_environments_name_and_version
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
