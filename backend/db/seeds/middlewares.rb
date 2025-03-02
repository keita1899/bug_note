middlewares = [
  "Apache HTTP Server",
  "Caddy",
  "Envoy",
  "HAProxy",
  "Kafka",
  "Memcached",
  "Nginx",
  "RabbitMQ",
  "Redis",
  "Resque",
  "Sidekiq",
  "Traefik",
  "Varnish",
]

middlewares.each do |middleware|
  Middleware.find_or_create_by(name: middleware)
end
