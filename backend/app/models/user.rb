# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  has_many :bugs, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :active_follows, class_name: "Follow", foreign_key: "follower_id", dependent: :destroy, inverse_of: :follower
  has_many :following, through: :active_follows, source: :followed
  has_many :passive_follows, class_name: "Follow", foreign_key: "followed_id", dependent: :destroy, inverse_of: :following
  has_many :followers, through: :passive_follows, source: :follower

  PASSWORD_COMPLEXITY_REGEX = /\A(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,128}\z/

  validates :email, length: { maximum: 255 }, format: { with: URI::MailTo::EMAIL_REGEXP, message: I18n.t("errors.messages.invalid_email") }
  validates :password,
            format: { with: PASSWORD_COMPLEXITY_REGEX, message: I18n.t("errors.messages.password_complexity") }, if: :new_record?
  validates :password_confirmation, presence: true, if: :new_record?

  def follow(user)
    active_follows.create(followed_id: user.id)
  end

  def unfollow(user)
    active_follows.find_by(followed_id: user.id)&.destroy
  end

  def following?(user)
    following.include?(user)
  end
end
