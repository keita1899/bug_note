platforms = [
  "AWS",
  "Azure",
  "Fly.io",
  "Google Cloud",
  "Heroku",
  "Render",
  "Vercel",
  "Web",
]

platforms.each do |platform|
  Platform.find_or_create_by(name: platform)
end
