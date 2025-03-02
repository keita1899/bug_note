class CreateDatabaseVersions < ActiveRecord::Migration[7.1]
  def change
    create_table :database_versions do |t|
      t.string :version
      t.references :database, null: false, foreign_key: true

      t.timestamps
    end
  end
end
