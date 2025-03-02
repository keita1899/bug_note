editors = [
  "Atom",
  "Brackets",
  "Cursor",
  "Eclipse",
  "Emacs",
  "JetBrains IntelliJ IDEA",
  "NetBeans",
  "Sublime Text",
  "Visual Studio Code",
  "Vi",
  "Vim",
  "Xcode",
]

editors.each do |editor|
  Editor.find_or_create_by(name: editor)
end
