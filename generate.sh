cp .env.development.example .env.development

if [ "$1" = "wp" ]; then
    cp .env.production.example .env.production
fi
