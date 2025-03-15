class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.text :content, limit: 1000
      t.references :user, null: false, foreign_key: true
      t.references :bug, null: false, foreign_key: true

      t.timestamps
    end
  end
end
