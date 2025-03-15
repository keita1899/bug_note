# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  has_many :bugs, dependent: :destroy
  has_many :comments, dependent: :destroy

  PASSWORD_COMPLEXITY_REGEX = /\A(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,128}\z/

  validates :email, length: { maximum: 255 }, format: { with: URI::MailTo::EMAIL_REGEXP, message: I18n.t("errors.messages.invalid_email") }
  validates :password,
            format: { with: PASSWORD_COMPLEXITY_REGEX, message: I18n.t("errors.messages.password_complexity") }, if: :new_record?
  validates :password_confirmation, presence: true, if: :new_record?
end
