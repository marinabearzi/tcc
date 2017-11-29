/*
-----------------------------------------------------------------------------
Functions to open and close menu
-----------------------------------------------------------------------------
*/
function menu_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}
function menu_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}
function menu_list(item) {
    var x = document.getElementById(item);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        x.previousElementSibling.className += " w3-green";
    } else { 
        x.className = x.className.replace(" w3-show", "");
        x.previousElementSibling.className = 
        x.previousElementSibling.className.replace(" w3-green", "");
    }
}
/*
-----------------------------------------------------------------------------
Functions to adjust file
-----------------------------------------------------------------------------
*/

function element(name,content,attributes){
    var att_str = ''
    if (attributes) { // tests false if this arg is missing!
        att_str = formatAttributes(attributes)
    }
    var xml
    if (!content){
        xml='<' + name + att_str + '/>'
    }
    else {
        xml='<' + name + att_str + '>' + content + '</'+name+'>'
    }
    return xml
}
var APOS = "'"; QUOTE = '"'
var ESCAPED_QUOTE = {  }
ESCAPED_QUOTE[QUOTE] = '&quot;'
ESCAPED_QUOTE[APOS] = '&apos;'
   
/*
   Format a dictionary of attributes into a string suitable
   for inserting into the start tag of an element.  Be smart
   about escaping embedded quotes in the attribute values.
*/
function formatAttributes(attributes) {
    var att_value
    var apos_pos, quot_pos
    var use_quote, escape, quote_to_escape
    var att_str
    var re
    var result = ''
   
    for (var att in attributes) {
        att_value = attributes[att]
        
        // Find first quote marks if any
        apos_pos = att_value.indexOf(APOS)
        quot_pos = att_value.indexOf(QUOTE)
       
        // Determine which quote type to use around 
        // the attribute value
        if (apos_pos == -1 && quot_pos == -1) {
            att_str = ' ' + att + "='" + att_value +  "'"
            result += att_str
            continue
        }
        
        // Prefer the single quote unless forced to use double
        if (quot_pos != -1 && quot_pos < apos_pos) {
            use_quote = APOS
        }
        else {
            use_quote = QUOTE
        }
   
        // Figure out which kind of quote to escape
        // Use nice dictionary instead of yucky if-else nests
        escape = ESCAPED_QUOTE[use_quote]
        
        // Escape only the right kind of quote
        re = new RegExp(use_quote,'g')
        att_str = ' ' + att + '=' + use_quote + 
            att_value.replace(re, escape) + use_quote
        result += att_str
    }
    return result
}
function test() {   
    var atts = {att1:"a1", 
        att2:"This is in \"double quotes\" and this is " +
         "in 'single quotes'",
        att3:"This is in 'single quotes' and this is in " +
         "\"double quotes\""}
    
    // Basic XML example
    // alert(element('elem','This is a test'))
   
    // Nested elements
    var xml = element('p', 'This is ' + 
    element('strong','Bold Text') + 'inline')
    // alert(xml)
   
    // Attributes with all kinds of embedded quotes
    // alert(element('elem','This is a test', atts))
   
    // Empty element version
    // alert(element('elem','', atts))    
}
/*
-----------------------------------------------------------------------------
Functions to create files
-----------------------------------------------------------------------------
*/

function createFile(){

var fileName = document.getElementById("fileName").value
var simTime = document.getElementById("simTime").value
var updateInterval = document.getElementById("updateInterval").value

var structure = "\
[General]\n\
cmdenv-express-mode = true\n\
cmdenv-autoflush = true\n\
cmdenv-status-frequency = 0.1s\n\
**.cmdenv-log-level = info\n\
\n\
ned-path = .\n\
image-path = ../../images\n\
\n\
network = RSUExampleScenario\n\
\n\
##########################################################\n\
#            Simulation parameters                       #\n\
##########################################################\n\
debug-on-errors = true\n\
print-undisposed = false\n\
\n\
sim-time-limit = "+simTime+"s\n\
\n\
**.scalar-recording = true\n\
**.vector-recording = true\n\
\n\
**.debug = false\n\
**.coreDebug = false\n\
\n\
*.playgroundSizeX = 2500m\n\
*.playgroundSizeY = 2500m\n\
*.playgroundSizeZ = 50m\n\
\n\
\n\
##########################################################\n\
# Annotation parameters                                  #\n\
##########################################################\n\
*.annotations.draw = true\n\
\n\
##########################################################\n\
# Obstacle parameters                                    #\n\
##########################################################\n\
*.obstacles.debug = false\n\
*.obstacles.obstacles = xmldoc(\"config.xml\", \"//AnalogueModel[@type='SimpleObstacleShadowing']/obstacles\")\n\
\n\
##########################################################\n\
#            TraCIScenarioManager parameters             #\n\
##########################################################\n\
*.manager.updateInterval = "+updateInterval+"s\n\
*.manager.host = \"localhost\"\n\
*.manager.port = 9999\n\
*.manager.autoShutdown = true\n\
*.manager.launchConfig = xmldoc(\""+fileName+".launchd.xml\")\n\
\n\
##########################################################\n\
#                       RSU SETTINGS                     #\n\
#                                                        #\n\
#                                                        #\n\
##########################################################\n\
*.rsu[0].mobility.x = 2000\n\
*.rsu[0].mobility.y = 2000\n\
*.rsu[0].mobility.z = 3\n\
\n\
*.rsu[*].applType = \"TraCIDemoRSU11p\"\n\
*.rsu[*].appl.headerLength = 80 bit\n\
*.rsu[*].appl.sendBeacons = true\n\
*.rsu[*].appl.dataOnSch = false\n\
*.rsu[*].appl.beaconInterval = 1s\n\
*.rsu[*].appl.beaconUserPriority = 7\n\
*.rsu[*].appl.dataUserPriority = 5\n\
\n\
##########################################################\n\
#            11p specific parameters                     #\n\
#                                                        #\n\
#                    NIC-Settings                        #\n\
##########################################################\n\
*.connectionManager.sendDirect = true\n\
*.connectionManager.maxInterfDist = 2600m\n\
*.connectionManager.drawMaxIntfDist = false\n\
\n\
*.**.nic.mac1609_4.useServiceChannel = false\n\
\n\
*.**.nic.mac1609_4.txPower = 20mW\n\
*.**.nic.mac1609_4.bitrate = 6Mbps\n\
*.**.nic.phy80211p.sensitivity = -89dBm\n\
\n\
*.**.nic.phy80211p.useThermalNoise = true\n\
*.**.nic.phy80211p.thermalNoise = -110dBm\n\
\n\
*.**.nic.phy80211p.decider = xmldoc(\"config.xml\")\n\
*.**.nic.phy80211p.analogueModels = xmldoc(\"config.xml\")\n\
*.**.nic.phy80211p.usePropagationDelay = true\n\
\n\
*.**.nic.phy80211p.antenna = xmldoc(\"antenna.xml\", \"/root/Antenna[@id='monopole']\")\n\
\n\
##########################################################\n\
#                    WaveAppLayer                        #\n\
##########################################################\n\
*.node[*].applType = \"TraCIDemo11p\"\n\
*.node[*].appl.headerLength = 80 bit\n\
*.node[*].appl.sendBeacons = true\n\
*.node[*].appl.dataOnSch = false\n\
*.node[*].appl.beaconInterval = 1s\n\
\n\
##########################################################\n\
#                      Mobility                          #\n\
##########################################################\n\
*.node[*].veinsmobilityType.debug = true\n\
*.node[*].veinsmobility.x = 0\n\
*.node[*].veinsmobility.y = 0\n\
*.node[*].veinsmobility.z = 1.895\n\
*.node[*0].veinsmobility.accidentCount = 0\n\
*.node[*0].veinsmobility.accidentStart = 75s\n\
*.node[*0].veinsmobility.accidentDuration = 50s\n\
\n\
[Config WithoutChannelSwitching]\n\
\n\
[Config WithChannelSwitching]\n\
*.**.nic.mac1609_4.useServiceChannel = true\n\
*.node[*].appl.dataOnSch = true\n\
*.rsu[*].appl.dataOnSch = true\n\
"

    
	var file = new File([structure], {type: "application/xml;charset==utf-8"});
    saveAs(file, "omnetpp.ini");
}