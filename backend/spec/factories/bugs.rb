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
    created_at { Time.zone.now }
    user

    after(:create) do |bug|
      create_list(:attempt, 2, bug: bug)
      create_list(:reference, 2, bug: bug)
      create_list(:environment, 2, bug: bug)
    end

    trait :published do
      is_solved { true }
      status { "published" }
    end

    trait :solved_draft do
      is_solved { true }
    end
  end
end
