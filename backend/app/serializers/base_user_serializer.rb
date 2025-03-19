class BaseUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :nickname, :image
end
