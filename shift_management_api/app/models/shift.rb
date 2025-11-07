class Shift < ApplicationRecord
  validates :employee_name, :position, :start_time, :end_time, :status, presence: true
  validate :end_time_after_start_time

  private

  def end_time_after_start_time
    return if end_time.blank? || start_time.blank?
    errors.add(:end_time, "must be after start time") if end_time <= start_time
  end
end
