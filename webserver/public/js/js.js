//Autor: Piotr Gliński

// Główny plik JS strony, czysto frontendowy. Nie odpowiada za żadną transmisję danych

// Oczekiwanie na kliknięcie
document.getElementById("menuButton").addEventListener('click', () => menuToggle());
document.getElementById("menuButton2").addEventListener('click', () => menuToggle()); 

// funkcja do przejścia Strona główna <--> Menu
function menuToggle(){
  if (document.getElementById("mainDisplay").style.display === 'block')
  {
    document.getElementById("mainDisplay").style.display = 'none';
    document.getElementById("menuDisplay").style.display = 'block';
  } else{
    document.getElementById("menuDisplay").style.display = 'none';
    document.getElementById("mainDisplay").style.display = 'block';
  }
  
}

//Proste funkcje przycisków polityki prywatnosci i pomocy
document.getElementById("privacyPolicyButton").addEventListener('click', () => {
  document.getElementById("privacyPolicyContainer").style.display = 'flex';
});

document.getElementById("closePrivacyPolicyButton").addEventListener('click', () => {
  document.getElementById("privacyPolicyContainer").style.display = 'none';
});


document.getElementById("helpButton").addEventListener('click', () => {
  document.getElementById("helpContainer").style.display = 'flex';
});

document.getElementById("closeHelpButton").addEventListener('click', () => {
  document.getElementById("helpContainer").style.display = 'none';
});

//ograniczenie wartości liczbowych
document.getElementById('sweptDiameter').addEventListener('input', function () {
  const maxLength = 5; // Maksymalna liczba cyfr
  if (this.value.length > maxLength) {
    this.value = this.value.slice(0, maxLength);
  }
});
