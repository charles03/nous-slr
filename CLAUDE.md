# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Systematic Literature Review (SLR) project repository. The codebase is currently in early stages with minimal structure established.

## Current State

The repository contains:
- Basic README.md describing the project as a Systematic Literature Review
- Node.js-style .gitignore file indicating planned JavaScript/TypeScript development
- No package.json or source code established yet

## Development Setup

Install dependencies:
```bash
npm install
```

## Common Commands

- `npm start` or `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle

## Project Structure

- `src/` - Source code
  - `index.js` - Main entry point
  - `App.js` - Main React component
  - `App.css` - Application styles
- `public/` - Static assets and HTML template
- `webpack.config.js` - Webpack configuration for building and dev server

## Architecture

React web application using:
- Webpack for bundling and development server
- Babel for JavaScript/JSX transpilation
- CSS loader for styling