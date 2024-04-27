Set-Location $PSScriptRoot/..

$source = 'src\docker'
$dest = 'dist'

Get-ChildItem $source -Recurse |
Where-Object {
  $_.LastWriteTime -ge (Get-Date).AddMinutes(-30) `
  -And(-Not($_.FullName.Contains("node_modules"))) `
  -And(-Not($_.FullName.Contains(".cache"))) `
  -And(-Not($_.FullName.Contains("_shared"))) `
  -And(-Not($_.FullName.Contains("_assets"))) `
  -And(-Not($_.FullName.Contains("webapp\.env"))) `
  -And(-Not($_.FullName.Contains("webapp\build"))) `
  -And(-Not($_.FullName.Contains("webapp\public\build"))) `
} |
ForEach-Object {
  if (-Not $_.PSIsContainer) {
    $targetFile = $dest + $_.FullName.Substring((Resolve-Path $source).Path.Length);
    New-Item -ItemType File -Path $targetFile -Force;
    Copy-Item -LiteralPath $_.FullName -Destination $targetFile;
  }
}
