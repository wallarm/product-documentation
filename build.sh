#!/bin/bash

# Get changed file list
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD)

# Flags with commands for different conditions
RUN_EN_BUILD=true
RUN_TR_BUILD=false
RUN_JA_BUILD=false
RUN_PT_BUILD=false
RUN_DEPR_BUILD=false
RUN_ALL_BUILD=false

# Check directories that changed
if echo "$CHANGED_FILES" | grep -qE "-pt-BR(/|$)"; then
  RUN_PT_BUILD=true
fi
if echo "$CHANGED_FILES" | grep -qE "-tr(/|$)"; then
  RUN_TR_BUILD=true
fi
if echo "$CHANGED_FILES" | grep -qE "-ja(/|$)"; then
  RUN_JA_BUILD=true
fi
if echo "$CHANGED_FILES" | grep -qE "-(2\.18|3\.6)(/|$)"; then
  RUN_DEPR_BUILD=true
fi
if echo "$CHANGED_FILES" | grep -qE "(images/|stylesheets/|requirements\.txt)"; then
  RUN_EN_BUILD=false
  RUN_ALL_BUILD=true
fi

# Build commands
if [ "$RUN_EN_BUILD" = true ]; then
  echo "Build EN docs"
  pip3 install --no-cache-dir -r requirements.txt &&
  mkdocs build -f mkdocs-4.8.yml &&
  mkdocs build -f mkdocs-4.6.yml &&
  mkdocs build -f mkdocs-4.4.yml &&
  mkdocs build -f mkdocs-deprecated.yml
fi
if [ "$RUN_PT_BUILD" = true ]; then
  echo "Build PT docs"
  mkdocs build -f mkdocs-pt-BR-4.8.yml
fi
if [ "$RUN_TR_BUILD" = true ]; then
  echo "Build TR docs"
  mkdocs build -f mkdocs-tr-4.8.yml
fi
if [ "$RUN_JA_BUILD" = true ]; then
  echo "Build JA docs"
  mkdocs build -f mkdocs-ja-4.8.yml &&
  mkdocs build -f mkdocs-ja-4.6.yml
fi
if [ "$RUN_DEPR_BUILD" = true ]; then
  echo "Build DEPR docs"
  mkdocs build -f mkdocs-3.6.yml &&
  mkdocs build -f mkdocs-2.18.yml
fi
if [ "$RUN_ALL_BUILD" = true ]; then
  echo "Build ALL docs"
  pip3 install --no-cache-dir -r requirements.txt &&
  mkdocs build -f mkdocs-4.8.yml &&
  mkdocs build -f mkdocs-4.6.yml &&
  mkdocs build -f mkdocs-4.4.yml &&
  mkdocs build -f mkdocs-deprecated.yml &&
  mkdocs build -f mkdocs-3.6.yml &&
  mkdocs build -f mkdocs-2.18.yml &&
  mkdocs build -f mkdocs-ja-4.8.yml &&
  mkdocs build -f mkdocs-ja-4.6.yml &&
  mkdocs build -f mkdocs-tr-4.8.yml &&
  mkdocs build -f mkdocs-pt-BR-4.8.yml
fi
