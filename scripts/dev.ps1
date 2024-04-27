Set-Location ../src/docker/webapp

Start-Process http://localhost:5173

# node --loader tsx server.ts
# ./node_modules/.bin/tsx.ps1 watch .

npm run dev
