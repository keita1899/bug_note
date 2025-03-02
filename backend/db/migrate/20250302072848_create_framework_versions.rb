class CreateFrameworkVersions < ActiveRecord::Migration[7.1]
  def change
    create_table :framework_versions do |t|
      t.string :version
      t.references :framework, null: false, foreign_key: true

      t.timestamps
    end
  end
end
