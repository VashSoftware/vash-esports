#!/bin/bash
screen -Rd minecraft -X stuff "say Server is shutting down in 10 seconds!$(printf '\r')"
sleep 10
screen -Rd minecraft -X stuff "stop$(printf '\r')"
