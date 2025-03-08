class RenameLinkToUrlInReferences < ActiveRecord::Migration[7.1]
  def change
    rename_column :references, :link, :url
  end
end