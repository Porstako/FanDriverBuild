#!/bin/bash

cd

# Zabijanie procesów
pkill -f server.js
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się zabić procesu server.js" >> /home/pi/FanDriver/update.log
fi

pkill -f mainPI.bin
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się zabić procesu mainPI.bin" >> /home/pi/FanDriver/update.log
fi

# Aktualizacja kodu
cd /home/pi/FanDriver
git stash
git pull origin
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się pobrać aktualizacji z git" >> /home/pi/FanDriver/update.log
  exit 1
fi

# Ustawienie uprawnień
chmod +x /home/pi/FanDriver/rpi/mainPI.bin
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla mainPI.bin" >> /home/pi/FanDriver/update.log
  exit 1
fi

# Uruchomienie serwera i programu
node /home/pi/FanDriver/webserver/server.js &
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się uruchomić server.js" >> /home/pi/FanDriver/update.log
  exit 1
fi

/home/pi/FanDriver/rpi/mainPI.bin &
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się uruchomić mainPI.bin" >> /home/pi/FanDriver/update.log
  exit 1
fi