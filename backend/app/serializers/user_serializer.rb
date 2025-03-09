class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :nickname, :image
end
