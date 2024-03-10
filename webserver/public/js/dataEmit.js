/*
    Autor: Piotr Gliński

    Funkcja zawiera wszystkie skrypty do wysyłu danych z klienta przeglądarki na serwer
*/

document.getElementById("PWMFull").addEventListener('click', () => PWMFull());
document.getElementById("PWMStop").addEventListener('click', () => PWMStop());
document.getElementById("PWMSubmit").addEventListener('click', () => PWMSubmit());
//document.getElementById("stop").addEventListener('click', () => PWMSubmit());

//zmiana hamowania / obciązenia pwm
function PWMFull(){ socket.emit('clientData', {type: 'PWMState',value:1});  }
function PWMStop(){ socket.emit('clientData', {type: 'PWMState',value:2});  }
function fanBreak(){ socket.emit('clientData', {type: 'breakToggle'})}

//Zapis danych z ustawień
function PWMSubmit()
{
    socket.emit('clientData', {type: 'config', 
    PWM1Min: document.getElementById("PWM1Min").textContent, 
    PWM1Max: document.getElementById("PWM1Max").textContent, 
    PWM2Min: document.getElementById("PWM2Min").textContent, 
    PWM2Max: document.getElementById("PWM2Max").textContent,
    //offGrid: document.getElementById('offGridCheckBox').checked, 
    //Akumulator: document.getElementById('AkumulatorCheckBox').checked, 
    //PWM1: document.getElementById('PWM1CheckBox').checked, 
    //PWM2: document.getElementById('PWM2CheckBox').checked, 
    //sweptDiameter: document.getElementById('sweptDiameter').valueAsNumber, 
    //powerCoefficient: document.getElementsById('powerCoefficient').valueAsNumber
    });
}

