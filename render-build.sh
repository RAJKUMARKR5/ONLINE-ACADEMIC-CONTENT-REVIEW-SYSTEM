#!/usr/bin/env bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies and build
# Use --include=dev to ensure build tools (vite) are installed in production environment
cd ../frontend && npm install --include=dev && npm run build
