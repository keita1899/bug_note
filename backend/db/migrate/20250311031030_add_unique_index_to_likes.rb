class AddUniqueIndexToLikes < ActiveRecord::Migration[7.1]
  def change
    add_index :likes, [:user_id, :bug_id], unique: true
  end
end