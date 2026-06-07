#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_DIR="$SCRIPT_DIR/.pids"

start() {
  mkdir -p "$PID_DIR"

  if [ -f "$PID_DIR/backend.pid" ] && kill -0 "$(cat "$PID_DIR/backend.pid")" 2>/dev/null; then
    echo "Backend is already running (PID $(cat "$PID_DIR/backend.pid"))"
  else
    echo "Starting backend server..."
    cd "$SCRIPT_DIR/server" && npm run dev &
    echo $! > "$PID_DIR/backend.pid"
    echo "Backend started (PID $(cat "$PID_DIR/backend.pid")) - http://localhost:3001"
  fi

  if [ -f "$PID_DIR/frontend.pid" ] && kill -0 "$(cat "$PID_DIR/frontend.pid")" 2>/dev/null; then
    echo "Frontend is already running (PID $(cat "$PID_DIR/frontend.pid"))"
  else
    echo "Starting frontend server..."
    cd "$SCRIPT_DIR" && npm run dev &
    echo $! > "$PID_DIR/frontend.pid"
    echo "Frontend started (PID $(cat "$PID_DIR/frontend.pid")) - http://localhost:5173"
  fi

  wait
}

stop() {
  for name in backend frontend; do
    pidfile="$PID_DIR/$name.pid"
    if [ -f "$pidfile" ]; then
      pid=$(cat "$pidfile")
      if kill -0 "$pid" 2>/dev/null; then
        kill "$pid"
        echo "$name stopped (PID $pid)"
      else
        echo "$name is not running"
      fi
      rm -f "$pidfile"
    else
      echo "$name is not running"
    fi
  done
}

status() {
  for name in backend frontend; do
    pidfile="$PID_DIR/$name.pid"
    if [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null; then
      echo "$name: running (PID $(cat "$pidfile"))"
    else
      echo "$name: stopped"
    fi
  done
}

case "$1" in
  start)  start  ;;
  stop)   stop   ;;
  restart) stop; sleep 1; start ;;
  status) status ;;
  *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
