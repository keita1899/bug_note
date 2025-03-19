class Api::V1::LikesController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    bug = Bug.find(params[:bug_id])
    if bug.likes.exists?(user: current_user)
      render json: { error: "すでにいいねされています" }, status: :unprocessable_entity
      return
    end

    like = bug.likes.new(user: current_user)

    if like.save
      render json: { message: "いいねしました" }, status: :created
    else
      render json: { error: "いいねに失敗しました" }, status: :unprocessable_entity
    end
  end

  def destroy
    bug = Bug.find(params[:bug_id])
    like = bug.likes.find_by(user: current_user)

    if like.nil?
      render json: { error: "いいねされていません" }, status: :not_found
      return
    end

    if like&.destroy
      render json: { message: "いいねを削除しました" }, status: :ok
    else
      render json: { error: "いいねの削除に失敗しました" }, status: :not_found
    end
  end

  private

    def liked_by_current_user?
      @bug.likes.exists?(user: current_user)
    end
end
