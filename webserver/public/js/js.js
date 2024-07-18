//Autor: Piotr Gliński

// Główny plik JS strony, czysto frontendowy. Nie odpowiada za żadną transmisję danych

//zmienne
let lastTime=0;

// Oczekiwanie na kliknięcie
document.getElementById("menuButton").addEventListener('click', () => menuToggle(1));
document.getElementById("menuButton2").addEventListener('click', () => menuToggle(2));
document.getElementById("menuButton3").addEventListener('click', () => menuToggle(2));
document.getElementById("kWhStats").addEventListener('click', () => menuToggle(3));

// funkcja do przejścia| Statystyki <--> Strona główna <--> Menu
function menuToggle(buttonID){
  if (buttonID === 1)
  {
    document.getElementById("mainDisplay").style.display = 'none';
    document.getElementById("menuDisplay").style.display = 'block';
    document.getElementById("statsContainer").style.display = 'none';
  } else if (buttonID === 2){
    document.getElementById("menuDisplay").style.display = 'none';
    document.getElementById("mainDisplay").style.display = 'block';
    document.getElementById("statsContainer").style.display = 'none';
  } else if (buttonID === 3){
    document.getElementById("menuDisplay").style.display = 'none';
    document.getElementById("mainDisplay").style.display = 'none';
    document.getElementById("statsContainer").style.display = 'block';
    updateChart();
  }
}

// Zapobieganie wywołaniu menu kontekstowego prawym przyciskiem myszy
document.addEventListener('contextmenu', function(event) {   event.preventDefault(); });

//Update
function requestUpdate() {
  fetch('/update', { method: 'GET' })
      .then(response => response.text())
      .then(data => alert(data))
      .catch(error => console.error('Error:', error));
}

//obrot animacja
function obrot(timestamp){
  const dt= timestamp - lastTime;
  roundDegree+=rpm * 6 * (dt/1000);
  document.getElementById('sweepSpeedImage').style.transform = `rotate(${roundDegree}deg)`;
  requestAnimationFrame(obrot);
  lastTime=timestamp;
  if (roundDegree>360) roundDegree-=360;
}
requestAnimationFrame(obrot);

//zmiany offgrid - ongrid

function offGridOnGridSettingsChange(){
  if (document.getElementById('offGridCheckBox').checked){
    document.getElementById('PWM1SliderBox').style.display = 'block';
    document.getElementById('temperatureSliderBox').style.display = 'none';
    document.getElementById('offGridOnGridLabel').textContent = "On-Grid"
  }
  else{
    document.getElementById('PWM1SliderBox').style.display = 'none';
    document.getElementById('temperatureSliderBox').style.display = 'block';
    document.getElementById('offGridOnGridLabel').textContent = "Off-Grid";
  }
}
offGridOnGridSettingsChange();
temperatureFillColor();
document.getElementById('offGridCheckBox').addEventListener('change', () => offGridOnGridSettingsChange());


//przyciski + i -

//temperatura minus

document.getElementById('temperatureMinus').addEventListener('click',() => {
  if (document.getElementById('temperatureInput').value>0){
    document.getElementById('temperatureInput').value = Number(document.getElementById('temperatureInput').value) - 1;
    document.getElementById('temperatureOutput').textContent = Number(document.getElementById('temperatureOutput').textContent) - 1;
    temperatureFillColor();
  }
});

document.getElementById('temperatureMinus').addEventListener('mousedown',() => {
  temperatureMinusPress = setInterval(() => {
    if (document.getElementById('temperatureInput').value>0){
      document.getElementById('temperatureInput').value = Number(document.getElementById('temperatureInput').value) - 1;
      document.getElementById('temperatureOutput').textContent = Number(document.getElementById('temperatureOutput').textContent) - 1;
      temperatureFillColor();
    }
  }, 200)
});

document.getElementById("temperatureMinus").addEventListener('mouseup', () => {clearInterval(temperatureMinusPress);});
document.getElementById("temperatureMinus").addEventListener('mouseleave', () => {clearInterval(temperatureMinusPress);});


//temperatura Plus
document.getElementById('temperaturePlus').addEventListener('click',() => {
  if (document.getElementById('temperatureInput').value<90){
    document.getElementById('temperatureInput').value = Number(document.getElementById('temperatureInput').value) + 1;
    document.getElementById('temperatureOutput').textContent = Number(document.getElementById('temperatureOutput').textContent) + 1;
    temperatureFillColor();
  }
});

document.getElementById('temperaturePlus').addEventListener('mousedown',() => {
  temperaturePlusPress = setInterval(() => {
    if (document.getElementById('temperatureInput').value<90){
      document.getElementById('temperatureInput').value = Number(document.getElementById('temperatureInput').value) + 1;
      document.getElementById('temperatureOutput').textContent = Number(document.getElementById('temperatureOutput').textContent) + 1;
      temperatureFillColor();
    }
  }, 200)
});

document.getElementById("temperaturePlus").addEventListener('mouseup', () => {clearInterval(temperaturePlusPress);});
document.getElementById("temperaturePlus").addEventListener('mouseleave', () => {clearInterval(temperaturePlusPress);});

//PWM1MinMinus
document.getElementById("PWM1MinMinus").addEventListener('click', () => {
  if (slider.values[0]>0){
    document.getElementById("PWM1MinInput").value= Number(document.getElementById("PWM1MinInput").value) - 1;
    slider.values[0]-=1;
    document.getElementById("PWM1Min").textContent = Number(document.getElementById("PWM1Min").textContent) - 1;
    slider.fillColor();
  }
  
});
document.getElementById("PWM1MinMinus").addEventListener('mousedown', () => {
  PWM1MinMinusPress = setInterval(() => {
    if (slider.values[0]>0){
      document.getElementById("PWM1MinInput").value= Number(document.getElementById("PWM1MinInput").value) - 1;
      slider.values[0]-=1;
      document.getElementById("PWM1Min").textContent = Number(document.getElementById("PWM1Min").textContent) - 1;
      slider.fillColor();
    }
  }, 200);
});
document.getElementById("PWM1MinMinus").addEventListener('mouseup', () => {clearInterval(PWM1MinMinusPress);});
document.getElementById("PWM1MinMinus").addEventListener('mouseleave', () => {clearInterval(PWM1MinMinusPress);});



//PWM1MinPlus
document.getElementById("PWM1MinPlus").addEventListener('click', () => {
  if (slider.values[0]<Number(slider.values[1])-60){
    document.getElementById("PWM1MinInput").value= Number(document.getElementById("PWM1MinInput").value) + 1;
    slider.values[0]+=1;
    document.getElementById("PWM1Min").textContent= Number(document.getElementById("PWM1Min").textContent) + 1;
    slider.fillColor();
  }
});
document.getElementById("PWM1MinPlus").addEventListener('mousedown', () => {
  PWM1MinPlusPress = setInterval(() => {
    if (slider.values[0]<Number(slider.values[1])-60){
      document.getElementById("PWM1MinInput").value= Number(document.getElementById("PWM1MinInput").value) + 1;
      slider.values[0]+=1;
      document.getElementById("PWM1Min").textContent= Number(document.getElementById("PWM1Min").textContent) + 1;
      slider.fillColor();
    }
  }, 200);
});
document.getElementById("PWM1MinPlus").addEventListener('mouseup', () => {  clearInterval(PWM1MinPlusPress);  });
document.getElementById("PWM1MinPlus").addEventListener('mouseleave', () => {  clearInterval(PWM1MinPlusPress);  });


//PWM1MaxMinus
document.getElementById("PWM1MaxMinus").addEventListener('click', () => {
  if (slider.values[1]>Number(slider.values[0])+60){
    document.getElementById("PWM1MaxInput").value= Number(document.getElementById("PWM1MaxInput").value) - 1;
    slider.values[1]-=1;
    document.getElementById("PWM1Max").textContent = Number(document.getElementById("PWM1Max").textContent) - 1;
    slider.fillColor();
  }
});
document.getElementById("PWM1MaxMinus").addEventListener('mousedown', () => {
  PWM1MaxMinusPress = setInterval(() => {
    if (slider.values[1]>Number(slider.values[0])+60){
      document.getElementById("PWM1MaxInput").value= Number(document.getElementById("PWM1MaxInput").value) - 1;
      slider.values[1]-=1;
      document.getElementById("PWM1Max").textContent = Number(document.getElementById("PWM1Max").textContent) - 1;
      slider.fillColor();
    }
  }, 200);
});
document.getElementById("PWM1MaxMinus").addEventListener('mouseup', () => {  clearInterval(PWM1MaxMinusPress); });
document.getElementById("PWM1MaxMinus").addEventListener('mouseleave', () => {  clearInterval(PWM1MaxMinusPress); });

//PWM1MaxPlus
document.getElementById("PWM1MaxPlus").addEventListener('click', () => {
  if (slider.values[1]<600){
  document.getElementById("PWM1MaxInput").value= Number(document.getElementById("PWM1MaxInput").value) + 1;
  slider.values[1]+=1;
  document.getElementById("PWM1Max").textContent= Number(document.getElementById("PWM1Max").textContent) + 1;
  slider.fillColor();
  }
});
document.getElementById("PWM1MaxPlus").addEventListener('mousedown', () => {
  PWM1MaxPlusPress = setInterval(() => {
    if (slider.values[1]<600){
      document.getElementById("PWM1MaxInput").value= Number(document.getElementById("PWM1MaxInput").value) + 1;
      slider.values[1]+=1;
      document.getElementById("PWM1Max").textContent= Number(document.getElementById("PWM1Max").textContent) + 1;
      slider.fillColor();
    }
  }, 200);
});
document.getElementById("PWM1MaxPlus").addEventListener('mouseup', () => {  clearInterval(PWM1MaxPlusPress);  });
document.getElementById("PWM1MaxPlus").addEventListener('mouseleave', () => {  clearInterval(PWM1MaxPlusPress);  });




//PWM2MinMinus
document.getElementById("PWM2MinMinus").addEventListener('click', () => {
  if (slider2.values[0]>0){
    document.getElementById("PWM2MinInput").value= Number(document.getElementById("PWM2MinInput").value) - 1;
    slider2.values[0]-=1;
    document.getElementById("PWM2Min").textContent = Number(document.getElementById("PWM2Min").textContent) - 1;
    slider2.fillColor();
  }
});
document.getElementById("PWM2MinMinus").addEventListener('mousedown', () => {
  PWM2MinMinusPress = setInterval(() => {
    if (slider2.values[0]>0){
      document.getElementById("PWM2MinInput").value= Number(document.getElementById("PWM2MinInput").value) - 1;
      slider2.values[0]-=1;
      document.getElementById("PWM2Min").textContent = Number(document.getElementById("PWM2Min").textContent) - 1;
      slider2.fillColor();
    }
  }, 200);
});
document.getElementById("PWM2MinMinus").addEventListener('mouseup', () => {
  clearInterval(PWM2MinMinusPress);
});
document.getElementById("PWM2MinMinus").addEventListener('mouseleave', () => {
  clearInterval(PWM2MinMinusPress);
});

//PWM2MinPlus
document.getElementById("PWM2MinPlus").addEventListener('click', () => {
  if (slider2.values[0]<Number(slider2.values[1])-60){
    document.getElementById("PWM2MinInput").value= Number(document.getElementById("PWM2MinInput").value) + 1;
    slider2.values[0]+=1;
    document.getElementById("PWM2Min").textContent= Number(document.getElementById("PWM2Min").textContent) + 1;
    slider2.fillColor();
  }
});
document.getElementById("PWM2MinPlus").addEventListener('mousedown', () => {
  PWM2MinPlusPress = setInterval(() => {
    if (slider2.values[0]<Number(slider2.values[1])-60){
      document.getElementById("PWM2MinInput").value= Number(document.getElementById("PWM2MinInput").value) + 1;
      slider2.values[0]+=1;
      document.getElementById("PWM2Min").textContent= Number(document.getElementById("PWM2Min").textContent) + 1;
      slider2.fillColor();
    }
  }, 200);
});
document.getElementById("PWM2MinPlus").addEventListener('mouseup', () => {  clearInterval(PWM2MinPlusPress);  });
document.getElementById("PWM2MinPlus").addEventListener('mouseleave', () => {  clearInterval(PWM2MinPlusPress);  });

//PWM2MaxMinus
document.getElementById("PWM2MaxMinus").addEventListener('click', () => {
  if (slider2.values[1]>Number(slider2.values[0])+60){
    document.getElementById("PWM2MaxInput").value= Number(document.getElementById("PWM2MaxInput").value) - 1;
    slider2.values[1]-=1;
    document.getElementById("PWM2Max").textContent = Number(document.getElementById("PWM2Max").textContent) - 1;
    slider2.fillColor();
  }
});
document.getElementById("PWM2MaxMinus").addEventListener('mousedown', () => {
  PWM2MaxMinusPress = setInterval(() => {
    if (slider2.values[1]>Number(slider2.values[0])+60){
      document.getElementById("PWM2MaxInput").value= Number(document.getElementById("PWM2MaxInput").value) - 1;
      slider2.values[1]-=1;
      document.getElementById("PWM2Max").textContent = Number(document.getElementById("PWM2Max").textContent) - 1;
      slider2.fillColor();
    }
  }, 200);
});
document.getElementById("PWM2MaxMinus").addEventListener('mouseup', () => {  clearInterval(PWM2MaxMinusPress); });
document.getElementById("PWM2MaxMinus").addEventListener('mouseleave', () => {  clearInterval(PWM2MaxMinusPress); });

//PWM2MaxPlus
document.getElementById("PWM2MaxPlus").addEventListener('click', () => {
  if (slider2.values[1]<600){
    document.getElementById("PWM2MaxInput").value= Number(document.getElementById("PWM2MaxInput").value) + 1;
    slider2.values[1]+=1;
    document.getElementById("PWM2Max").textContent= Number(document.getElementById("PWM2Max").textContent) + 1;
    slider2.fillColor();
  }
});
document.getElementById("PWM2MaxPlus").addEventListener('mousedown', () => {
  PWM2MaxPlusPress = setInterval(() => {
    if (slider2.values[1]<600){
      document.getElementById("PWM2MaxInput").value= Number(document.getElementById("PWM2MaxInput").value) + 1;
      slider2.values[1]+=1;
      document.getElementById("PWM2Max").textContent= Number(document.getElementById("PWM2Max").textContent) + 1;
      slider2.fillColor();
    }
  }, 200);
});
document.getElementById("PWM2MaxPlus").addEventListener('mouseup', () => {  clearInterval(PWM2MaxPlusPress);  });
document.getElementById("PWM2MaxPlus").addEventListener('mouseleave', () => {  clearInterval(PWM2MaxPlusPress);  });

//Proste funkcje przycisków polityki prywatnosci i pomocy
document.getElementById("PWMCancel").addEventListener('click', () => {  location.reload();  }); 

document.getElementById("PWMSubmit").addEventListener('click', () => {
  PWMSubmit();
  document.getElementById("saveInfoContainer").style.display = 'flex';
  setTimeout(() => {
    document.getElementById("saveInfoContainer").style.display = 'none';
  }, 5000)
  
}); 

document.getElementById("closeSaveInfoButton").addEventListener('click', () => {
  document.getElementById("saveInfoContainer").style.display = 'none';
}); 

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

document.getElementById("updateSystemButton").addEventListener('click', () => {
  document.getElementById("updateConfirmationContainer").style.display = 'flex';
});

document.getElementById("closeUpdateConfirmationButton").addEventListener('click', () => {
  document.getElementById("updateConfirmationContainer").style.display = 'none';
});

document.getElementById("updateConfirmationButton").addEventListener('click', requestUpdate);

document.getElementById("internetConnectionButton").addEventListener('click', () => {
  document.getElementById("internetConnectionContainer").style.display = 'flex';
});

document.getElementById("closeInternetConnectionButton").addEventListener('click', () => {
  document.getElementById("internetConnectionContainer").style.display = 'none';
});

//ograniczenie wartości liczbowych
document.getElementById('sweptDiameter').addEventListener('input', function () {
  const maxLength = 5; // Maksymalna liczba cyfr
  if (this.value.length > maxLength) {
    this.value = this.value.slice(0, maxLength);
  }
});

// Ustawienie limitu czasu na 30 minut (1800000 milisekund)
var czasNieaktywnosci = 1800000;

// Funkcja do resetowania timera
var timer;

function resetTimer() {
    clearTimeout(timer);
    timer = setTimeout(function() {
        window.location.reload();  // Przeładowanie strony
    }, czasNieaktywnosci);
}

// Wywołanie funkcji resetTimer przy różnych rodzajach aktywności
window.onload = resetTimer;
window.onmousemove = resetTimer;
window.onmousedown = resetTimer;  // Obsługuje kliknięcia myszą
window.ontouchstart = resetTimer; // Obsługuje dotknięcia ekranu
window.onclick = resetTimer;      // Obsługuje kliknięcia
window.onkeypress = resetTimer;   // Obsługuje naciśnięcia klawiszy
window.addEventListener('scroll', resetTimer, true); // Obsługuje przewijanie