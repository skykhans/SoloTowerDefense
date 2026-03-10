$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$assetsRoot = Join-Path $root "cocos-wechat\assets"

$sceneFiles = @(
    "textures/ui/home-background-placeholder.png",
    "textures/ui/home-title-panel-placeholder.png",
    "textures/ui/home-summary-panel-placeholder.png",
    "textures/ui/home-level-panel-placeholder.png",
    "textures/ui/home-action-panel-placeholder.png",
    "textures/ui/button-primary-placeholder.png",
    "textures/ui/button-secondary-placeholder.png",
    "textures/backgrounds/battle-map-background-placeholder.png",
    "textures/backgrounds/battle-path-placeholder.png",
    "textures/backgrounds/battle-hud-panel-placeholder.png",
    "textures/backgrounds/battle-toolbar-panel-placeholder.png",
    "textures/backgrounds/battle-tower-panel-placeholder.png",
    "textures/ui/result-background-placeholder.png",
    "textures/ui/result-panel-placeholder.png",
    "textures/ui/button-primary-placeholder.png",
    "textures/ui/button-secondary-placeholder.png"
)

$prefabFiles = @(
    "textures/enemies/enemy-normal-placeholder.png",
    "textures/enemies/enemy-fast-placeholder.png",
    "textures/enemies/enemy-heavy-placeholder.png",
    "textures/enemies/enemy-boss-placeholder.png",
    "textures/enemies/enemy-hpbar-fill-placeholder.png",
    "textures/towers/tower-base-placeholder.png",
    "textures/towers/tower-rapid-placeholder.png",
    "textures/towers/tower-cannon-placeholder.png",
    "textures/towers/tower-frost-placeholder.png",
    "textures/towers/tower-selection-ring-placeholder.png",
    "textures/towers/tower-range-indicator-placeholder.png",
    "textures/ui/buildspot-available-placeholder.png",
    "textures/ui/buildspot-occupied-placeholder.png",
    "textures/ui/buildspot-hint-placeholder.png",
    "textures/effects/bullet-rapid-placeholder.png",
    "textures/effects/bullet-cannon-placeholder.png",
    "textures/effects/bullet-frost-placeholder.png",
    "textures/effects/hit-effect-core-placeholder.png"
)

$audioFiles = @(
    "audio/sfx/build.wav",
    "audio/sfx/upgrade.wav",
    "audio/sfx/hit.wav",
    "audio/sfx/enemy-death.wav",
    "audio/sfx/victory.wav",
    "audio/sfx/failure.wav"
)

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
