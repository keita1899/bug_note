FactoryBot.define do
  factory :attempt do
    content { "試した内容 #{Faker::Lorem.sentence}" }
    bug
  end
end
