class CreateEditors < ActiveRecord::Migration[7.1]
  def change
    create_table :editors do |t|
      t.string :name

      t.timestamps
    end
  end
end
