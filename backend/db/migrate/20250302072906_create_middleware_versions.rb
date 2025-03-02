class CreateMiddlewareVersions < ActiveRecord::Migration[7.1]
  def change
    create_table :middleware_versions do |t|
      t.string :version
      t.references :middleware, null: false, foreign_key: true

      t.timestamps
    end
  end
end
