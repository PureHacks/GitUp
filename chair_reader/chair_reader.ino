
int backSensor = 0;  
int frontSensor = 1;
int output = 9;

int val; 
int val2;

boolean isSitting = false;

void setup() 
{ 
  Serial.begin(9600);
} 

void loop() 
{ 
  val = analogRead(backSensor);            // reads the value of the potentiometer (value between 0 and 1023) 
  val2 = analogRead(frontSensor);
  
  if ((val >= 600 || val2 >= 600) && !isSitting){
     digitalWrite(output, HIGH);
     Serial.println(1);
     isSitting = true;
  }else if (val < 600 && val2 < 600 && isSitting){
     digitalWrite(output, LOW);
     Serial.println(0);
     isSitting = false;
  }
  delay(500); 
} 

