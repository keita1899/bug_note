FactoryBot.define do
  factory :bug do
    title { Faker::Lorem.sentence }
    error_message { Faker::Lorem.paragraph }
    content { Faker::Lorem.paragraph }
    expected_behavior { Faker::Lorem.paragraph }
    solution { Faker::Lorem.paragraph }
    cause { Faker::Lorem.paragraph }
    etc { Faker::Lorem.paragraph }
    status { "draft" }
    is_solved { false }
    user

    after(:create) do |bug|
      create_list(:attempt, 2, bug: bug)
      create_list(:reference, 2, bug: bug)
      create_list(:environment, 2, bug: bug)
    end
  end
end
