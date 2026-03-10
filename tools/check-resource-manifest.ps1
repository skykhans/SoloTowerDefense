$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$assetsRoot = Join-Path $root "assets"
$manifestFile = Join-Path $root "assets\scripts\config\ResourceManifestData.json"
$manifest = Get-Content -Raw -Path $manifestFile | ConvertFrom-Json

$sceneFiles = foreach ($profile in $manifest.scene.PSObject.Properties.Value) {
    foreach ($file in $profile.suggestedAssets) {
        "$($profile.textureGroup)$file"
    }
}

$prefabFiles = foreach ($profile in $manifest.prefab.PSObject.Properties.Value) {
    foreach ($file in $profile.suggestedSpriteNames) {
        "$($profile.textureGroup)$file"
    }
}

$audioFiles = foreach ($file in $manifest.audio.suggestedFiles) {
    "$($manifest.audio.group)$file"
}

function Test-ManifestGroup {
    param(
        [string]$Label,
        [string[]]$Files
    )

    $results = foreach ($relativePath in $Files) {
        $absolutePath = Join-Path $assetsRoot $relativePath
        [PSCustomObject]@{
            Group = $Label
            Path = $relativePath
            Exists = Test-Path $absolutePath
        }
    }

    return $results
}

$sceneResults = Test-ManifestGroup -Label "scene" -Files $sceneFiles
$prefabResults = Test-ManifestGroup -Label "prefab" -Files $prefabFiles
$audioResults = Test-ManifestGroup -Label "audio" -Files $audioFiles
$allResults = @($sceneResults + $prefabResults + $audioResults)
$missing = $allResults | Where-Object { -not $_.Exists }

Write-Host "SoloTowerDefense resource manifest check"
Write-Host "Assets root: $assetsRoot"
Write-Host "Total expected:" $allResults.Count
Write-Host "Missing:" $missing.Count

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "Missing files:"
    $missing | ForEach-Object { Write-Host " - $($_.Path)" }
}
