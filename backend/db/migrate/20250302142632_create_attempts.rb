class CreateAttempts < ActiveRecord::Migration[7.1]
  def change
    create_table :attempts do |t|
      t.references :bug, null: false, foreign_key: true
      t.text :content, null: false

      t.timestamps
    end
  end
end
