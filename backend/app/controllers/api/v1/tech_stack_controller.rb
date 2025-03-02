class Api::V1::TechStackController < ApplicationController
  def index
    render json: resource_class.all
  end

  def show
    render json: resource_class.find(params[:id])
  end

  private

    def resource_class
      controller_name.classify.constantize
    end
end
