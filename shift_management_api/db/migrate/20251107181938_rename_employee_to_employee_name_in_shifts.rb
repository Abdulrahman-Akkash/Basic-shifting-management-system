class RenameEmployeeToEmployeeNameInShifts < ActiveRecord::Migration[7.0]
  def change
    rename_column :shifts, :employee, :employee_name
  end
end
