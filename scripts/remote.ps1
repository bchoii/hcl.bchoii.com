$Pem = 'scripts\pem\bchoii.pem'
$Domain = 'hcl.bchoii.com'

ipconfig /flushdns
nslookup $Domain
# ping $Domain
# exit

Set-Location ..
ssh -o "StrictHostKeyChecking no" -i $Pem ubuntu@$Domain
# docker exec -it caddy sh
# psql -d postgres -U postgres

# cd /etc/caddyls
# cd dist && docker compose up --detach --build --force-recreate server

# ALTER DATABASE postgres SET TIMEZONE TO 'Asia/Singapore';
# SELECT * FROM pg_timezone_names WHERE name = current_setting('TIMEZONE');
# SHOW TIMEZONE;

# show statement_timeout