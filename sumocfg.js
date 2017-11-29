/*
-----------------------------------------------------------------------------
Functions to open and close menu
-----------------------------------------------------------------------------
*/
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
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
    var filename = document.getElementById("fileName").value
    var simTime = document.getElementById("simTime").value
    var updateInterval = document.getElementById("updateInterval").value
	var net = {value: filename + ".net.xml"}
    var rou = {value: filename + ".rou.xml"}
    var add = {value: filename + ".add.xml"}
    var gui = {value: filename + ".settings.xml"}
    var begin = {value:"0"}
    var end = {value:simTime}
    var step = {value:updateInterval}
    var collision = {value:"warn"}
    var start = {value:"true"}


	var file = new File([element('configuration', ["\n\t" + element('input', ["\n\t\t" + element('net-file', null, net) + "\n\t\t" + element('route-files', null, rou) + "\n\t\t" + element('additional-files', null, add) + "\n\t\t" + element('gui-settings-file', null, gui) + "\n\t"], null) + "\n\t" + element('time', ["\n\t\t" + element('begin', null, begin) + "\n\t\t" + element('end', null, end) + "\n\t\t" + element('step-length', null, step) + "\n\t"], null) + "\n\t" + element('processing', "\n\t\t" + element('collision.action', null, collision) + "\n\t", null) + "\n\t" + element('gui_only', "\n\t\t" + element('start', null, start) + "\n\t", null) + "\n"], null)], {type: "application/xml;charset==utf-8"});
    saveAs(file, filename + ".sumocfg");
}