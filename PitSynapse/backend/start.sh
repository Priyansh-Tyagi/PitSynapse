#!/bin/bash
# PitSynapse - Startup script (run from backend directory)
# This script navigates to the correct location

cd "$(dirname "$0")/.."
bash start.sh

