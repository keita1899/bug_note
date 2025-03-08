FactoryBot.define do
  factory :environment do
    category { "カテゴリー" }
    name { Faker::Technology.name }
    version { Faker::App.version }
    bug
  end
end
