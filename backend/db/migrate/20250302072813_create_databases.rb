class CreateDatabases < ActiveRecord::Migration[7.1]
  def change
    create_table :databases do |t|
      t.string :name

      t.timestamps
    end
  end
end
