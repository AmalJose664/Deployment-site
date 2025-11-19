#!/bin/bash


#export GIT_REPO_URL="$GIT_REPO_URL"
echo "Fetching project data.."
projectId=$PROJECT_ID

# GET request
project=$(curl -s -X GET "https://52b4f7e13f4a80e1ce81b8131fa96c75.serveo.net/api/internal/projects/${projectId}" \
 -H "Authorization: Bearer container_GCa7TzM8RwxdmgpldlF7oreH64eybcu6yXcWwMkNtca7mBzMyoWm0Ts0D5sQoi2A" | jq .project)

repoURL=$(echo $project | jq -r .repoURL)
branch=$(echo $project | jq -r .branch)

echo "cloning git repo.."
git clone --filter=blob:none -b "$branch" "$repoURL" /home/app/output/
# git clone "$GIT_REPO_URL" /home/app/output/


commitData=$(git -C /home/app/output/ log -1 --pretty=format:"%H||%s")
echo $commitData
echo $branch
echo $repoURL
export GIT_COMMIT_DATA="$commitData"

exec node script.js