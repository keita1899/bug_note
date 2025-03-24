class FollowUserSerializer < BaseUserSerializer
  attributes :is_following

  # rubocop:disable Naming/PredicateName
  def is_following
    current_user&.following?(object) || false
  end
  # rubocop:enable Naming/PredicateName
end
