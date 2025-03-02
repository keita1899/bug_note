class CreateToolVersions < ActiveRecord::Migration[7.1]
  def change
    create_table :tool_versions do |t|
      t.string :version
      t.references :tool, null: false, foreign_key: true

      t.timestamps
    end
  end
end
