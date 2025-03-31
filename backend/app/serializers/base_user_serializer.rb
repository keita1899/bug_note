class BaseUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :nickname, :image_url

  def image_url
    object.image_url if object.image.attached?
  end
end
