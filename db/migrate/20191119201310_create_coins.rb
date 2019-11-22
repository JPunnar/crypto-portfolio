class CreateCoins < ActiveRecord::Migration[5.2]
  def change
    create_table :coins do |t|
      t.string :type
      t.decimal :amount
      t.text :location
      t.date :purchased_at
    end
  end
end
