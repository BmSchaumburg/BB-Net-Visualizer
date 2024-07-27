1, either move the fullscan.js to your BB folder, or copy the script in to bb "nano fullscript.js"

2, ensure you have "node.js" installed on your computer can get from the node.js website

3, in command prompt first type "npm install helmet cors express body-parser" to retrieve the packages neccesary (make sure to run that command in the folder you want to run your local server)

4, in the same command shell, type "node server.js" (server.js should be in the same folder as the packages retrieved earlier) 
   if everything is working so far, the command should print "listening on port 30001, or whatever port you choose in the server.js)

5, open fullscan.html in your web browser

6, in BB, from home, run fullscan.js (the terminal should print a crude outline of the discovered network)

7, go back to your browser and refresh. A detailed server list should be displayed, showing money, ram, cores, security, difficulty, and if theres root access. Scroll all the way down to see the web visualization.


Troubleshooting: If nothing displays on the browser, press f12 (in firefox) to view the debugger terminal. If the packages werent installed correctly or if theyre in the wrong location, the terminal should reflect that.
   
