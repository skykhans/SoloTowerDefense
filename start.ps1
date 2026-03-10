$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = $root
$docFile = Join-Path $root "docs\11-MainScene节点结构说明.md"

function Get-CocosCreatorPath {
    $manualCandidates = @(
        $env:COCOS_CREATOR_EXE,
        $env:COCOS_CREATOR_PATH
    ) | Where-Object { $_ -and (Test-Path $_) }

    if ($manualCandidates) {
        return $manualCandidates[0]
    }

    $candidatePaths = @(
        (Join-Path $env:ProgramFiles "Cocos\CocosDashboard\resources\.editors"),
        (Join-Path ${env:ProgramFiles(x86)} "Cocos\CocosDashboard\resources\.editors"),
        (Join-Path $env:ProgramData "cocos\editors\Creator"),
        (Join-Path ${env:ProgramFiles(x86)} "CocosDashboard\resources\.editors"),
        (Join-Path $env:LOCALAPPDATA "Programs\CocosCreator"),
        (Join-Path $env:LOCALAPPDATA "CocosCreator"),
        (Join-Path $env:USERPROFILE "AppData\Local\Programs\CocosCreator"),
        (Join-Path $env:USERPROFILE "AppData\Local\CocosCreator")
    ) | Where-Object { $_ -and (Test-Path $_) }

    foreach ($basePath in $candidatePaths) {
        $found = Get-ChildItem -Path $basePath -Filter "CocosCreator.exe" -File -Recurse -ErrorAction SilentlyContinue |
            Sort-Object FullName -Descending |
            Select-Object -First 1

        if ($found) {
            return $found.FullName
        }
    }

    return $null
}

$cocosExe = Get-CocosCreatorPath

Write-Host "SoloTowerDefense startup"
Write-Host "Project: $projectDir"

if ($cocosExe) {
    Write-Host "Launching Cocos Creator..."
    Write-Host "Cocos Creator: $cocosExe"
    Start-Process -FilePath $cocosExe -ArgumentList "--path", $projectDir
} else {
    Write-Host "Cocos Creator not found."
    Write-Host "You can set COCOS_CREATOR_EXE or COCOS_CREATOR_PATH to your CocosCreator.exe path."
    Write-Host "Opening project folder and key document instead."
    Start-Process explorer.exe $projectDir
}

if (Test-Path $docFile) {
    Start-Process $docFile
}
