class CreateMiddlewares < ActiveRecord::Migration[7.1]
  def change
    create_table :middlewares do |t|
      t.string :name

      t.timestamps
    end
  end
end
