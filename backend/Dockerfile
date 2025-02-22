FROM ruby:3.1.2

RUN apt-get update -qq && apt-get install -y build-essential \
    libpq-dev \
    vim \
    nodejs \
    postgresql-client

RUN mkdir /backend
WORKDIR /backend
COPY Gemfile /backend/Gemfile
COPY Gemfile.lock /backend/Gemfile.lock

RUN bundle install
COPY . /backend

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]