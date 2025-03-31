require "rails_helper"
require "tempfile"

RSpec.describe User, type: :model do
  let!(:user) { build(:user) }

  describe "バリデーション" do
    context "入力が正しい場合" do
      it "成功する" do
        expect(user).to be_valid
      end

      it "パスワードが8文字かつ英数字が含まれる場合成功する" do
        user.password = "passwor1"
        user.password_confirmation = "passwor1"
        expect(user).to be_valid
      end

      it "パスワードが128文字かつ英数字が含まれる場合成功する" do
        user.password = "a1" * 64
        user.password_confirmation = "a1" * 64
        expect(user).to be_valid
      end

      it "メールアドレスが255文字の場合成功する" do
        user.email = "#{"a" * 243}@example.com"
        expect(user).to be_valid
      end
    end

    context "入力が間違っている場合" do
      it "メールアドレスが空の場合失敗する" do
        user.email = nil
        expect(user).to be_invalid
        expect(user.errors[:email]).to include("を入力してください")
      end

      it "パスワードが空の場合失敗する" do
        user.password = nil
        expect(user).to be_invalid
        expect(user.errors[:password]).to include("を入力してください")
      end

      it "パスワード確認が空の場合失敗する" do
        user.password_confirmation = nil
        expect(user).to be_invalid
        expect(user.errors[:password_confirmation]).to include("を入力してください")
      end

      it "メールアドレスの形式が間違っていると失敗する" do
        invalid_emails = [
          "invalid_email",
          "@example.com",
          "user@.com",
          "user@example,com",
          "user@example..com",
        ]

        invalid_emails.each do |invalid_email|
          user.email = invalid_email
          expect(user).to be_invalid
          expect(user.errors[:email]).to include("無効なメールアドレスです")
        end
      end

      it "メールアドレスの文字数が256文字以上だと失敗する" do
        user.email = "#{"a" * 244}@example.com"
        expect(user).to be_invalid
        expect(user.errors[:email]).to include("は255文字以内で入力してください")
      end

      it "メールアドレスが重複していると失敗する" do
        create(:user, email: "duplicate@example.com")
        user.email = "duplicate@example.com"
        expect(user).to be_invalid
        expect(user.errors[:email]).to include("はすでに存在します")
      end

      it "パスワードが7文字だと失敗する" do
        user.password = "1234567"
        expect(user).to be_invalid
        expect(user.errors[:password]).to include("は8文字以上で入力してください")
      end

      it "パスワードが129文字以上だと失敗する" do
        user.password = "#{"a" * 128}1"
        expect(user).to be_invalid
        expect(user.errors[:password]).to include("は128文字以内で入力してください")
      end

      it "パスワードの形式が間違っていると失敗する" do
        invalid_passwords = [
          "ああああああああ",
          "abcdefgh",
          "12345678",
        ]

        invalid_passwords.each do |invalid_password|
          user.password = invalid_password
          expect(user).to be_invalid
          expect(user.errors[:password]).to include("は半角英字と数字をそれぞれ1文字以上含む必要があります")
        end
      end

      it "パスワードと確認用パスワードが一致していないと失敗する" do
        user.password = "password123"
        user.password_confirmation = "differentpassword"
        expect(user).to be_invalid
        expect(user.errors[:password_confirmation]).to include("とパスワードの入力が一致しません")
      end
    end

    context "プロフィール更新時" do
      before do
        user.profile_update = true
      end

      it "名前が空の場合失敗する" do
        user.name = nil
        expect(user).to be_invalid
        expect(user.errors[:name]).to include("を入力してください")
      end

      it "自己紹介が空の場合成功する" do
        user.bio = nil
        expect(user).to be_valid
      end

      it "Github URLが空の場合成功する" do
        user.github_url = nil
        expect(user).to be_valid
      end

      it "WebサイトURLが空の場合成功する" do
        user.website_url = nil
        expect(user).to be_valid
      end

      it "名前が255文字を超える場合失敗する" do
        user.name = "a" * 256
        expect(user).to be_invalid
        expect(user.errors[:name]).to include("は255文字以内で入力してください")
      end

      it "自己紹介が500文字を超える場合失敗する" do
        user.bio = "a" * 501
        expect(user).to be_invalid
        expect(user.errors[:bio]).to include("は500文字以内で入力してください")
      end

      it "Github URLが255文字を超える場合失敗する" do
        user.github_url = "a" * 256
        expect(user).to be_invalid
        expect(user.errors[:github_url]).to include("は255文字以内で入力してください")
      end

      it "WebサイトURLが255文字を超える場合失敗する" do
        user.website_url = "a" * 256
        expect(user).to be_invalid
        expect(user.errors[:website_url]).to include("は255文字以内で入力してください")
      end

      it "Github URLがURL形式でない場合失敗する" do
        user.github_url = "invalid_url"
        expect(user).to be_invalid
        expect(user.errors[:github_url]).to include("は有効なURLではありません")
      end

      it "WebサイトURLがURL形式でない場合失敗する" do
        user.website_url = "invalid_url"
        expect(user).to be_invalid
        expect(user.errors[:website_url]).to include("は有効なURLではありません")
      end
    end

    context "トークン更新時" do
      it "名前が空でも成功する" do
        user.name = nil
        expect(user).to be_valid
      end
    end
  end

  describe "画像のバリデーション" do
    before do
      user.profile_update = true
    end

    def attach_test_image(extension:, content_type:, size: 1.megabyte)
      Tempfile.create(["test_image", ".#{extension}"]) do |file|
        file.binmode
        if content_type == "image/gif"
          file.write("GIF89a")
        else
          file.write("\xFF\xD8\xFF\xE0") if content_type == "image/jpeg"
          file.truncate(size)
        end
        file.rewind

        user.image.attach(
          io: file,
          filename: "test_image.#{extension}",
          content_type: content_type,
        )
      end
    end

    it "JPEG画像をアップロードできる" do
      attach_test_image(extension: "jpeg", content_type: "image/jpeg")
      expect(user).to be_valid
    end

    it "JPG画像をアップロードできる" do
      attach_test_image(extension: "jpg", content_type: "image/jpg")
      expect(user).to be_valid
    end

    it "PNG画像をアップロードできる" do
      attach_test_image(extension: "png", content_type: "image/png")
      expect(user).to be_valid
    end

    it "WebP画像をアップロードできる" do
      attach_test_image(extension: "webp", content_type: "image/webp")
      expect(user).to be_valid
    end

    it "画像が空の場合でも成功する" do
      user.image = nil
      expect(user).to be_valid
    end

    it "GIF画像をアップロードできない" do
      attach_test_image(extension: "gif", content_type: "image/gif")
      expect(user).to be_invalid
      expect(user.errors[:image]).to include("はJPEG、JPG、PNG、WebP形式のみ使用できます")
    end

    it "3MBの画像はアップロードできる" do
      attach_test_image(
        extension: "jpg",
        content_type: "image/jpeg",
        size: 3.megabytes,
      )
      expect(user).to be_valid
    end

    it "3MBを超えるサイズの画像はアップロードできない" do
      attach_test_image(
        extension: "jpg",
        content_type: "image/jpeg",
        size: 4.megabytes,
      )
      expect(user).to be_invalid
      expect(user.errors[:image]).to include("ファイル サイズは 3MB 未満にする必要があります (現在のサイズは 4MB)")
    end
  end
end
