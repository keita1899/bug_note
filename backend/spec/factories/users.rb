FactoryBot.define do
  factory :user do
    sequence(:email) {|n| "test#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    confirmed_at { Time.current }
    name { "テストユーザー" }
    nickname { "ニックネーム" }
    image { "https://placehold.jp/150x150.png" }
  end
end
