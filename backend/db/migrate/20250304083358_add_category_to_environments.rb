class AddCategoryToEnvironments < ActiveRecord::Migration[7.1]
  def change
    add_column :environments, :category, :string, null: false, default: ''
  end
end