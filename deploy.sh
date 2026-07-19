#!/usr/bin/env bash
# Redeploy BioSphere AI to Azure Container Apps after a code change.
# Usage:  ./deploy.sh
#
# Fill in your own resource group / registry / app name below (or export
# them as env vars before running). This script assumes the Container App
# already exists with DATABASE_URL, AUTH_SECRET (and optionally
# OPENAI_API_KEY) configured as secrets/env vars — set those once via:
#   az containerapp secret set -n "$APP" -g "$RG" --secrets auth-secret=<value>
#   az containerapp update -n "$APP" -g "$RG" --set-env-vars AUTH_SECRET=secretref:auth-secret
#
# NOTE: the default SQLite setup stores dev.db inside the container's
# filesystem, which does not persist across revisions on Container Apps.
# For a real deployment, either mount an Azure Files volume or switch to
# Postgres (see README.md) before going further than a demo.
set -euo pipefail

RG="${RG:-biosphere-ai-rg}"
ACR="${ACR:-biosphereaiacr}"
APP="${APP:-biosphere-ai}"
TAG="build-$(date +%s)"
IMAGE="$ACR.azurecr.io/biosphere-ai:$TAG"

echo "==> Building image in Azure (ACR) as $TAG ..."
az acr build --registry "$ACR" -g "$RG" --image "biosphere-ai:$TAG" --file Dockerfile . -o none

echo "==> Rolling out new revision..."
az containerapp update -n "$APP" -g "$RG" --image "$IMAGE" -o none

URL="https://$(az containerapp show -n "$APP" -g "$RG" --query 'properties.configuration.ingress.fqdn' -o tsv)/"
echo "==> Live at: $URL"
