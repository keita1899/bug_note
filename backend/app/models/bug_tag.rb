class BugTag < ApplicationRecord
  belongs_to :bug
  belongs_to :tag

  validates :bug_id, uniqueness: { scope: :tag_id }
end
