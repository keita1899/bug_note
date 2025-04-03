class Api::V1::Mypage::BugsController < Api::V1::BaseController
  include Pagination

  before_action :authenticate_user!

  def index
    render_bugs
  end

  def solved
    render_bugs(is_solved: true)
  end

  def unsolved
    render_bugs(is_solved: false)
  end

  def published
    render_bugs(status: "published")
  end

  def draft
    render_bugs(status: "draft")
  end

  def liked
    bugs = current_user.liked_bugs.includes(:user, :tags).order("likes.created_at DESC").page(params[:page] || 1).per(10)

    render json: bugs, each_serializer: BugListSerializer, status: :ok, meta: pagination(bugs), adapter: :json
  end

  private

    def render_bugs(filters = {})
      bugs = current_user.bugs.where(filters).
               includes(:tags).
               order(created_at: :desc).
               page(params[:page] || 1).
               per(10)
      render json: bugs, each_serializer: BugListSerializer, status: :ok, meta: pagination(bugs), adapter: :json
    end
end
