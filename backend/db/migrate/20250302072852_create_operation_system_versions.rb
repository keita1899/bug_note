class CreateOperationSystemVersions < ActiveRecord::Migration[7.1]
  def change
    create_table :operation_system_versions do |t|
      t.string :version
      t.references :operation_system, null: false, foreign_key: true

      t.timestamps
    end
  end
end
