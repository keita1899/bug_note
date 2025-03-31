FactoryBot.define do
  factory :user do
    sequence(:email) {|n| "test#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    confirmed_at { Time.current }
    name { "テストユーザー" }
    nickname { "ニックネーム" }

    trait :with_image do
      after(:build) do |user|
        file_path = Rails.root.join("spec", "fixtures", "images", "valid_image.jpg")
        user.image.attach(
          io: File.open(file_path),
          filename: "valid_image.jpg",
          content_type: "image/jpeg",
        )
      end
    end
  end
end
