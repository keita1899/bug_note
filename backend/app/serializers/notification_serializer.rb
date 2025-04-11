class NotificationSerializer < ActiveModel::Serializer
  attributes :id, :action, :read, :created_at

  belongs_to :notifiable, polymorphic: true
  belongs_to :user, serializer: UserSerializer
  belongs_to :actor, serializer: UserSerializer

  def created_at
    object.created_at.iso8601
  end

  def actor
    object.actor
  end

  def notifiable
    {
      type: object.notifiable.class.name.downcase,
      title: notifiable_title,
      bug_id: bug_id,
    }
  end

  private

    def notifiable_title
      case object.notifiable
      when Bug
        object.notifiable.title
      when Comment
        object.notifiable.bug.title
      when Like
        object.notifiable.bug.title
      else
        nil
      end
    end

    def bug_id
      case object.notifiable
      when Bug
        object.notifiable.id
      when Comment
        object.notifiable.bug.id
      when Like
        object.notifiable.bug.id
      else
        nil
      end
    end
end
