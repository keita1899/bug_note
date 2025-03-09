class EnvironmentSerializer < ActiveModel::Serializer
  attributes :id, :category, :name, :version
end
