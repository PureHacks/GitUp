
int backSensor = 0;  
int frontSensor = 1;
int output = 9;

int val; 
int val2;

void setup() 
{ 
  Serial.begin(9600);
} 

void loop() 
{ 
  val = analogRead(backSensor);            // reads the value of the potentiometer (value between 0 and 1023) 
  val2 = analogRead(frontSensor);
  
  if (val > 600 || val2 > 600){
     digitalWrite(output, HIGH);
     Serial.println(1);
  }else{
     digitalWrite(output, LOW);
     Serial.println(0);
  }
  //Serial.println(val); 
  //Serial.println(val2); 
  delay(500); 
} 

