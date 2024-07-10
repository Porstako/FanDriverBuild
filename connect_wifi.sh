#!/bin/bash

SSID="nazwa_sieci"
PASSWORD="twoje_haslo"

# Tworzenie kopii zapasowej istniejącej konfiguracji
sudo cp /etc/wpa_supplicant/wpa_supplicant.conf /etc/wpa_supplicant/wpa_supplicant.conf.bak

# Dodawanie nowej konfiguracji sieci
echo -e "\nnetwork={\n    ssid=\"$SSID\"\n    psk=\"$PASSWORD\"\n}" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf > /dev/null

# Przeładowanie konfiguracji wpa_supplicant
sudo wpa_cli reconfigure