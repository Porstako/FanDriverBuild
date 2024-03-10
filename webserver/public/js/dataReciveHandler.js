/*
  Autor: Piotr Gliński
*/

//Plik który odbiera dane z serwera i wyświetla je w przglądarce

const serverAddress = window.location.hostname;
const socket = io();
document.getElementById('ipAdress').textContent = serverAddress;

// odbior danych "pythonData" //
socket.on('pythonData', (data) => {
  if(data.type && data.value !== undefined) {
    if(data.type === 'volt') {
      document.getElementById('Volt').textContent = data.value;
    } else if(data.type === 'amper') {
      document.getElementById('Amper').textContent = data.value;
    } else if(data.type === 'watt') {
      document.getElementById('Watt').textContent = data.value;
    } else if(data.type === 'PWM1Percentage'){
      document.getElementById('PWM1Percentage').textContent = data.value;
      let x = 0.5 + (data.value*0.005);
      document.getElementById('PWM1GaugeNotFill').style.transform = `rotate(${x}turn)`;
    } else if(data.type === 'PWM2Percentage'){
      document.getElementById('PWM2Percentage').textContent = data.value;
      let x = 0.5 + (data.value*0.005);
      document.getElementById('PWM2GaugeNotFill').style.transform = `rotate(${x}turn)`;
    } else if(data.type === 'PWMValue'){
      // Obsługa diod na podstawie danych wracających
      if (data.value === 1){
        document.getElementById('PWMFullDiode').style.background = 'radial-gradient(#ff0000ff, #ff000040)';
        document.getElementById('PWMStopDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
        document.getElementById('PWMAutoDiode').style.background = 'radial-gradient(#00ff0030, #00ff0040)';
      } else if(data.value === 2){
        document.getElementById('PWMFullDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
        document.getElementById('PWMStopDiode').style.background = 'radial-gradient(#ff0000ff, #ff000040)';
        document.getElementById('PWMAutoDiode').style.background = 'radial-gradient(#00ff0030, #00ff0040)';
      } else{
        document.getElementById('PWMFullDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
        document.getElementById('PWMStopDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
        document.getElementById('PWMAutoDiode').style.background = 'radial-gradient(#00ff00ff, #00ff0040)';
      }
    } else if (data.type === 'serialNumber'){
      document.getElementById('serialNumber').textContent = data.value;
    } else if (data.type === 'lineVoltage'){
      document.getElementById('lineVoltage').textContent = data.value;
      if (data.value>252 || data.value<100){
        document.getElementById('lineVoltageRedDiode').style.background = 'radial-gradient(#ff0000ff, #ff000040)';
        document.getElementById('lineVoltageGreenDiode').style.background = 'radial-gradient(#00ff0030, #ff000040)';
      } else {
        document.getElementById('lineVoltageRedDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
        document.getElementById('lineVoltageGreenDiode').style.background = 'radial-gradient(#00ff00ff, #ff000040)';
      }
    } else if (data.type === 'overload'){
      if (data.value == 1){
        document.getElementById('overloadDiode').style.background = 'radial-gradient(#ff0000ff, #ff000040)';
      }
      else {
        document.getElementById('overloadDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
      }
    } else if (data.type === 'windSpeed'){
      document.getElementById('windSpeed').textContent = data.value;
      if (data.value>1) {
        document.getElementById('windSpeedGreenDiode').style.background = 'radial-gradient(#00ff00ff, #ff000040)';
        document.getElementById('windSpeedRedDiode').style.background = 'radial-gradient(#ff000030, #ff000040)';
      } else {
        document.getElementById('windSpeedGreenDiode').style.background = 'radial-gradient(#00ff0030, #ff000040)';
        document.getElementById('windSpeedRedDiode').style.background = 'radial-gradient(#ff0000ff, #ff000040)';
      }
    } else if (data.type === 'kWh'){
      document.getElementById('kWhValue').textContent = data.value;
    }


  }
});

// odbior danych "PWMData"//
socket.on('PWMData', (data) =>{
  if (data.type === 'PWMMinMax'){
    document.getElementById("PWM1MinInput").value=data.PWM1Min;
    document.getElementById("PWM1MaxInput").value=data.PWM1Max;
    document.getElementById("PWM2MinInput").value=data.PWM2Min;
    document.getElementById("PWM2MaxInput").value=data.PWM2Max;
    slider.values[0]=data.PWM1Min;
    slider.values[1]=data.PWM1Max;
    slider2.values[0]=data.PWM2Min;
    slider2.values[1]=data.PWM2Max;
    document.getElementById("PWM1Min").textContent=data.PWM1Min;
    document.getElementById("PWM1Max").textContent=data.PWM1Max;
    document.getElementById("PWM2Min").textContent=data.PWM2Min;
    document.getElementById("PWM2Max").textContent=data.PWM2Max;
}
});