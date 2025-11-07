# app/controllers/api/shifts_controller.rb
module Api
  class ShiftsController < ApplicationController
    before_action :set_shift, only: [:show, :update, :destroy]

    # GET /api/shifts
    def index
      @shifts = Shift.all
      render json: @shifts
    end

    # GET /api/shifts/:id
    def show
      render json: @shift
    end

    # POST /api/shifts
    def create
      @shift = Shift.new(shift_params)
      if @shift.save
        render json: @shift, status: :created
      else
        render json: { errors: @shift.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PUT/PATCH /api/shifts/:id
    def update
      if @shift.update(shift_params)
        render json: @shift
      else
        render json: { errors: @shift.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/shifts/:id
    def destroy
      @shift.destroy
      head :no_content
    end

    private

    def set_shift
      @shift = Shift.find(params
