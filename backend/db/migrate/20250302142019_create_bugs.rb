class CreateBugs < ActiveRecord::Migration[7.1]
  def change
    create_table :bugs do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :error_message
      t.text :content
      t.text :expected_behavior
      t.text :solution
      t.text :cause
      t.text :etc
      t.string :status, null: false, default: 'draft'
      t.boolean :is_solved, null: false, default: false

      t.timestamps
    end
  end
end
