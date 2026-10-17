# 修复 insteadOf + 提交 CNAME/域名改动 + 推送（用完即删）
$ErrorActionPreference = 'Continue'
$repo = 'D:\Dev\website\portfolio'

Write-Output '===== 1) GitHub 默认走 SSH（正确写法） ====='
git config --global --unset-all 'url.git@github.com:.insteadOf' 2>$null
git config --global --add 'url.git@github.com:.insteadOf' 'https://github.com/'
Write-Output '--- 已写入的改写规则 ---'
git config --global --get-regexp '^url\.' | ForEach-Object { $_.Line }

Write-Output ''
Write-Output '===== 2) 验证改写真的生效 ====='
Write-Output '（故意禁用凭据助手：若仍能读远端，说明确实走了 SSH）'
$env:GIT_SSH_COMMAND = 'ssh -o BatchMode=yes -o ConnectTimeout=15'
git -c credential.helper= -c credential.interactive=false ls-remote --heads https://github.com/tyee33/tyee33.github.io.git 2>&1 | Out-String
Write-Output "ls-remote exit=$LASTEXITCODE"

Write-Output ''
Write-Output '===== 3) 提交 CNAME 与域名改动 ====='
Set-Location $repo
git add -A
git status --short
git commit -q -m "fix: 恢复 CNAME 并把站点绝对地址切到自定义域名 tyee.is-a.dev" -m "- 恢复被误删的 CNAME（自定义域名绑定的唯一来源）
- canonical / og:url / og:image / twitter:image 改为 tyee.is-a.dev
- data/site.js 的 siteUrl、robots.txt、sitemap.xml 同步更新
- og.png 与占位简历 PDF 重新生成"
Write-Output "commit exit=$LASTEXITCODE"
git log --format='%h | %an <%ae> | %s' -2

Write-Output ''
Write-Output '===== 4) 推送（SSH） ====='
git push origin main 2>&1 | Out-String
Write-Output "push exit=$LASTEXITCODE"
git fetch origin 2>&1 | Out-Null
git status -sb
Write-Output "本地 HEAD = $(git rev-parse --short HEAD)   origin/main = $(git rev-parse --short origin/main)"

Write-Output ''
Write-Output '===== 5) 最终 ~/.ssh 内容（应只剩新钥匙 + aliyunkey + known_hosts + config） ====='
Get-ChildItem (Join-Path $env:USERPROFILE '.ssh') -Force | Select-Object Name, Length | Format-Table -AutoSize | Out-String

Remove-Item (Join-Path $repo '.tmp-push.ps1') -Force -ErrorAction SilentlyContinue
Write-Output '临时脚本已删除'
