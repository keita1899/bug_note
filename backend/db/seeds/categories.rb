categories = [
  "OS",
  "プログラミング言語",
  "フレームワーク",
  "ミドルウェア",
  "データベース",
  "プラットフォーム",
  "ブラウザ",
  "エディタ",
  "仮想環境",
  "ツール",
  "ライブラリ",
  "その他",
]

categories.each do |category|
  Category.find_or_create_by(name: category)
end
