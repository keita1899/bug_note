class CreateProgrammingLanguageVersions < ActiveRecord::Migration[7.1]
  def change
    create_table :programming_language_versions do |t|
      t.string :version
      t.references :programming_language, null: false, foreign_key: true

      t.timestamps
    end
  end
end
