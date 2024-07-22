#!/bin/bash

cd
cd /home/pi/FanDriver
git fetch origin
UPDATES_AVAILABLE=$(git status | grep 'behind')

cd

# Zabijanie procesów
pkill -f server.js
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się zabić procesu server.js (kod:1)" >> /home/pi/FanDriver/update.log
  exit 1
fi

pkill -f mainPI.bin
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się zabić procesu mainPI.bin (kod:1)" >> /home/pi/FanDriver/update.log
  exit 1
fi

# Aktualizacja kodu
cd /home/pi/FanDriver

# Sprawdzanie, czy lokalny stan jest zaktualizowany
if [[ "$UPDATES_AVAILABLE" ]]; then
    echo "git: Dostępne aktualizacje. Pobieranie..." >> /home/pi/FanDriver/update.log
    git stash
    git pull origin
    if [ $? -ne 0 ]; then
        echo "Błąd: git: Nie udało się pobrać aktualizacji (kod: 2)" >> /home/pi/FanDriver/update.log
        exit 2
    else
        echo "git: Pobrano aktualizację." >> /home/pi/FanDriver/update.log
    fi
else
    echo "git: Brak dostępnych aktualizacji." >> /home/pi/FanDriver/update.log
fi

# Ustawienie uprawnień
chmod +x /home/pi/FanDriver/rpi/mainPI.bin
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla mainPI.bin (kod:3)" >> /home/pi/FanDriver/update.log
  exit 3
else
  echo "Ustawiono uprawnienia dla mainPI.bin" >> /home/pi/FanDriver/update.log
fi

chmod +x /home/pi/FanDriver/update_script.sh
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla update_script.sh (kod:3)" >> /home/pi/FanDriver/update.log
  exit 3
else
  echo "Ustawiono uprawnienia dla update_script.sh" >> /home/pi/FanDriver/update.log
fi

chmod +x /home/pi/FanDriver/connect_wifi.sh
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla connect_wifi.sh (kod:3)" >> /home/pi/FanDriver/update.log
  exit 3
else
  echo "Ustawiono uprawnienia dla connect_wifi.sh" >> /home/pi/FanDriver/update.log
fi

# Uruchomienie serwera i programu
node /home/pi/FanDriver/webserver/server.js &
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się uruchomić server.js (kod:4)" >> /home/pi/FanDriver/update.log
  exit 4
fi

/home/pi/FanDriver/rpi/mainPI.bin &
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się uruchomić mainPI.bin (kod:4)" >> /home/pi/FanDriver/update.log
  exit 4
fi