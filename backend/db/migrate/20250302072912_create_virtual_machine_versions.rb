class CreateVirtualMachineVersions < ActiveRecord::Migration[7.1]
  def change
    create_table :virtual_machine_versions do |t|
      t.string :version
      t.references :virtual_machine, null: false, foreign_key: true

      t.timestamps
    end
  end
end
