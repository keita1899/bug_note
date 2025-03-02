programming_languages = [
  "C",
  "C++",
  "Dart",
  "Elixir",
  "Go",
  "Haskell",
  "Java",
  "JavaScript",
  "Julia",
  "Kotlin",
  "Lua",
  "Objective-C",
  "Perl",
  "PHP",
  "Python",
  "R",
  "Ruby",
  "Rust",
  "Scala",
  "Shell",
  "SQL",
  "Swift",
  "TypeScript",
]

programming_languages.each do |programming_language|
  ProgrammingLanguage.find_or_create_by(name: programming_language)
end
