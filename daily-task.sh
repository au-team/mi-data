#!/bin/sh

# 获取当前日期并格式化为 YYYY-MM-DD
current_date=$(date '+%Y-%m-%d')

node src/main.js

git add .

# 提交信息
commit_message="Commit on $current_date"

# 执行 git commit 命令
git commit -m "$commit_message"

git push origin main
