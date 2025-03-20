FactoryBot.define do
  factory :like do
    association :user
    association :bug
  end
end
