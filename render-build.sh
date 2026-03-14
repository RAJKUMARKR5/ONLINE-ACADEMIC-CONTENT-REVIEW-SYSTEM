#!/usr/bin/env bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies and build
cd ../frontend && npm install && npm run build
