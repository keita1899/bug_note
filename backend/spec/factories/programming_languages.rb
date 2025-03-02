FactoryBot.define do
  factory :programming_language do
    name { Faker::ProgrammingLanguage.name }
  end
end
