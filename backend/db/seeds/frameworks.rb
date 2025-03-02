frameworks = [
  "Angular",
  "ASP.NET",
  "CakePHP",
  "Django",
  "Express",
  "Flask",
  "FuelPHP",
  "Gin",
  "Laravel",
  "NestJS",
  "Next.js",
  "Nuxt.js",
  "React",
  "Ruby on Rails",
  "Spring Framework",
  "Vue.js",
  "Zend Framework",
]

frameworks.each do |framework|
  Framework.find_or_create_by(name: framework)
end
