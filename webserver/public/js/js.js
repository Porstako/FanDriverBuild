//Autor: Piotr Gliński

// Główny plik JS strony, czysto frontendowy. Nie odpowiada za żadną transmisję danych

// Oczekiwanie na kliknięcie
document.getElementById("menuButton").addEventListener('click', () => menuToggle());
document.getElementById("menuButton2").addEventListener('click', () => menuToggle());

// Zapobieganie wywołaniu menu kontekstowego prawym przyciskiem myszy
document.addEventListener('contextmenu', function(event) { 
  event.preventDefault();
});



//przyciski + i -


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
  if (slider.values[0]<slider.values[1]){
    document.getElementById("PWM1MinInput").value= Number(document.getElementById("PWM1MinInput").value) + 1;
    slider.values[0]+=1;
    document.getElementById("PWM1Min").textContent= Number(document.getElementById("PWM1Min").textContent) + 1;
    slider.fillColor();
  }
});
document.getElementById("PWM1MinPlus").addEventListener('mousedown', () => {
  PWM1MinPlusPress = setInterval(() => {
    if (slider.values[0]<slider.values[1]){
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
  if (slider.values[1]>slider.values[0]){
    document.getElementById("PWM1MaxInput").value= Number(document.getElementById("PWM1MaxInput").value) - 1;
    slider.values[1]-=1;
    document.getElementById("PWM1Max").textContent = Number(document.getElementById("PWM1Max").textContent) - 1;
    slider.fillColor();
  }
});
document.getElementById("PWM1MaxMinus").addEventListener('mousedown', () => {
  PWM1MaxMinusPress = setInterval(() => {
    if (slider.values[1]>slider.values[0]){
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
  if (slider2.values[0]<slider2.values[1]){
    document.getElementById("PWM2MinInput").value= Number(document.getElementById("PWM2MinInput").value) + 1;
    slider2.values[0]+=1;
    document.getElementById("PWM2Min").textContent= Number(document.getElementById("PWM2Min").textContent) + 1;
    slider2.fillColor();
  }
});
document.getElementById("PWM2MinPlus").addEventListener('mousedown', () => {
  PWM2MinPlusPress = setInterval(() => {
    if (slider2.values[0]<slider2.values[1]){
      document.getElementById("PWM2MinInput").value= Number(document.getElementById("PWM2MinInput").value) + 1;
      slider2.values[0]+=1;
      document.getElementById("PWM2Min").textContent= Number(document.getElementById("PWM2Min").textContent) + 1;
      slider2.fillColor();
    }
  }, 200);
});
document.getElementById("PWM2MinPlus").addEventListener('mouseup', () => {
  clearInterval(PWM2MinPlusPress);
});
document.getElementById("PWM2MinPlus").addEventListener('mouseleave', () => {
  clearInterval(PWM2MinPlusPress);
});


//PWM2MaxMinus
document.getElementById("PWM2MaxMinus").addEventListener('click', () => {
  if (slider2.values[1]>slider2.values[0]){
    document.getElementById("PWM2MaxInput").value= Number(document.getElementById("PWM2MaxInput").value) - 1;
    slider2.values[1]-=1;
    document.getElementById("PWM2Max").textContent = Number(document.getElementById("PWM2Max").textContent) - 1;
    slider2.fillColor();
  }
});
document.getElementById("PWM2MaxMinus").addEventListener('mousedown', () => {
  PWM2MaxMinusPress = setInterval(() => {
    if (slider2.values[1]>slider2.values[0]){
      document.getElementById("PWM2MaxInput").value= Number(document.getElementById("PWM2MaxInput").value) - 1;
      slider2.values[1]-=1;
      document.getElementById("PWM2Max").textContent = Number(document.getElementById("PWM2Max").textContent) - 1;
      slider2.fillColor();
    }
  }, 200);
});
document.getElementById("PWM2MaxMinus").addEventListener('mouseup', () => {
  clearInterval(PWM2MaxMinusPress);
});
document.getElementById("PWM2MaxMinus").addEventListener('mouseleave', () => {
  clearInterval(PWM2MaxMinusPress);
});

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
document.getElementById("PWM2MaxPlus").addEventListener('mouseup', () => {
  clearInterval(PWM2MaxPlusPress);
});
document.getElementById("PWM2MaxPlus").addEventListener('mouseleave', () => {
  clearInterval(PWM2MaxPlusPress);
});

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
document.getElementById("PWMCancel").addEventListener('click', () => {
  location.reload();
}); 

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

//ograniczenie wartości liczbowych
document.getElementById('sweptDiameter').addEventListener('input', function () {
  const maxLength = 5; // Maksymalna liczba cyfr
  if (this.value.length > maxLength) {
    this.value = this.value.slice(0, maxLength);
  }
});
