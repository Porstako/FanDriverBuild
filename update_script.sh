#!/bin/bash

LOG_FILE="/home/pi/FanDriver/update.log"

# Tworzenie kopii głównego skryptu jako tymczasowy skrypt
TEMP_SCRIPT=$(mktemp /tmp/temp_update_script.XXXXXX)

cat << 'EOF' > "$TEMP_SCRIPT"
#!/bin/bash

LOG_FILE="/home/pi/FanDriver/update.log"

# Przejście do katalogu domowego
cd

# Przejście do katalogu projektu i sprawdzenie, czy operacja się powiodła
cd /home/pi/FanDriver || { echo "Błąd: Nie udało się przejść do katalogu /home/pi/FanDriver" >> "$LOG_FILE"; exit 1; }

# Pobieranie aktualizacji zdalnego repozytorium
sudo git fetch origin
UPDATES_AVAILABLE=$(sudo git status | grep 'behind')

if [[ "$UPDATES_AVAILABLE" ]]; then
  # Zabijanie procesów
  sudo pkill -f server.js
  if [ $? -ne 0 ]; then
    echo "Błąd: Nie udało się zabić procesu server.js (kod: 1)" >> "$LOG_FILE"
    exit 1
  fi

  sudo pkill -f mainPI.bin
  if [ $? -ne 0 ]; then
    echo "Błąd: Nie udało się zabić procesu mainPI.bin (kod: 1)" >> "$LOG_FILE"
    exit 1
  fi

  cd /home/pi/FanDriver

  echo "git: Dostępne aktualizacje. Pobieranie..." >> "$LOG_FILE"
  sudo git stash
  sudo git pull origin
  if [ $? -ne 0 ]; then
      echo "Błąd: git: Nie udało się pobrać aktualizacji (kod: 2)" >> "$LOG_FILE"
      exit 2
  else
      echo "git: Pobrano aktualizację." >> "$LOG_FILE"
  fi
else
  echo "git: Brak dostępnych aktualizacji." >> "$LOG_FILE"
fi

# Ustawienie uprawnień
sudo chmod +x /home/pi/FanDriver/rpi/mainPI.bin
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla mainPI.bin (kod: 3)" >> "$LOG_FILE"
  exit 3
else
  echo "Ustawiono uprawnienia dla mainPI.bin" >> "$LOG_FILE"
fi

sudo chmod +x /home/pi/FanDriver/update_script.sh
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla update_script.sh (kod: 3)" >> "$LOG_FILE"
  exit 3
else
  echo "Ustawiono uprawnienia dla update_script.sh" >> "$LOG_FILE"
fi

sudo chmod +x /home/pi/FanDriver/connect_wifi.sh
if [ $? -ne 0 ]; then
  echo "Błąd: Nie udało się ustawić uprawnień dla connect_wifi.sh (kod: 3)" >> "$LOG_FILE"
  exit 3
else
  echo "Ustawiono uprawnienia dla connect_wifi.sh" >> "$LOG_FILE"
fi

# Uruchamianie ponowne systemu
echo "Uruchamianie ponowne systemu..." >> "$LOG_FILE"
sudo reboot

# Usunięcie tymczasowego skryptu
sudo rm -f "$0"
EOF

# Uruchomienie tymczasowego skryptu z sudo
sudo bash "$TEMP_SCRIPT"

# Usunięcie tymczasowego skryptu po wykonaniu
sudo rm -f "$TEMP_SCRIPT"
