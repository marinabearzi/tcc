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
/* Set Global Variables */
var i = 0; 
var j = 0;
var k = 0;
/*
---------------------------------------------
Function to Remove Form Blocks
---------------------------------------------
*/
function removeBlock(parentDiv, id){
    if(parentDiv == "myForm1"){
        var parent = document.getElementById(parentDiv);
        var child = document.getElementById("span_vtype_id_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_vtype_maxspeed_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_vtype_accel_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_vtype_decel_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_vtype_length_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_vtype_mingap_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_vtype_color_" + id);
        parent.removeChild(child);
    } else if (parentDiv == "myForm2"){
        var parent = document.getElementById(parentDiv);
        var child = document.getElementById("span_vehicle_type_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_vehicle_id_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_vehicle_depart_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_vehicle_route_" + id);
        parent.removeChild(child);
    } else if (parentDiv == "myForm3"){
        var parent = document.getElementById(parentDiv);
        var child = document.getElementById("span_route_id_" + id);
        parent.removeChild(child);
        var child = document.getElementById("span_route_edges_" + id);
        parent.removeChild(child);
    }
}
/*
---------------------------------------------
Function to Validate Fields
---------------------------------------------
*/
function validate(){
    for (var aux = 0; aux < i; aux++) {
        if(document.getElementById("vtype_id_"+aux) && document.getElementById("vtype_id_"+aux).value == ""){
            alert( "Please provide a vehicle type id!" );
            document.getElementById("vtype_id_"+aux).focus() ;
            return false;
        }
        if(document.getElementById("vtype_maxspeed_"+aux) && document.getElementById("vtype_maxspeed_"+aux).value == "" || isNaN(document.getElementById("vtype_maxspeed_"+aux).value)){
            alert( "Please provide a maximum speed!" );
            document.getElementById("vtype_maxspeed_"+aux).focus();
            return false;
        }
        if(document.getElementById("vtype_accel_"+aux) && document.getElementById("vtype_accel_"+aux).value == "" || isNaN(document.getElementById("vtype_accel_"+aux).value)){
            alert( "Please provide an acceleration!" );
            document.getElementById("vtype_accel_"+aux).focus();
            return false;
        }
        if(document.getElementById("vtype_decel_"+aux) && document.getElementById("vtype_decel_"+aux).value == "" || isNaN(document.getElementById("vtype_decel_"+aux).value)){
            alert( "Please provide a decceleration!" );
            document.getElementById("vtype_decel_"+aux).focus();
            return false;
        }
        if(document.getElementById("vtype_length_"+aux) && document.getElementById("vtype_length_"+aux).value == "" || isNaN(document.getElementById("vtype_length_"+aux).value)){
            alert( "Please provide a length!" );
            document.getElementById("vtype_length_"+aux).focus();
            return false;
        }
        if(document.getElementById("vtype_mingap_"+aux) && document.getElementById("vtype_mingap_"+aux).value == "" || isNaN(document.getElementById("vtype_mingap_"+aux).value)){
            alert( "Please provide a safe distance!" );
            document.getElementById("vtype_mingap_"+aux).focus();
            return false;
        }
        if(document.getElementById("vtype_color_"+aux) && document.getElementById("vtype_color_"+aux).value == ""){
            alert( "Please provide a color!" );
            document.getElementById("vtype_color_"+aux).focus();
            return false;
        }
    }
    for (var aux = 0; aux < j; aux++) {
        if(document.getElementById("vehicle_type_"+aux) && document.getElementById("vehicle_type_"+aux).value == ""){
            alert( "Please provide a vehicle type!" );
            document.getElementById("vehicle_type_"+aux).focus() ;
            return false;
        }
        if(document.getElementById("vehicle_id_"+aux) && document.getElementById("vehicle_id_"+aux).value == ""){
            alert( "Please provide a vehicle id!" );
            document.getElementById("vehicle_id_"+aux).focus();
            return false;
        }
        if(document.getElementById("vehicle_depart_"+aux) && document.getElementById("vehicle_depart_"+aux).value == "" || isNaN(document.getElementById("vehicle_depart_"+aux).value)){
            alert( "Please provide a departure time!" );
            document.getElementById("vehicle_depart_"+aux).focus();
            return false;
        }
        if(document.getElementById("vehicle_route_"+aux) && document.getElementById("vehicle_route_"+aux).value == ""){
            alert( "Please provide a route!" );
            document.getElementById("vehicle_route_"+aux).focus();
            return false;
        }
    }
    for (var aux = 0; aux < k; aux++) {
        if(document.getElementById("route_id_"+aux) && document.getElementById("route_id_"+aux).value == ""){
            alert( "Please provide a route id!" );
            document.getElementById("route_id_"+aux).focus() ;
            return false;
        }
        if(document.getElementById("route_edges_"+aux) && document.getElementById("route_edges_"+aux).value == ""){
            alert( "Please provide route edges!" );
            document.getElementById("route_edges_"+aux).focus();
            return false;
        }
    }
     
     return true;
}
/*
----------------------------------------------------------------------------
Vehicle Type Function
----------------------------------------------------------------------------
*/
function vehicleTypeFunction(){

var span1 = document.createElement('span');
var input1 = document.createElement("INPUT");
var blank1 = document.createElement('br');
span1.innerHTML = "Vehicle Type Id"+"<br>";
input1.setAttribute("type", "text");
input1.setAttribute("onblur", "addVehicleType(this)");
var image1 = document.createElement("IMG");
image1.setAttribute("src", "delete.png");
image1.setAttribute("style", "width:20px;margin-bottom:4px;margin-left:2.5px");
input1.setAttribute("id", "vtype_id_" + i);
span1.appendChild(input1);
image1.setAttribute("onclick", "removeBlock('myForm1'," + i + ")");
span1.appendChild(image1);
span1.setAttribute("id", "span_vtype_id_" + i);
span1.appendChild(blank1);
document.getElementById("myForm1").appendChild(span1);


var span2 = document.createElement('span');
var input2 = document.createElement("INPUT");
var blank2 = document.createElement('br');
span2.innerHTML = "Maximum Speed (m/s)"+"<br>";
input2.setAttribute("type", "text");
input2.setAttribute("id", "vtype_maxspeed_" + i);
span2.appendChild(input2);
span2.setAttribute("id", "span_vtype_maxspeed_" + i);
span2.appendChild(blank2);
document.getElementById("myForm1").appendChild(span2);


var span3 = document.createElement('span');
var input3 = document.createElement("INPUT");
var blank3 = document.createElement('br');
span3.innerHTML = "Acceleration (m/s<sup>2</sup>)"+"<br>";
input3.setAttribute("type", "text");
input3.setAttribute("id", "vtype_accel_" + i);
span3.appendChild(input3);
span3.setAttribute("id", "span_vtype_accel_" + i);
span3.appendChild(blank3);
document.getElementById("myForm1").appendChild(span3);


var span4 = document.createElement('span');
var input4 = document.createElement("INPUT");
var blank4 = document.createElement('br');
span4.innerHTML = "Decceleration (m/s<sup>2</sup>)"+"<br>";
input4.setAttribute("type", "text");
input4.setAttribute("id", "vtype_decel_" + i);
span4.appendChild(input4);
span4.setAttribute("id", "span_vtype_decel_" + i);
span4.appendChild(blank4);
document.getElementById("myForm1").appendChild(span4);


var span5 = document.createElement('span');
var input5 = document.createElement("INPUT");
var blank5 = document.createElement('br');
span5.innerHTML = "Length (m)"+"<br>";
input5.setAttribute("type", "text");
input5.setAttribute("id", "vtype_length_" + i);
span5.appendChild(input5);
span5.setAttribute("id", "span_vtype_length_" + i);
span5.appendChild(blank5);
document.getElementById("myForm1").appendChild(span5);


var span6 = document.createElement('span');
var input6 = document.createElement("INPUT");
var blank6 = document.createElement('br');
span6.innerHTML = "Safe Distance (m)"+"<br>";
input6.setAttribute("type", "text");
input6.setAttribute("id", "vtype_mingap_" + i);
span6.appendChild(input6);
span6.setAttribute("id", "span_vtype_mingap_" + i);
span6.appendChild(blank6);
document.getElementById("myForm1").appendChild(span6);


var span7 = document.createElement('span');
var input7 = document.createElement("INPUT");
var blank7 = document.createElement('br');
span7.innerHTML = "Color (RGB)"+"<br>";
input7.setAttribute("type", "text");
input7.setAttribute("id", "vtype_color_" + i);
span7.appendChild(input7);
span7.setAttribute("id", "span_vtype_color_" + i);
span7.appendChild(blank7);
document.getElementById("myForm1").appendChild(span7);

i++;
}
/*
-----------------------------------------------------------------------------
Vehicle Function
-----------------------------------------------------------------------------
*/
function vehicleFunction(){

var span1 = document.createElement('span');
var input1 = document.createElement("select");
var blank1 = document.createElement('br');
span1.innerHTML = "Vehicle Type"+"<br>";

var title = new Option();
title.text = "";
title.selected=true;
title.disabled=true;
input1.options.add(title);


for (var opt = 0; opt < i; opt++) {
    var op = new Option();
    if(document.getElementById("vtype_id_" + opt)){
       op.text = document.getElementById("vtype_id_" + opt).value;
        input1.options.add(op);    
    }    
}


var image1 = document.createElement("IMG");
image1.setAttribute("src", "delete.png");
image1.setAttribute("style", "width:20px;margin-bottom:4px;margin-left:2.5px;");
input1.setAttribute("id", "vehicle_type_" + j);
span1.appendChild(input1);
image1.setAttribute("onclick", "removeBlock('myForm2'," + j + ")");
span1.appendChild(image1);
span1.setAttribute("id", "span_vehicle_type_" + j);
span1.appendChild(blank1);
document.getElementById("myForm2").appendChild(span1);


var span2 = document.createElement('span');
var input2 = document.createElement("INPUT");
var blank2 = document.createElement('br');
span2.innerHTML = "Vehicle Id"+"<br>";
input2.setAttribute("type", "text");
input2.setAttribute("id", "vehicle_id_" + j);
span2.appendChild(input2);
span2.setAttribute("id", "span_vehicle_id_" + j);
span2.appendChild(blank2);
document.getElementById("myForm2").appendChild(span2);


var span3 = document.createElement('span');
var input3 = document.createElement("INPUT");
var blank3 = document.createElement('br');
span3.innerHTML = "Departure Time (s)"+"<br>";
input3.setAttribute("type", "text");
input3.setAttribute("id", "vehicle_depart_" + j);
span3.appendChild(input3);
span3.setAttribute("id", "span_vehicle_depart_" + j);
span3.appendChild(blank3);
document.getElementById("myForm2").appendChild(span3);


var span4 = document.createElement('span');
var input4 = document.createElement("select");
var blank4 = document.createElement('br');
span4.innerHTML = "Route"+"<br>";

input4.options.add(title);

for (var opt = 0; opt < k; opt++) {
    var op = new Option();
    if(document.getElementById("route_id_" + opt)){
        op.text = document.getElementById("route_id_" + opt).value;
        input4.options.add(op);
    }   
}

input4.setAttribute("id", "vehicle_route_" + j);
span4.appendChild(input4);
span4.setAttribute("id", "span_vehicle_route_" + j);
span4.appendChild(blank4);
document.getElementById("myForm2").appendChild(span4);

j++;
}
/*
-----------------------------------------------------------------------------
Route Function
-----------------------------------------------------------------------------
*/
function routeFunction(){

var span1 = document.createElement('span');
var input1 = document.createElement("INPUT");
var blank1 = document.createElement('br');
span1.innerHTML = "Route Id"+"<br>";
input1.setAttribute("type", "text");
input1.setAttribute("onblur", "addRoute(this)");
var image1 = document.createElement("IMG");
image1.setAttribute("src", "delete.png");
image1.setAttribute("style", "width:20px;margin-bottom:4px;margin-left:2.5px");
input1.setAttribute("id", "route_id_" + k);
span1.appendChild(input1);
image1.setAttribute("onclick", "removeBlock('myForm3'," + k + ")");
span1.appendChild(image1);
span1.setAttribute("id", "span_route_id_" + k);
span1.appendChild(blank1);
document.getElementById("myForm3").appendChild(span1);


var span2 = document.createElement('span');
var input2 = document.createElement("TEXTAREA");
var blank2 = document.createElement('br');
span2.innerHTML = "Edges"+"<br>";
input2.setAttribute("cols", "22");
input2.setAttribute("id", "route_edges_" + k);
span2.appendChild(input2);
span2.setAttribute("id", "span_route_edges_" + k);
span2.appendChild(blank2);
document.getElementById("myForm3").appendChild(span2);

k++;
}
/*
-----------------------------------------------------------------------------
Function to add Vehicle Type to dropdown
-----------------------------------------------------------------------------
*/

function addVehicleType(input) {

    if(j>0) {
       
            for (var opt = 0; opt < j; opt++) {
                if (document.getElementById("vehicle_type_" + opt)) {
                    var input1 = document.getElementById("vehicle_type_" + opt);
                
                     for (var m = 0; m < i; m++) {
                        if (document.getElementById("vtype_id_" + m)) {
                            var inputId = document.getElementById("vtype_id_" + m)
                            if(m == 0){
                            	console.log("input1", input1)
                                input1.options.length = 0
                                var title = new Option();
                                title.text = "";
                                title.selected=true;
                                title.disabled=true;
                                input1.options.add(title);
                            }
                        
                            var op = new Option();
                            op.text = inputId.value;
                            if(inputId.value != ""){
                                input1.options.add(op);
                            }
                        }    
                    }
                }
            }
    }
}

/*
-----------------------------------------------------------------------------
Function to add Route to dropdown
-----------------------------------------------------------------------------
*/

function addRoute(input) {

    if(j>0) {
       
            for (var opt = 0; opt < j; opt++) {
                if (document.getElementById("vehicle_route_" + opt)) {
                    var input1 = document.getElementById("vehicle_route_" + opt);
                
                    for (var m = 0; m < k; m++) {
                        if (document.getElementById("route_id_" + m)) {
                            var inputId = document.getElementById("route_id_" + m)
                            if(m == 0){
                                input1.options.length = 0
                                var title = new Option();
                                title.text = "";
                                title.selected=true;
                                title.disabled=true;
                                input1.options.add(title);
                            }
                        
                            var op = new Option();
                            op.text = inputId.value;
                            if(inputId.value != ""){
                                input1.options.add(op);
                            }    
                        }    
                    }
                }
            }
    }
}


/*
-----------------------------------------------------------------------------
Functions Reset
-----------------------------------------------------------------------------
*/
function resetElements(){
i=0;
j=0;
k=0;
document.getElementById('myForm1').innerHTML = '';
document.getElementById('myForm2').innerHTML = '';
document.getElementById('myForm3').innerHTML = '';
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
Function Create File
-----------------------------------------------------------------------------
*/

function createFile(){
    if (validate()) {
    var filename = document.getElementById("fileName").value
    var objVehicleType = []
    var attVehicleType
    for (var a = 0; a < i; a++){
        if (document.getElementById("vtype_id_" + a)) {
            objVehicleType.push({
                id: document.getElementById("vtype_id_" + a).value,
                maxSpeed: document.getElementById("vtype_maxspeed_" + a).value,
                accel: document.getElementById("vtype_accel_" + a).value,
                decel: document.getElementById("vtype_decel_" + a).value,
                length: document.getElementById("vtype_length_" + a).value,
                minGap: document.getElementById("vtype_mingap_" + a).value,
                color: document.getElementById("vtype_color_" + a).value,
            });
        }
    }
    for (var a = 0; a < objVehicleType.length; a ++){
        if(a == 0){
            attVehicleType = "\n\t" + element('vType', null, objVehicleType[a]) + "\n"
        } else{
             attVehicleType += "\t" + element('vType', null, objVehicleType[a]) + "\n"
        }
    }
    

    var objVehicle = []
    var attVehicle;
    for (var a = 0; a < j; a++){
        if (document.getElementById("vehicle_type_" + a)) {
            objVehicle.push({
                type: document.getElementById("vehicle_type_" + a).value,
                id: document.getElementById("vehicle_id_" + a).value,
                depart: document.getElementById("vehicle_depart_" + a).value,
                route: document.getElementById("vehicle_route_" + a).value,
                
            });
        }
    }
    for (var a = 0; a < objVehicle.length; a ++){
         if(a == 0){
            attVehicle = "\n\t" + element('vehicle', null, objVehicle[a]) + "\n"
        } else{
            attVehicle += "\t" + element('vehicle', null, objVehicle[a]) + "\n"
        }
    }

    var objRoute = []
    var attRoute;
    for (var a = 0; a < k; a++){
        if (document.getElementById("route_id_" + a)) {
            objRoute.push({
                id: document.getElementById("route_id_" + a).value,
                edges: document.getElementById("route_edges_" + a).value,
            });
        }
    }
    for (var a = 0; a < objRoute.length; a ++){
        if(a == 0){
            attRoute = "\n\t" + element('route', null, objRoute[a]) + "\n"
        } else{
            attRoute += "\t" + element('route', null, objRoute[a]) + "\n"
        }
    }
    
    var file = new File([element('routes', [attVehicleType + attRoute + attVehicle], null)], {type: "application/xml;charset==utf-8"});
    saveAs(file, filename + ".rou.xml");
}
}