FactoryBot.define do
  factory :notification do
    association :user
    association :actor, factory: :user
    association :notifiable, factory: :bug
    action { "liked" }
    read { false }

    trait :read do
      read { true }
    end

    trait :unread do
      read { false }
    end

    trait :like do
      action { "liked" }
      association :notifiable, factory: :bug
    end

    trait :comment do
      action { "commented" }
      association :notifiable, factory: :comment
    end

    trait :follow do
      action { "followed" }
      association :notifiable, factory: :user
    end

    trait :published do
      action { "published" }
      association :notifiable, factory: :bug
    end
  end
end
