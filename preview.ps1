# ============================================================================
# preview.ps1 —— 本地预览（可选）
# ----------------------------------------------------------------------------
# 用法：在项目目录里执行   pwsh -File preview.ps1
#       或直接双击 index.html —— 本站无需构建，file:// 下也能正常显示。
# 优先使用 Python 起 http 服务，其次使用 Node，都没有就给出提示。
# ============================================================================

$port = if ($env:PORT) { $env:PORT } else { '8080' }
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host ""
Write-Host "  项目目录: $root" -ForegroundColor DarkGray

$python = Get-Command python, python3, py -ErrorAction SilentlyContinue | Select-Object -First 1
if ($python) {
    Write-Host "  预览地址: http://localhost:$port/   (Ctrl+C 停止)" -ForegroundColor Green
    Write-Host ""
    & $python.Source -m http.server $port
    exit $LASTEXITCODE
}

$node = Get-Command node -ErrorAction SilentlyContinue | Select-Object -First 1
if ($node) {
    Write-Host "  预览地址: http://localhost:$port/   (Ctrl+C 停止)" -ForegroundColor Green
    Write-Host ""
    & $node.Source (Join-Path $root 'tools/serve.mjs') $port
    exit $LASTEXITCODE
}

Write-Host "  未找到 Python 或 Node。" -ForegroundColor Yellow
Write-Host "  不用担心：直接双击 index.html 就能预览，本站不需要构建。" -ForegroundColor Yellow
Write-Host ""
