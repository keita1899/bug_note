class CreateEnvironments < ActiveRecord::Migration[7.1]
  def change
    create_table :environments do |t|
      t.references :bug, null: false, foreign_key: true
      t.string :name, null: false
      t.string :version

      t.timestamps
    end
  end
end
