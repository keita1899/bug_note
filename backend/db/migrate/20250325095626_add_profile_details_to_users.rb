class AddProfileDetailsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :bio, :text
    add_column :users, :github_url, :string, limit: 255
    add_column :users, :website_url, :string, limit: 255
  end
end