require "rails_helper"

RSpec.describe BugForm, type: :model do
  let!(:user) { build(:user) }
  let!(:bug_form) { build(:bug_form, user: user) }

  describe "バリデーション" do
    context "入力が正しい場合" do
      it "成功する" do
        expect(bug_form).to be_valid
      end

      it "タイトルの文字数が255文字だと成功する" do
        bug_form.title = "a" * 255
        expect(bug_form).to be_valid
      end

      it "環境の名前の文字数が255文字の場合成功する" do
        bug_form.environments[0][:name] = "a" * 255
        expect(bug_form).to be_valid
      end

      it "環境のバージョンの文字数が255文字の場合成功する" do
        bug_form.environments[0][:version] = "a" * 255
        expect(bug_form).to be_valid
      end

      it "解決方法が空の状態で未公開にすると成功する" do
        bug_form.solution = nil
        bug_form.is_solved = false
        expect(bug_form).to be_valid
      end

      it "未解決の状態でステータスを下書きにすると成功する" do
        bug_form.status = "draft"
        expect(bug_form).to be_valid
      end

      it "解決済の状態でステータスを下書きにすると成功する" do
        bug_form.status = "draft"
        bug_form.is_solved = true
        expect(bug_form).to be_valid
      end

      it "解決済の状態でステータスを公開にすると成功する" do
        bug_form.status = "published"
        bug_form.is_solved = true
        expect(bug_form).to be_valid
      end

      it "参考リンクが255文字だと成功する" do
        bug_form.references = [{ url: "http://#{"a" * 248}" }]
        expect(bug_form).to be_valid
      end

      it "参考リンクが空の場合は成功する" do
        bug_form.references = [{ url: "" }]
        expect(bug_form).to be_valid
      end

      it "タグを3つまで選択できる" do
        bug_form.tags = [1, 2, 3]
        expect(bug_form).to be_valid
      end

      it "タグが空の場合は成功する" do
        bug_form.tags = []
        expect(bug_form).to be_valid
      end
    end

    context "入力が間違っている場合" do
      it "タイトルが空の場合失敗する" do
        bug_form.title = nil
        expect(bug_form).to be_invalid
      end

      it "エラー内容が空の場合失敗する" do
        bug_form.content = nil
        expect(bug_form).to be_invalid
      end

      it "タイトルの文字数が256文字以上の場合失敗する" do
        bug_form.title = "a" * 256
        expect(bug_form).to be_invalid
      end

      it "環境の名前の文字数が256文字以上の場合失敗する" do
        bug_form.environments[0][:name] = "a" * 256
        expect(bug_form).to be_invalid
      end

      it "環境のバージョンの文字数が256文字以上の場合失敗する" do
        bug_form.environments[0][:version] = "a" * 256
        expect(bug_form).to be_invalid
      end

      it "下書きの状態でステータスを公開にすると失敗する" do
        bug_form.status = "published"
        expect(bug_form).to be_invalid
      end

      it "解決方法が空の状態で解決済にすると失敗する" do
        bug_form.solution = nil
        bug_form.is_solved = true
        expect(bug_form).to be_invalid
      end

      it "参考リンクが255文字を超える場合失敗する" do
        bug_form.references = [{ url: "http://#{"a" * 249}" }]
        expect(bug_form).to be_invalid
        expect(bug_form.errors[:'references.url']).to include("参考リンクは255文字以内で入力してください")
      end

      it "無効なURL形式の場合失敗する" do
        bug_form.references = [{ url: "invalid-url" }]
        expect(bug_form).to be_invalid
        expect(bug_form.errors[:'references.url']).to include("有効なURLを入力してください")
      end

      it "タグの数が3つを超えると失敗する" do
        bug_form.tags = [1, 2, 3, 4]
        expect(bug_form).to be_invalid
        expect(bug_form.errors[:tags]).to include("は3つまでしか選択できません")
      end
    end
  end
end
