class Like < ApplicationRecord
  belongs_to :user
  belongs_to :bug, counter_cache: true
end
