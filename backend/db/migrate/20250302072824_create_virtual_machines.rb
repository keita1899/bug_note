class CreateVirtualMachines < ActiveRecord::Migration[7.1]
  def change
    create_table :virtual_machines do |t|
      t.string :name

      t.timestamps
    end
  end
end
