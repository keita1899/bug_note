class Api::V1::TechStackController < ApplicationController
  def index
    render json: resource_class.all, each_serializer: TechStackSerializer
  end

  def show
    render json: resource_class.find(params[:id]), serializer: TechStackSerializer
  end

  private

    def resource_class
      controller_name.classify.constantize
    end
end
