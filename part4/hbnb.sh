#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PART4="$SCRIPT_DIR"
BACK="$PART4/hbnb"
FRONT_PORT=5500
API_PORT=5000

# Priority:
# 1) already active virtual environment
# 2) part4/.venv
# 3) part4/venv
# 4) repo root .venv
# 5) repo root venv

if [ -n "$VIRTUAL_ENV" ] && [ -f "$VIRTUAL_ENV/bin/activate" ]; then
  VENV_PATH="$VIRTUAL_ENV"
elif [ -f "$PART4/.venv/bin/activate" ]; then
  VENV_PATH="$PART4/.venv"
elif [ -f "$PART4/venv/bin/activate" ]; then
  VENV_PATH="$PART4/venv"
elif [ -f "$PART4/../.venv/bin/activate" ]; then
  VENV_PATH="$PART4/../.venv"
elif [ -f "$PART4/../venv/bin/activate" ]; then
  VENV_PATH="$PART4/../venv"
else
  echo "No virtual environment found."
  echo "Checked:"
  echo "  current VIRTUAL_ENV=$VIRTUAL_ENV"
  echo "  $PART4/.venv"
  echo "  $PART4/venv"
  echo "  $PART4/../.venv"
  echo "  $PART4/../venv"
  exit 1
fi

activate_venv() {
  if [ -n "$VIRTUAL_ENV" ] && [ "$VIRTUAL_ENV" = "$VENV_PATH" ]; then
    return
  fi

  # shellcheck disable=SC1090
  source "$VENV_PATH/bin/activate"
}

stop_servers() {
  pkill -f "http.server $FRONT_PORT" 2>/dev/null || true
  pkill -f "python3 run.py" 2>/dev/null || true
}

reset_demo() {
  echo "Activating virtual environment..."
  activate_venv

  echo "Resetting demo data..."
  cd "$BACK"
  python3 seed_demo.py

  echo ""
  echo "Demo data reset successfully."
  echo "Shared password: Test1234!"
  echo ""
}

start_servers() {
  echo "Activating virtual environment..."
  activate_venv

  echo "Starting servers..."
  stop_servers

  cd "$BACK"
  python3 run.py &
  API_PID=$!

  cd "$PART4"
  python3 -m http.server "$FRONT_PORT" --bind 127.0.0.1 &
  FRONT_PID=$!

  echo ""
  echo "API running on   http://127.0.0.1:$API_PORT/api/v1/"
  echo "Front running on http://127.0.0.1:$FRONT_PORT/index.html"
  echo ""

  trap "kill $API_PID $FRONT_PID 2>/dev/null || true" EXIT INT TERM
  wait
}

usage() {
  echo "Usage:"
  echo "  ./hbnb.sh reset   # Reset demo data"
  echo "  ./hbnb.sh start   # Start API + front"
  echo "  ./hbnb.sh all     # Reset demo data, then start API + front"
  echo "  ./hbnb.sh stop    # Stop running servers"
}

case "${1:-}" in
  reset)
    reset_demo
    ;;
  start)
    start_servers
    ;;
  all)
    reset_demo
    start_servers
    ;;
  stop)
    stop_servers
    echo "Servers stopped."
    ;;
  *)
    usage
    exit 1
    ;;
esac
