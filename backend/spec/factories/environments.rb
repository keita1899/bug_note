FactoryBot.define do
  factory :environment do
    category { "カテゴリー" }
    name { Faker.name }
    version { Faker::App.version }
    bug
  end
end
