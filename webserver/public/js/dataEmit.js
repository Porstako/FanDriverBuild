/*
    Autor: Piotr Gliński

    Funkcja zawiera wszystkie skrypty do wysyłu danych z klienta przeglądarki na serwer
*/

document.getElementById("PWMFull").addEventListener('click', () => PWMFull());
document.getElementById("PWMStop").addEventListener('click', () => PWMStop());
document.getElementById("stop").addEventListener('click', () => fanBreak());

//zmiana hamowania / obciązenia pwm
function PWMFull(){ socket.emit('clientData', {type: 'PWMState',value:1});  }
function PWMStop(){ socket.emit('clientData', {type: 'PWMState',value:2});  }
function fanBreak(){ socket.emit('clientData', {type: 'breakToggle'});  }

//Zapis danych z ustawień
//funkcja wykorzystywana w js.js aby nie dodawać dwóch listenerów
function PWMSubmit()
{
    socket.emit('clientData', {type: 'config', 
    PWM1Min: document.getElementById("PWM1Min").textContent, 
    PWM1Max: document.getElementById("PWM1Max").textContent, 
    PWM2Min: document.getElementById("PWM2Min").textContent, 
    PWM2Max: document.getElementById("PWM2Max").textContent,
    offGrid: document.getElementById('offGridCheckBox').checked, 
    Akumulator: document.getElementById('AkumulatorCheckBox').checked, 
    sweptDiameter: document.getElementById('sweptDiameter').valueAsNumber, 
    powerCoefficient: document.getElementById('powerCoefficient').valueAsNumber
    });
}

