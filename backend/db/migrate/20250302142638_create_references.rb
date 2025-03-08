class CreateReferences < ActiveRecord::Migration[7.1]
  def change
    create_table :references do |t|
      t.references :bug, null: false, foreign_key: true

      t.string :link, null: false

      t.timestamps
    end
  end
end
