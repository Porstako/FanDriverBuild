#!/bin/bash

cd

# Zabijanie procesów
pkill -f server.js
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się zabić procesu server.js" >> /home/pi/FanDriver/update.log
  exit 1
fi

pkill -f mainPI.bin
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się zabić procesu mainPI.bin" >> /home/pi/FanDriver/update.log
  exit 1
fi

# Aktualizacja kodu
cd /home/pi/FanDriver
git fetch origin

# Sprawdzanie, czy lokalny stan jest zaktualizowany
UPDATES_AVAILABLE=$(git status | grep 'behind')
if [[ "$UPDATES_AVAILABLE" ]]; then
    echo "Dostępne aktualizacje. Pobieranie..."
    git pull origin
    if [ $? -ne 0 ]; then
        echo "Błąd: Nie udało się pobrać aktualizacji z git" >> /home/pi/FanDriver/update.log
        exit 2
    else
        echo "Aktualizacja zakończona sukcesem."
    fi
else
    echo "Brak dostępnych aktualizacji."
fi

# Ustawienie uprawnień
chmod +x /home/pi/FanDriver/rpi/mainPI.bin
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla mainPI.bin" >> /home/pi/FanDriver/update.log
  exit 3
fi

chmod +x /home/pi/FanDriver/update-script.sh
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla update-script.sh" >> /home/pi/FanDriver/update.log
  exit 3
fi

chmod +x /home/pi/FanDriver/connect_wifi.sh
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla connect_wifi.sh" >> /home/pi/FanDriver/update.log
  exit 3
fi

# Uruchomienie serwera i programu
node /home/pi/FanDriver/webserver/server.js &
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się uruchomić server.js" >> /home/pi/FanDriver/update.log
  exit 4
fi

/home/pi/FanDriver/rpi/mainPI.bin &
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się uruchomić mainPI.bin" >> /home/pi/FanDriver/update.log
  exit 4
fi