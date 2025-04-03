#!/bin/bash

# Exit on error
set -e

# Build the project
npm run build

# Create .nojekyll file
touch out/.nojekyll

# Get the current branch name
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Save the current changes
git stash

# Switch to gh-pages branch or create it if it doesn't exist
if git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout gh-pages
else
  git checkout --orphan gh-pages
  git rm -rf .
fi

# Copy the contents of the out directory to the root
cp -r out/* .
cp out/.nojekyll .

# Add all files
git add .

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Push to GitHub
git push origin gh-pages

# Switch back to the original branch
git checkout $current_branch

# Apply the stashed changes
git stash pop

echo "Deployment completed successfully!"