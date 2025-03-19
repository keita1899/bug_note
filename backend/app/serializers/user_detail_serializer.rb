class UserDetailSerializer < BaseUserSerializer
  attributes :followers_count, :following_count, :is_following

  def followers_count
    object.followers.count
  end

  def following_count
    object.following.count
  end

  # rubocop:disable Naming/PredicateName
  def is_following
    current_user&.following?(object) || false
  end
  # rubocop:enable Naming/PredicateName
end
