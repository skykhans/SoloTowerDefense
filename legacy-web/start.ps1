$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$port = 8000
$url = "http://localhost:$port"

if (Get-Command py -ErrorAction SilentlyContinue) {
    $serverCommand = "py -m http.server $port"
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    $serverCommand = "python -m http.server $port"
} else {
    Write-Error "Python 3 未安装，无法启动本地静态服务器。"
}

Write-Host "Starting SoloTowerDefense at $url"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; $serverCommand"
Start-Sleep -Seconds 2
Start-Process $url
