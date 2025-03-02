operation_systems = [
  "Android",
  "CentOS",
  "iOS",
  "Linux",
  "MacOS",
  "Red Hat",
  "Ubuntu",
  "Unix",
  "Windows",
  "Windows Server",
]

operation_systems.each do |operation_system|
  OperationSystem.find_or_create_by(name: operation_system)
end
