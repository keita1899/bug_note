class BugSerializer < BaseBugSerializer
  attributes :error_message, :content, :expected_behavior,
             :solution, :cause, :etc

  has_many :environments, serializer: EnvironmentSerializer
  has_many :attempts, serializer: AttemptSerializer
  has_many :references, serializer: ReferenceSerializer
  has_many :comments, serializer: CommentSerializer
end
