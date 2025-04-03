# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_04_01_064044) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "attempts", force: :cascade do |t|
    t.bigint "bug_id", null: false
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bug_id"], name: "index_attempts_on_bug_id"
  end

  create_table "bug_tags", force: :cascade do |t|
    t.bigint "bug_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bug_id", "tag_id"], name: "index_bug_tags_on_bug_id_and_tag_id", unique: true
    t.index ["bug_id"], name: "index_bug_tags_on_bug_id"
    t.index ["tag_id"], name: "index_bug_tags_on_tag_id"
  end

  create_table "bugs", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "title", null: false
    t.text "error_message"
    t.text "content"
    t.text "expected_behavior"
    t.text "solution"
    t.text "cause"
    t.text "etc"
    t.string "status", default: "draft", null: false
    t.boolean "is_solved", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "likes_count", default: 0, null: false
    t.index ["user_id"], name: "index_bugs_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true
  end

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.bigint "user_id", null: false
    t.bigint "bug_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bug_id"], name: "index_comments_on_bug_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "environments", force: :cascade do |t|
    t.bigint "bug_id", null: false
    t.string "name", null: false
    t.string "version"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "category", default: "", null: false
    t.index ["bug_id"], name: "index_environments_on_bug_id"
  end

  create_table "follows", force: :cascade do |t|
    t.bigint "follower_id", null: false
    t.bigint "followed_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["followed_id"], name: "index_follows_on_followed_id"
    t.index ["follower_id", "followed_id"], name: "index_follows_on_follower_id_and_followed_id", unique: true
    t.index ["follower_id"], name: "index_follows_on_follower_id"
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "bug_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bug_id"], name: "index_likes_on_bug_id"
    t.index ["user_id", "bug_id"], name: "index_likes_on_user_id_and_bug_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "references", force: :cascade do |t|
    t.bigint "bug_id", null: false
    t.string "url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bug_id"], name: "index_references_on_bug_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tags_on_name"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change", default: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.string "name"
    t.string "nickname"
    t.string "image"
    t.string "email"
    t.json "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "bio"
    t.string "github_url", limit: 255
    t.string "website_url", limit: 255
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "attempts", "bugs"
  add_foreign_key "bug_tags", "bugs"
  add_foreign_key "bug_tags", "tags"
  add_foreign_key "bugs", "users"
  add_foreign_key "comments", "bugs"
  add_foreign_key "comments", "users"
  add_foreign_key "environments", "bugs"
  add_foreign_key "follows", "users", column: "followed_id"
  add_foreign_key "follows", "users", column: "follower_id"
  add_foreign_key "likes", "bugs"
  add_foreign_key "likes", "users"
  add_foreign_key "references", "bugs"
end
