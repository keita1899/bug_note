databases = [
  "DynamoDB",
  "MongoDB",
  "MySQL",
  "SQLite",
  "Oracle",
  "PostgreSQL",
  "Redis",
  "SQL Server",
]

databases.each do |database|
  Database.find_or_create_by(name: database)
end
