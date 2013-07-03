
int backSensor = 0;  
int frontSensor = 1;
int output = 9;

int threshold = 600;
int val; 
int val2;

boolean isSitting = false;

void setup() 
{ 
  Serial.begin(9600);
  
} 

void loop() 
{ 
  //wait until a serial connection is available
  while (!Serial) ;
  
  writeOutputs(false);
  delay(500); 
}

//this is called when the arduion re-connects
void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read(); //clean out the buffer
  }
  //only write output once
  writeOutputs(true);
}

//retruns the valus
void writeOutputs(boolean forceWrite) {
  // reads the value of the potentiometers (value between 0 and 1023) 
  val = analogRead(backSensor);            
  val2 = analogRead(frontSensor);
  if ((val >= threshold || val2 >= threshold) && (!isSitting || forceWrite)){
     digitalWrite(output, HIGH);
     Serial.println(1);
     isSitting = true;
  }else if (val < threshold && val2 < threshold && (isSitting || forceWrite)){
     digitalWrite(output, LOW);
     Serial.println(0);
     isSitting = false;
  }
}

