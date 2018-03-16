#include "MicroBit.h"
MicroBit uBit;

#define EVENT_ID    8888
#define RedOn   18
#define RedOff  19

#define GreenOn   20
#define GreenOff  21

#define BlueOn   22
#define BlueOff  23

#define allOff  28

bool runRed = false;
bool runGreen = false;
bool runBlue = false;
bool runOff = false;

void onConnected(MicroBitEvent) {
  //uBit.display.print("C");
}

 
void onDisconnected(MicroBitEvent){
  //uBit.display.print("D");
}


void onControllerEvent(MicroBitEvent e) {
  //uBit.display.print(e.value);

  if (e.value == RedOn)  
    runRed = true;
 
  if (e.value == RedOff)   
    runRed = false;

  if (e.value == GreenOn)  
    runGreen = true;
 
  if (e.value == GreenOff)   
    runGreen = false;

   if (e.value == BlueOn)  
    runBlue = true;
 
  if (e.value == BlueOff)   
    runBlue = false;

  if (e.value == allOff)   
    runOff = true;

}

void showHeart() {
  while (1) {
    if (runRed) {
      uBit.io.P0.setAnalogValue(1023);
      uBit.io.P2.setAnalogValue(1023);
      uBit.io.P1.setAnalogValue(0); 
     }
    
    if (runGreen) {
      uBit.io.P2.setAnalogValue(0); 
      uBit.io.P0.setAnalogValue(1023); 
      uBit.io.P1.setAnalogValue(1023); 
    }

    if (runBlue) {
      uBit.io.P0.setAnalogValue(0); 
      uBit.io.P1.setAnalogValue(1023);
      uBit.io.P2.setAnalogValue(1023);  
    }

    if (runOff) {
      uBit.io.P0.setAnalogValue(1023); 
      uBit.io.P1.setAnalogValue(1023); 
      uBit.io.P2.setAnalogValue(1023); 
      runOff = false;
    }

    uBit.sleep(500);    
  }
}

int main() {
    uBit.init();
    uBit.display.scroll("DC");
    create_fiber(showHeart);

    new MicroBitIOPinService(*uBit.ble, uBit.io);

    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, onConnected);
    uBit.messageBus.listen(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, onDisconnected);
    uBit.messageBus.listen(EVENT_ID, MICROBIT_EVT_ANY, onControllerEvent);

    
    release_fiber();
}
