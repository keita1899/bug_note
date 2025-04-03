class BaseBugSerializer < ActiveModel::Serializer
  attributes :id, :title, :is_solved, :status, :created_at, :from_today, :like_count, :is_liked

  belongs_to :user, serializer: UserSerializer
  has_many :tags, serializer: TagSerializer

  def created_at
    object.created_at.strftime("%Y/%m/%d")
  end

  def from_today # rubocop:disable Metrics/AbcSize
    now = Time.zone.now
    created_at = object.created_at

    months = (now.year - created_at.year) * 12 + now.month - created_at.month - ((now.day >= created_at.day) ? 0 : 1)
    years = months.div(12)

    return "#{years}年前" if years > 0
    return "#{months}ヶ月前" if months > 0

    seconds = (Time.zone.now - object.created_at).round

    days = seconds / (60 * 60 * 24)
    return "#{days}日前" if days.positive?

    hours = seconds / (60 * 60)
    return "#{hours}時間前" if hours.positive?

    minutes = seconds / 60
    return "#{minutes}分前" if minutes.positive?

    "#{seconds}秒前"
  end

  def like_count
    object.likes_count
  end

  # rubocop:disable Naming/PredicateName
  def is_liked
    object.likes.exists?(user_id: current_user.id) if current_user
  end
  # rubocop:enable Naming/PredicateName
end
