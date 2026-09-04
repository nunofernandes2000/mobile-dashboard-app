#!/bin/bash

# ============================================================
# start-android.sh - Liga tudo com um comando: npm run android
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SERVER_DIR="$SCRIPT_DIR/../server"
PID_FILE="/tmp/bff_server.pid"

# --- BFF Server ---
echo "A arrancar o BFF server..."
if [ -f "$PID_FILE" ]; then
  kill "$(cat $PID_FILE)" 2>/dev/null
  rm "$PID_FILE"
fi
lsof -ti :3000 | xargs kill -9 2>/dev/null
sleep 0.5

nohup bash -c "cd '$SERVER_DIR' && node auth.js" > /tmp/bff_server.log 2>&1 &
BFF_PID=$!
echo $BFF_PID > "$PID_FILE"
echo "BFF server iniciado (PID: $BFF_PID)"

echo "A aguardar o servidor..."
for i in {1..10}; do
  sleep 0.5
  if lsof -i :3000 | grep -q LISTEN; then
    echo "Servidor pronto na porta 3000"
    break
  fi
  if [ $i -eq 10 ]; then
    echo "Servidor demorou demasiado. Continua mesmo assim..."
  fi
done

# --- Emulador ---
echo "A configurar emulador..."

# Apenas o Metro precisa de adb reverse (o BFF usa 10.0.2.2 diretamente)
adb reverse tcp:8081 tcp:8081 2>/dev/null && echo "adb reverse 8081 ativo" || echo "adb reverse 8081 falhou"

echo ""
echo "A iniciar Expo... (BFF acessivel via 10.0.2.2:3000)"
echo ""

npx expo start --android --localhost

echo ""
echo "Expo parado. O BFF server continua a correr (PID: $BFF_PID)."
