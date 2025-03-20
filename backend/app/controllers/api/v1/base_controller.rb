class Api::V1::BaseController < ApplicationController
  alias_method :authenticate_user!, :authenticate_api_v1_user!
  alias_method :user_signed_in?, :api_v1_user_signed_in?

  def current_user
    @current_user ||= current_api_v1_user
  end
end
