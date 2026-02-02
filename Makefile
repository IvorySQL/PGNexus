.PHONY: help build up down restart logs ps health shell db-shell clean schema migrate

# Use Docker Compose V2
DOCKER_COMPOSE := docker compose

# Default target
help:
	@echo "PGNexus Docker Deployment Commands"
	@echo "===================================="
	@echo ""
	@echo "Setup:"
	@echo "  make setup          - Initial setup (create .env from template)"
	@echo "  make schema         - Apply database schema"
	@echo ""
	@echo "Docker Compose:"
	@echo "  make build          - Build Docker images"
	@echo "  make up             - Start all services"
	@echo "  make down           - Stop all services"
	@echo "  make devup          - Start all services for dev (no nginx)"
	@echo "  make devdown        - Stop all services for dev (no nginx)"
	@echo "  make restart        - Restart all services"
	@echo "  make logs           - View application logs"
	@echo "  make logs-db        - View database logs"
	@echo "  make ps             - Show running containers"
	@echo ""
	@echo "Application:"
	@echo "  make health         - Check application health"
	@echo "  make shell          - Open shell in app container"
	@echo "  make db-shell       - Open PostgreSQL shell"
	@echo "  make migrate        - Run database migrations"
	@echo ""
	@echo "Maintenance:"
	@echo "  make backup         - Backup database"
	@echo "  make clean          - Remove containers and volumes"
	@echo "  make rebuild        - Rebuild and restart"
	@echo ""

# Setup
setup:
	@echo "Creating .env from template..."
	@if [ ! -f .env ]; then \
		cp .env.docker.example .env; \
		echo "✓ Created .env file"; \
		echo "⚠️  Please edit .env and set your configuration"; \
		echo "⚠️  Generate NEXTAUTH_SECRET with: openssl rand -base64 32"; \
	else \
		echo "✗ .env already exists"; \
	fi

# Database schema
schema:
	@echo "Applying database schema..."
	$(DOCKER_COMPOSE) up -d postgres
	@sleep 3
	$(DOCKER_COMPOSE) exec -T postgres psql -U pgnexus -d pgnexus < schema.sql
	@echo "✓ Schema applied"

# Docker operations
build:
	$(DOCKER_COMPOSE) build

up:
	@export NEXTAUTH_SECRET=$$(openssl rand -base64 32) && \
	$(DOCKER_COMPOSE) up -d
	#@echo "Waiting for services to be ready..."
	#@sleep 5
	#@make health

down:
	$(DOCKER_COMPOSE) down

devup:
	@export NEXTAUTH_SECRET=$$(openssl rand -base64 32) && \
	$(DOCKER_COMPOSE) -f ./docker-compose-dev.yml up -d

devdown:
	$(DOCKER_COMPOSE) -f ./docker-compose-dev.yml down

restart:
	$(DOCKER_COMPOSE) restart

logs:
	$(DOCKER_COMPOSE) logs -f pgnexus-app

logs-db:
	$(DOCKER_COMPOSE) logs -f pgnexus-postgres

ps:
	$(DOCKER_COMPOSE) ps

# Application operations
health:
	@echo "Checking application health..."
	@curl -s http://localhost:3000/api/health | jq '.' || echo "Health check failed or jq not installed"

shell:
	$(DOCKER_COMPOSE) exec app /bin/bash

db-shell:
	$(DOCKER_COMPOSE) exec postgres psql -U n8n-user -d n8n-db

migrate:
	$(DOCKER_COMPOSE) exec app npm run migrate

# Maintenance
backup:
	@mkdir -p backups
	@echo "Creating database backup..."
	$(DOCKER_COMPOSE) exec postgres pg_dump -U n8n-user n8n-db > backups/backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "✓ Backup created in backups/"

clean:
	@echo "⚠️  This will remove all containers and volumes!"
	@read -p "Are you sure? (y/N) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		$(DOCKER_COMPOSE) down -v; \
		echo "✓ Cleaned"; \
	fi

rebuild:
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) build --no-cache
	$(DOCKER_COMPOSE) up -d
	@make logs

# Quick deploy (setup -> schema -> up)
deploy:
	@if [ ! -f .env ]; then \
		make setup; \
		echo ""; \
		echo "⚠️  Please edit .env with your configuration, then run:"; \
		echo "   make schema"; \
		echo "   make up"; \
	else \
		make schema; \
		make build; \
		make up; \
	fi
