class CreateBugTags < ActiveRecord::Migration[7.1]
  def change
    create_table :bug_tags do |t|
      t.references :bug, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
    add_index :bug_tags, [:bug_id, :tag_id], unique: true
  end
end
