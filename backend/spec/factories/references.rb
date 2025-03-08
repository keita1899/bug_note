FactoryBot.define do
  factory :reference do
    url { Faker::Internet.url }
    bug
  end
end
