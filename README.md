# NonAWSCamera

**Most of the steps are similar to the Joystick TCP code here https://github.com/ashishsharmaiit/Joystick_ROS_TCP.git. Highlighting** changes in **bold** in the narrative below.

**This repo sends camera data fom Python that could be in ROS to Browser via p2p udp, after exchanging p2p connections via a server.**

Steps to use this code:

1. Run the server file from the EC2 server with the steps below:

a. Go to EC2 console from web browser, and ensure that the 'robotics' name server is running. If it is not running, run it using 'instance state'. After using, please switch off to save the cost.

b. Once it is running, go to terminal and go the folder where robotics.pem file is saved.

c. type this command from that folder - chmod 400 robotics.pem

d. Go to the EC2 instance and copy the Public DNS server address. It will read like ec2-34-218-222-3.us-west-2.compute.amazonaws.com, and will change with the Public IP address.

e. Then type this command -> ssh -i robotics.pem ubuntu@<replace with public ip address> e.g. ssh -i robotics.pem ubuntu@ec2-34-218-222-3.us-west-2.compute.amazonaws.com -> please note that "ubuntu" in this command will need to be replaced with corresponding value for windows or mac. You might want to google that if you are not using ubuntu.

f. press "yes" in terminal if asked.

g. now you should be have ssh into the EC2 server.

h. Go to signaling-server folder


2. Type the command **node webcamServer.js** to run the server file. The file should be already saved in the server. No need to copy it.

4. Change the server IP address in both the sender and receiver files as per the new IP from EC2. IP refreshes every time server is switched on, if it was off earlier. If it continued to run, then IP address shouldn't have changed.

6. Copy the python file into your src folder **(no need to have roscore and catkin_make like in TCP since this is not on ROS but ROS could be integrated easily)**. Run the python file using **python3 webcam.py**. **Wait for it to establish connection with server. You will see client connected message in the EC2 server terminal
Now, you can move to the next step. Please Note that you should open the python and wait till you see connected sign in terminal before you open the html. It will make a difference for UDP if you don't do this. If you opened python later, just refresh the html once you get websocket connected message in python.**

5. Save both the sender files in the same folder in desktop. Open the sender html file in chrome. Open Inspect/Console to check the logs. 

7. **Select Stun server check box and click on Start. You should see the image now from the other peer.**

8. **To exit python code, you will need to press ctrl-c twice.**
  
10. **Debug Tip - If you exit with ctrl-z or any other process, the camera might still be accessible by python script, and if you run this script again you might get the error, that camera is not accessile. To disable camera being handled by previous process, type lsof /dev/video0 and then you will get process ID (PID), then type kill -9 <PID> and it will kill the process. Then you can do this again.**
