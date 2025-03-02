browsers = [
  "Arc",
  "Brave",
  "Google Chrome",
  "Internet Explorer",
  "Microsoft Edge",
  "Mozilla Firefox",
  "Opera",
  "Safari",
]

browsers.each do |browser|
  Browser.find_or_create_by(name: browser)
end
