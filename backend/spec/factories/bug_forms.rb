FactoryBot.define do
  factory :bug_form, class: "BugForm" do
    title { Faker::Lorem.sentence }
    error_message { Faker::Lorem.paragraph }
    content { Faker::Lorem.paragraph }
    expected_behavior { Faker::Lorem.paragraph }
    solution { Faker::Lorem.paragraph }
    cause { Faker::Lorem.paragraph }
    etc { Faker::Lorem.paragraph }
    status { "draft" }
    is_solved { false }

    environments { [{ category: "プログラミング言語", name: "Ruby", version: "3.0.0" }] }
    attempts { [{ content: "サーバーを再起動" }] }
    references { [{ url: "http://example.com" }] }

    initialize_with { new(attributes, user) }
  end
end
