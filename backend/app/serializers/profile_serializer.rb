class ProfileSerializer < BaseUserSerializer
  attributes :bio, :github_url, :website_url
end
