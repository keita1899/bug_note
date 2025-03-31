# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  before_create :set_default_name, if: :name_blank?

  has_many :bugs, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :active_follows, class_name: "Follow", foreign_key: "follower_id", dependent: :destroy, inverse_of: :follower
  has_many :following, through: :active_follows, source: :followed
  has_many :passive_follows, class_name: "Follow", foreign_key: "followed_id", dependent: :destroy, inverse_of: :followed
  has_many :followers, through: :passive_follows, source: :follower
  has_many :likes, dependent: :destroy
  has_many :liked_bugs, through: :likes, source: :bug
  has_one_attached :image

  PASSWORD_COMPLEXITY_REGEX = /\A(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,128}\z/
  MAX_IMAGE_SIZE = 3.megabytes
  ALLOWED_CONTENT_TYPES = %w[image/jpeg image/jpg image/png image/webp].freeze

  attr_accessor :profile_update

  validates :email, length: { maximum: 255 }, format: { with: URI::MailTo::EMAIL_REGEXP, message: I18n.t("errors.messages.invalid_email") }
  validates :password,
            format: { with: PASSWORD_COMPLEXITY_REGEX, message: I18n.t("errors.messages.password_complexity") }, if: :new_record?
  validates :password_confirmation, presence: true, if: :new_record?
  validate :validate_image, if: -> { image.attached? && profile_update? }
  validates :name, presence: true, length: {
    maximum: 255,
  }, if: :profile_update?
  validates :bio, length: {
    maximum: 500,
  }, if: :profile_update?
  validates :github_url,
            length: { maximum: 255 },
            format: { with: URI::DEFAULT_PARSER.make_regexp, message: "は有効なURLではありません" },
            allow_blank: true,
            if: :profile_update?
  validates :website_url,
            length: { maximum: 255 },
            format: { with: URI::DEFAULT_PARSER.make_regexp, message: "は有効なURLではありません" },
            allow_blank: true,
            if: :profile_update?

  def follow(user)
    active_follows.create(followed_id: user.id)
  end

  def unfollow(user)
    active_follows.find_by(followed_id: user.id)&.destroy
  end

  def following?(user)
    following.include?(user)
  end

  def profile_update?
    profile_update == true
  end

  def as_json(options = {})
    super(options.merge(
      only: [:id, :email, :name, :nickname],
      methods: [:image_url],
    ))
  end

  def image_url
    image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(image) : nil
  end

  private

    def set_default_name
      self.name = SecureRandom.hex(4)
    end

    def name_blank?
      self.name.blank?
    end

    def validate_image
      if image.blob.byte_size > MAX_IMAGE_SIZE
        errors.add(
          :image,
          "ファイル サイズは 3MB 未満にする必要があります (現在のサイズは #{(image.blob.byte_size.to_f / 1.megabyte).round}MB)",
        )
        image.purge
        return
      end

      unless ALLOWED_CONTENT_TYPES.include?(image.content_type)
        errors.add(:image, "はJPEG、JPG、PNG、WebP形式のみ使用できます")
        image.purge
      end
    end
end
