$Pem = 'scripts\pem\bchoii.pem'
$Domain = 'hcl.bchoii.com'

Set-Location $PSScriptRoot/..

# clear local dist
Remove-Item -Path "dist" -Recurse -Force
New-Item -Path "dist" -ItemType Directory

# clear diskspace
# ssh -i $Pem ubuntu@$Domain "sudo du -a ~ 2>/dev/null | sort -nr | head -n 20"
# ssh -i $Pem ubuntu@$Domain "sudo rm -rf dist/postgres_data_04"
# ssh -i $Pem ubuntu@$Domain "sudo rm -rf dist"

# clear remote dist
ssh -i $Pem ubuntu@$Domain "sudo rm -rf dist/webapp"
xcopy src\docker\* dist /s /i /exclude:scripts\dist.xcopy.exclude

 # partial dist
& $PSScriptRoot/dist.1.ps1
# robocopy ${PWD}/src/docker/ ${PWD}/dist /s /xd ".cache" "node_modules" "_shared" "_assets" "${PWD}\src\docker\webapp\build\" "${PWD}\src\docker\webapp\public\build\" /maxage:1 /maxlad:1
scp -i $Pem -r dist ubuntu@${Domain}:/home/ubuntu

# docker down
# ssh -i $Pem ubuntu@$Domain "cd dist && docker compose down --remove-orphans"
# ssh -i $Pem ubuntu@$Domain "cd dist && docker compose down webapp --remove-orphans"
# ssh -i $Pem ubuntu@$Domain "docker system prune -a -f --volumes"

# docker up
# ssh -i $Pem ubuntu@$Domain "cd dist && docker compose up --detach --build --force-recreate"
ssh -i $Pem ubuntu@$Domain "cd dist && docker compose up webapp --detach --build --force-recreate"
# ssh -i $Pem ubuntu@$Domain "cd dist && docker compose up postgres --detach --build --force-recreate"
# ssh -i $Pem ubuntu@$Domain "cd dist && docker compose up dozzle --detach --build --force-recreate"
# ssh -i $Pem ubuntu@$Domain "cd dist && docker compose up whoami --detach --build --force-recreate"
# ssh -i $Pem ubuntu@$Domain "cd dist && docker compose up caddy --detach --build --force-recreate"
# ssh -i $Pem ubuntu@$Domain "docker exec -w /etc/caddy caddy caddy reload"

# ssh -i $Pem ubuntu@$Domain "docker ps"
# ssh -i $Pem ubuntu@$Domain "df"

# Start-Process https://dozzle.$Domain/show?name=webapp
Start-Process https://dozzle.$Domain
Start-Process https://$Domain
# Start-Process https://whoami.$Domain

# Get-date