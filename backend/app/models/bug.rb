class Bug < ApplicationRecord
  belongs_to :user

  has_many :environments, dependent: :destroy
  has_many :attempts, dependent: :destroy
  has_many :references, dependent: :destroy
  has_many :comments, dependent: :destroy
end
