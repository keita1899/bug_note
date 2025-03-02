tools = [
  "Adobe XD",
  "Ansible",
  "CircleCI",
  "Figma",
  "Git",
  "GitHub",
  "GitHub Actions",
  "GitLab",
  "Jenkins",
  "Kubernetes",
  "Postman",
  "Sketch",
  "Terraform",
  "Travis CI",
  "Vagrant",
]

tools.each do |tool|
  Tool.find_or_create_by(name: tool)
end
