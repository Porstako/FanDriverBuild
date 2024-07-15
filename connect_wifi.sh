#!/bin/bash

# Przyjmowanie SSID i hasła jako argumenty z linii poleceń
SSID="$1"
PASSWORD="$2"

if [ -z "$SSID" ] || [ -z "$PASSWORD" ]; then
    echo "Użycie: $0 <SSID> <password>"
    exit 1
fi

# Rozłączanie wszystkich aktywnych połączeń Wi-Fi
nmcli device disconnect wlan0

# Usuwanie istniejącej konfiguracji sieci (jeśli istnieje)
nmcli con delete "$SSID" 2>/dev/null

# Tworzenie nowego połączenia Wi-Fi i łączenie się z nim
nmcli device wifi connect "$SSID" password "$PASSWORD" ifname wlan0

# Wyświetlanie statusu połączenia
nmcli connection show "$SSID"