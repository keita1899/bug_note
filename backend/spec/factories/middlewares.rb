FactoryBot.define do
  factory :middleware do
    name { Faker::Internet.domain_name }
  end
end
