class Api::V1::CommentsController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    bug = Bug.find(params[:bug_id])
    comment = bug.comments.new(comment_params)
    comment.user = current_user

    if comment.save
      render json: { message: "コメントしました" }, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    bug = Bug.find(params[:bug_id])
    comment = bug.comments.find(params[:id])

    if comment.user == current_user
      comment.destroy!
      render json: { message: "コメントを削除しました" }, status: :ok
    else
      render json: { error: "自分のコメントのみ削除できます" }, status: :forbidden
    end
  end

  private

    def comment_params
      params.require(:comment).permit(:content)
    end
end
