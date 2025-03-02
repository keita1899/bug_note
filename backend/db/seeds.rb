Dir[Rails.root.join("db/seeds/*.rb")].sort.each do |seed|
  Rails.logger.debug "Seeding: #{seed}"
  require seed
end
