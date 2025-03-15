FactoryBot.define do
  factory :comment do
    content { "テストコメントです" }
    association :user
    association :bug
  end
end
