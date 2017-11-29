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

function createCCFile(){


var structure = "\
#include <stdlib.h>\n\
\n\
#include \"veins/modules/mobility/traci/TraCIBuffer.h\"\n\
#include \"veins/modules/mobility/traci/TraCICommandInterface.h\"\n\
#include \"veins/modules/mobility/traci/TraCIConnection.h\"\n\
#include \"veins/modules/mobility/traci/TraCIConstants.h\"\n\
#include \"veins/modules/mobility/traci/TraCICoord.h\"\n\
\n\
#ifdef _WIN32\n\
#define realpath(N,R) _fullpath((R),(N),_MAX_PATH)\n\
#endif /* _WIN32 */\n\
\n\
namespace Veins {\n\
\n\
TraCICommandInterface::TraCICommandInterface(TraCIConnection& c) : connection(c)\n\
{\n\
}\n\
\n\
std::pair<uint32_t, std::string> TraCICommandInterface::getVersion() {\n\
    bool success = false;\n\
    TraCIBuffer buf = connection.queryOptional(CMD_GETVERSION, TraCIBuffer(), success);\n\
\n\
    if (!success) {\n\
        ASSERT(buf.eof());\n\
        return std::pair<uint32_t, std::string>(0, \"(unknown)\");\n\
    }\n\
\n\
    uint8_t cmdLength; buf >> cmdLength;\n\
    uint8_t commandResp; buf >> commandResp;\n\
    ASSERT(commandResp == CMD_GETVERSION);\n\
    uint32_t apiVersion; buf >> apiVersion;\n\
    std::string serverVersion; buf >> serverVersion;\n\
    ASSERT(buf.eof());\n\
\n\
    return std::pair<uint32_t, std::string>(apiVersion, serverVersion);\n\
}\n\
\n\
void TraCICommandInterface::Vehicle::setSpeedMode(int32_t bitset) {\n\
    uint8_t variableId = VAR_SPEEDSETMODE;\n\
    uint8_t variableType = TYPE_INTEGER;\n\
    TraCIBuffer buf = traci->connection.query(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << nodeId << variableType << bitset);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::Vehicle::setSpeed(double speed) {\n\
    uint8_t variableId = VAR_SPEED;\n\
    uint8_t variableType = TYPE_DOUBLE;\n\
    TraCIBuffer buf = traci->connection.query(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << nodeId << variableType << speed);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::Vehicle::setColor(const TraCIColor& color) {\n\
    TraCIBuffer p;\n\
    p << static_cast<uint8_t>(VAR_COLOR);\n\
    p << nodeId;\n\
    p << static_cast<uint8_t>(TYPE_COLOR) << color.red << color.green << color.blue << color.alpha;\n\
    TraCIBuffer buf = connection->query(CMD_SET_VEHICLE_VARIABLE, p);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::Vehicle::slowDown(double speed, int32_t time) {\n\
    uint8_t variableId = CMD_SLOWDOWN;\n\
    uint8_t variableType = TYPE_COMPOUND;\n\
    int32_t count = 2;\n\
    uint8_t speedType = TYPE_DOUBLE;\n\
    uint8_t durationType = TYPE_INTEGER;\n\
    TraCIBuffer buf = connection->query(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << nodeId << variableType << count << speedType << speed << durationType << time);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::Vehicle::newRoute(std::string roadId) {\n\
    uint8_t variableId = LANE_EDGE_ID;\n\
    uint8_t variableType = TYPE_STRING;\n\
    TraCIBuffer buf = connection->query(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << nodeId << variableType << roadId);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::Vehicle::setParking() {\n\
    uint8_t variableId = REMOVE;\n\
    uint8_t variableType = TYPE_BYTE;\n\
    uint8_t value = REMOVE_PARKING;\n\
    TraCIBuffer buf = connection->query(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << nodeId << variableType << value);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
std::list<std::string> TraCICommandInterface::getVehicleTypeIds() {\n\
    return genericGetStringList(CMD_GET_VEHICLETYPE_VARIABLE, \"\", ID_LIST, RESPONSE_GET_VEHICLETYPE_VARIABLE);\n\
}\n\
\n\
std::list<std::string> TraCICommandInterface::getRouteIds() {\n\
    return genericGetStringList(CMD_GET_ROUTE_VARIABLE, \"\", ID_LIST, RESPONSE_GET_ROUTE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Road::getCurrentTravelTime() {\n\
    return traci->genericGetDouble(CMD_GET_EDGE_VARIABLE, roadId, VAR_CURRENT_TRAVELTIME, RESPONSE_GET_EDGE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Road::getMeanSpeed() {\n\
    return traci->genericGetDouble(CMD_GET_EDGE_VARIABLE, roadId, LAST_STEP_MEAN_SPEED, RESPONSE_GET_EDGE_VARIABLE);\n\
}\n\
\n\
std::string TraCICommandInterface::Vehicle::getRoadId() {\n\
    return traci->genericGetString(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_ROAD_ID, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
std::string TraCICommandInterface::Vehicle::getCurrentRoadOnRoute() {\n\
    return traci->genericGetString(CMD_GET_VEHICLE_VARIABLE, nodeId, LANE_EDGE_ID, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
std::string TraCICommandInterface::Vehicle::getLaneId() {\n\
    return traci->genericGetString(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_LANE_ID, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
int32_t TraCICommandInterface::Vehicle::getLaneIndex() {\n\
    return traci->genericGetInt(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_LANE_INDEX, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
std::string TraCICommandInterface::Vehicle::getTypeId() {\n\
    return traci->genericGetString(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_TYPE, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Vehicle::getLanePosition() {\n\
    return traci->genericGetDouble(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_LANEPOSITION, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
std::list<std::string> TraCICommandInterface::Vehicle::getPlannedRoadIds() {\n\
    return traci->genericGetStringList(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_EDGES, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
std::string TraCICommandInterface::Vehicle::getRouteId() {\n\
    return traci->genericGetString(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_ROUTE_ID, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
std::list<std::string> TraCICommandInterface::Route::getRoadIds() {\n\
    return traci->genericGetStringList(CMD_GET_ROUTE_VARIABLE, routeId, VAR_EDGES, RESPONSE_GET_ROUTE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Vehicle::getFuelConsumption() {\n\
    return traci->genericGetDouble(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_FUELCONSUMPTION, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Vehicle::getCOEmission() {\n\
    return traci->genericGetDouble(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_COEMISSION, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Vehicle::getCO2Emission() {\n\
    return traci->genericGetDouble(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_CO2EMISSION, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Vehicle::getHCEmission() {\n\
    return traci->genericGetDouble(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_HCEMISSION, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Vehicle::getNOxEmission() {\n\
    return traci->genericGetDouble(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_NOXEMISSION, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Vehicle::getPMxEmission() {\n\
    return traci->genericGetDouble(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_PMXEMISSION, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Vehicle::getNoiseEmission() {\n\
    return traci->genericGetDouble(CMD_GET_VEHICLE_VARIABLE, nodeId, VAR_NOISEEMISSION, RESPONSE_GET_VEHICLE_VARIABLE);\n\
}\n\
\n\
void TraCICommandInterface::Vehicle::changeRoute(std::string roadId, double travelTime) {\n\
    if (travelTime >= 0) {\n\
        uint8_t variableId = VAR_EDGE_TRAVELTIME;\n\
        uint8_t variableType = TYPE_COMPOUND;\n\
        int32_t count = 2;\n\
        uint8_t edgeIdT = TYPE_STRING;\n\
        std::string edgeId = roadId;\n\
        uint8_t newTimeT = TYPE_DOUBLE;\n\
        double newTime = travelTime;\n\
        TraCIBuffer buf = connection->query(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << nodeId << variableType << count << edgeIdT << edgeId << newTimeT << newTime);\n\
        ASSERT(buf.eof());\n\
    } else {\n\
        uint8_t variableId = VAR_EDGE_TRAVELTIME;\n\
        uint8_t variableType = TYPE_COMPOUND;\n\
        int32_t count = 1;\n\
        uint8_t edgeIdT = TYPE_STRING;\n\
        std::string edgeId = roadId;\n\
        TraCIBuffer buf = connection->query(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << nodeId << variableType << count << edgeIdT << edgeId);\n\
        ASSERT(buf.eof());\n\
    }\n\
    {\n\
        uint8_t variableId = CMD_REROUTE_TRAVELTIME;\n\
        uint8_t variableType = TYPE_COMPOUND;\n\
        int32_t count = 0;\n\
        TraCIBuffer buf = connection->query(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << nodeId << variableType << count);\n\
        ASSERT(buf.eof());\n\
    }\n\
}\n\
\n\
double TraCICommandInterface::getDistance(const Coord& p1, const Coord& p2, bool returnDrivingDistance) {\n\
    uint8_t variable = DISTANCE_REQUEST;\n\
    std::string simId = \"sim0\";\n\
    uint8_t variableType = TYPE_COMPOUND;\n\
    int32_t count = 3;\n\
    uint8_t dType = static_cast<uint8_t>(returnDrivingDistance ? REQUEST_DRIVINGDIST : REQUEST_AIRDIST);\n\
\n\
    // query road network boundaries\n\
    TraCIBuffer buf = connection.query(CMD_GET_SIM_VARIABLE, TraCIBuffer() << variable << simId << variableType << count << connection.omnet2traci(p1) << connection.omnet2traci(p2) << dType);\n\
    uint8_t cmdLength_resp; buf >> cmdLength_resp;\n\
    uint8_t commandId_resp; buf >> commandId_resp; ASSERT(commandId_resp == RESPONSE_GET_SIM_VARIABLE);\n\
    uint8_t variableId_resp; buf >> variableId_resp; ASSERT(variableId_resp == variable);\n\
    std::string simId_resp; buf >> simId_resp; ASSERT(simId_resp == simId);\n\
    uint8_t typeId_resp; buf >> typeId_resp; ASSERT(typeId_resp == TYPE_DOUBLE);\n\
    double distance; buf >> distance;\n\
\n\
    ASSERT(buf.eof());\n\
\n\
    return distance;\n\
}\n\
\n\
void TraCICommandInterface::Vehicle::stopAt(std::string roadId, double pos, uint8_t laneid, double radius, double waittime) {\n\
    uint8_t variableId = CMD_STOP;\n\
    uint8_t variableType = TYPE_COMPOUND;\n\
    int32_t count = 4;\n\
    uint8_t edgeIdT = TYPE_STRING;\n\
    std::string edgeId = roadId;\n\
    uint8_t stopPosT = TYPE_DOUBLE;\n\
    double stopPos = pos;\n\
    uint8_t stopLaneT = TYPE_BYTE;\n\
    uint8_t stopLane = laneid;\n\
    uint8_t durationT = TYPE_INTEGER;\n\
    uint32_t duration = waittime * 1000;\n\
\n\
    TraCIBuffer buf = connection->query(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << nodeId << variableType << count << edgeIdT << edgeId << stopPosT << stopPos << stopLaneT << stopLane << durationT << duration);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::Trafficlight::setProgram(std::string program) {\n\
    TraCIBuffer buf = connection->query(CMD_SET_TL_VARIABLE, TraCIBuffer() << static_cast<uint8_t>(TL_PROGRAM) << trafficLightId << static_cast<uint8_t>(TYPE_STRING) << program);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::Trafficlight::setPhaseIndex(int32_t index) {\n\
    TraCIBuffer buf = connection->query(CMD_SET_TL_VARIABLE, TraCIBuffer() << static_cast<uint8_t>(TL_PHASE_INDEX) << trafficLightId << static_cast<uint8_t>(TYPE_INTEGER) << index);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
std::list<std::string> TraCICommandInterface::getPolygonIds() {\n\
    return genericGetStringList(CMD_GET_POLYGON_VARIABLE, \"\", ID_LIST, RESPONSE_GET_POLYGON_VARIABLE);\n\
}\n\
\n\
std::string TraCICommandInterface::Polygon::getTypeId() {\n\
    return traci->genericGetString(CMD_GET_POLYGON_VARIABLE, polyId, VAR_TYPE, RESPONSE_GET_POLYGON_VARIABLE);\n\
}\n\
\n\
std::list<Coord> TraCICommandInterface::Polygon::getShape() {\n\
    return traci->genericGetCoordList(CMD_GET_POLYGON_VARIABLE, polyId, VAR_SHAPE, RESPONSE_GET_POLYGON_VARIABLE);\n\
}\n\
\n\
void TraCICommandInterface::Polygon::setShape(const std::list<Coord>& points) {\n\
    TraCIBuffer buf;\n\
    uint8_t count = static_cast<uint8_t>(points.size());\n\
    buf << static_cast<uint8_t>(VAR_SHAPE) << polyId << static_cast<uint8_t>(TYPE_POLYGON) << count;\n\
    for (std::list<Coord>::const_iterator i = points.begin(); i != points.end(); ++i) {\n\
        const TraCICoord& pos = connection->omnet2traci(*i);\n\
        buf << static_cast<double>(pos.x) << static_cast<double>(pos.y);\n\
    }\n\
    TraCIBuffer obuf = connection->query(CMD_SET_POLYGON_VARIABLE, buf);\n\
    ASSERT(obuf.eof());\n\
}\n\
\n\
void TraCICommandInterface::addPolygon(std::string polyId, std::string polyType, const TraCIColor& color, bool filled, int32_t layer, const std::list<Coord>& points) {\n\
    TraCIBuffer p;\n\
\n\
    p << static_cast<uint8_t>(ADD) << polyId;\n\
    p << static_cast<uint8_t>(TYPE_COMPOUND) << static_cast<int32_t>(5);\n\
    p << static_cast<uint8_t>(TYPE_STRING) << polyType;\n\
    p << static_cast<uint8_t>(TYPE_COLOR) << color.red << color.green << color.blue << color.alpha;\n\
    p << static_cast<uint8_t>(TYPE_UBYTE) << static_cast<uint8_t>(filled);\n\
    p << static_cast<uint8_t>(TYPE_INTEGER) << layer;\n\
    p << static_cast<uint8_t>(TYPE_POLYGON) << static_cast<uint8_t>(points.size());\n\
    for (std::list<Coord>::const_iterator i = points.begin(); i != points.end(); ++i) {\n\
        const TraCICoord& pos = connection.omnet2traci(*i);\n\
        p << static_cast<double>(pos.x) << static_cast<double>(pos.y);\n\
    }\n\
\n\
    TraCIBuffer buf = connection.query(CMD_SET_POLYGON_VARIABLE, p);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::Polygon::remove(int32_t layer) {\n\
    TraCIBuffer p;\n\
\n\
    p << static_cast<uint8_t>(REMOVE) << polyId;\n\
    p << static_cast<uint8_t>(TYPE_INTEGER) << layer;\n\
\n\
    TraCIBuffer buf = connection->query(CMD_SET_POLYGON_VARIABLE, p);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::addPoi(std::string poiId, std::string poiType, const TraCIColor& color, int32_t layer, const Coord& pos_) {\n\
    TraCIBuffer p;\n\
\n\
    TraCICoord pos = connection.omnet2traci(pos_);\n\
    p << static_cast<uint8_t>(ADD) << poiId;\n\
    p << static_cast<uint8_t>(TYPE_COMPOUND) << static_cast<int32_t>(4);\n\
    p << static_cast<uint8_t>(TYPE_STRING) << poiType;\n\
    p << static_cast<uint8_t>(TYPE_COLOR) << color.red << color.green << color.blue << color.alpha;\n\
    p << static_cast<uint8_t>(TYPE_INTEGER) << layer;\n\
    p << pos;\n\
\n\
    TraCIBuffer buf = connection.query(CMD_SET_POI_VARIABLE, p);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::Poi::remove(int32_t layer) {\n\
    TraCIBuffer p;\n\
\n\
    p << static_cast<uint8_t>(REMOVE) << poiId;\n\
    p << static_cast<uint8_t>(TYPE_INTEGER) << layer;\n\
\n\
    TraCIBuffer buf = connection->query(CMD_SET_POI_VARIABLE, p);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
std::list<std::string> TraCICommandInterface::getLaneIds() {\n\
    return genericGetStringList(CMD_GET_LANE_VARIABLE, \"\", ID_LIST, RESPONSE_GET_LANE_VARIABLE);\n\
}\n\
\n\
std::list<Coord> TraCICommandInterface::Lane::getShape() {\n\
    return traci->genericGetCoordList(CMD_GET_LANE_VARIABLE, laneId, VAR_SHAPE, RESPONSE_GET_LANE_VARIABLE);\n\
}\n\
\n\
std::string TraCICommandInterface::Lane::getRoadId() {\n\
    return traci->genericGetString(CMD_GET_LANE_VARIABLE, laneId, LANE_EDGE_ID, RESPONSE_GET_LANE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Lane::getLength() {\n\
    return traci->genericGetDouble(CMD_GET_LANE_VARIABLE, laneId, VAR_LENGTH, RESPONSE_GET_LANE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Lane::getMaxSpeed() {\n\
    return traci->genericGetDouble(CMD_GET_LANE_VARIABLE, laneId, VAR_MAXSPEED, RESPONSE_GET_LANE_VARIABLE);\n\
}\n\
\n\
double TraCICommandInterface::Lane::getMeanSpeed() {\n\
    return traci->genericGetDouble(CMD_GET_LANE_VARIABLE, laneId, LAST_STEP_MEAN_SPEED, RESPONSE_GET_LANE_VARIABLE);\n\
}\n\
\n\
std::list<std::string> TraCICommandInterface::getJunctionIds() {\n\
    return genericGetStringList(CMD_GET_JUNCTION_VARIABLE, \"\", ID_LIST, RESPONSE_GET_JUNCTION_VARIABLE);\n\
}\n\
\n\
Coord TraCICommandInterface::Junction::getPosition() {\n\
    return traci->genericGetCoord(CMD_GET_JUNCTION_VARIABLE, junctionId, VAR_POSITION, RESPONSE_GET_JUNCTION_VARIABLE);\n\
}\n\
\n\
bool TraCICommandInterface::addVehicle(std::string vehicleId, std::string vehicleTypeId, std::string routeId, simtime_t emitTime_st, double emitPosition, double emitSpeed, int8_t emitLane) {\n\
    bool success = false;\n\
\n\
    uint8_t variableId = ADD;\n\
    uint8_t variableType = TYPE_COMPOUND;\n\
    int32_t count = 6;\n\
    int32_t emitTime = (emitTime_st < 0) ? (-1) : (floor(emitTime_st.dbl() * 1000));\n\
    TraCIBuffer buf = connection.queryOptional(CMD_SET_VEHICLE_VARIABLE, TraCIBuffer() << variableId << vehicleId << variableType << count << (uint8_t)TYPE_STRING << vehicleTypeId << (uint8_t)TYPE_STRING << routeId << (uint8_t)TYPE_INTEGER << emitTime << (uint8_t)TYPE_DOUBLE << emitPosition << (uint8_t)TYPE_DOUBLE <<emitSpeed << (uint8_t)TYPE_BYTE << emitLane, success);\n\
    ASSERT(buf.eof());\n\
\n\
    return success;\n\
}\n\
\n\
bool TraCICommandInterface::Vehicle::changeVehicleRoute(const std::list<std::string>& edges) {\n\
    if (getRoadId().find(':') != std::string::npos) return false;\n\
    if (edges.front().compare(getRoadId()) != 0) return false;\n\
    uint8_t variableId = VAR_ROUTE;\n\
    uint8_t variableType = TYPE_STRINGLIST;\n\
    TraCIBuffer buf;\n\
    buf << variableId << nodeId << variableType;\n\
    int32_t numElem = edges.size();\n\
    buf << numElem;\n\
    for (std::list<std::string>::const_iterator i = edges.begin(); i != edges.end(); ++i) {\n\
        buf << static_cast<std::string>(*i);\n\
    }\n\
    TraCIBuffer obuf = connection->query(CMD_SET_VEHICLE_VARIABLE, buf);\n\
    ASSERT(obuf.eof());\n\
    return true;\n\
}\n\
\n\
std::pair<double, double> TraCICommandInterface::getLonLat(const Coord& coord) {\n\
    TraCIBuffer request;\n\
    request << static_cast<uint8_t>(POSITION_CONVERSION) << std::string(\"sim0\")\n\
            << static_cast<uint8_t>(TYPE_COMPOUND) << static_cast<int32_t>(2)\n\
            << connection.omnet2traci(coord)\n\
            << static_cast<uint8_t>(TYPE_UBYTE) << static_cast<uint8_t>(POSITION_LON_LAT);\n\
    TraCIBuffer response = connection.query(CMD_GET_SIM_VARIABLE, request);\n\
\n\
    uint8_t cmdLength; response >> cmdLength;\n\
    if (cmdLength == 0) {\n\
        uint32_t cmdLengthX;\n\
        response >> cmdLengthX;\n\
    }\n\
    uint8_t responseId; response >> responseId;\n\
    ASSERT(responseId == RESPONSE_GET_SIM_VARIABLE);\n\
    uint8_t variable; response >> variable;\n\
    ASSERT(variable == POSITION_CONVERSION);\n\
    std::string id; response >> id;\n\
    uint8_t convPosType; response >> convPosType;\n\
    ASSERT(convPosType == POSITION_LON_LAT);\n\
    double convPosLon; response >> convPosLon;\n\
    double convPosLat; response >> convPosLat;\n\
\n\
    return std::make_pair(convPosLon, convPosLat);\n\
}\n\
\n\
void TraCICommandInterface::GuiView::setScheme(std::string name) {\n\
    TraCIBuffer buf = connection->query(CMD_SET_GUI_VARIABLE, TraCIBuffer() << static_cast<uint8_t>(VAR_VIEW_SCHEMA) << viewId << static_cast<uint8_t>(TYPE_STRING) << name);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::GuiView::setZoom(double zoom) {\n\
    TraCIBuffer buf = connection->query(CMD_SET_GUI_VARIABLE, TraCIBuffer() << static_cast<uint8_t>(VAR_VIEW_ZOOM) << viewId << static_cast<uint8_t>(TYPE_DOUBLE) << zoom);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
void TraCICommandInterface::GuiView::setBoundary(Coord p1_, Coord p2_) {\n\
    TraCICoord p1 = connection->omnet2traci(p1_);\n\
    TraCICoord p2 = connection->omnet2traci(p2_);\n\
\n\
    TraCIBuffer buf = connection->query(CMD_SET_GUI_VARIABLE, TraCIBuffer() << static_cast<uint8_t>(VAR_VIEW_BOUNDARY) << viewId << static_cast<uint8_t>(TYPE_BOUNDINGBOX) << p1.x << p1.y << p2.x << p2.y);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
\n\
void TraCICommandInterface::GuiView::takeScreenshot(std::string filename) {\n\
    if (filename == \"\") {\n\
        // get absolute path of results/ directory\n\
        const char* myResultsDir = cSimulation::getActiveSimulation()->getEnvir()->getConfigEx()->getVariable(CFGVAR_RESULTDIR);\n\
        char* s = realpath(myResultsDir, 0);\n\
        std::string absolutePath = s;\n\
        free(s);\n\
\n\
        // get run id\n\
        const char* myRunID = cSimulation::getActiveSimulation()->getEnvir()->getConfigEx()->getVariable(CFGVAR_RUNID);\n\
\n\
        // build filename from this\n\
        char ss[512];\n\
        snprintf(ss, sizeof(ss), \"%s/screenshot-%s-@%08.2f.png\", absolutePath.c_str(), myRunID, simTime().dbl());\n\
        filename = ss;\n\
    }\n\
\n\
    TraCIBuffer buf = connection->query(CMD_SET_GUI_VARIABLE, TraCIBuffer() << static_cast<uint8_t>(VAR_SCREENSHOT) << viewId << static_cast<uint8_t>(TYPE_STRING) << filename);\n\
    ASSERT(buf.eof());\n\
}\n\
\n\
std::string TraCICommandInterface::genericGetString(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId) {\n\
    uint8_t resultTypeId = TYPE_STRING;\n\
    std::string res;\n\
\n\
    TraCIBuffer buf = connection.query(commandId, TraCIBuffer() << variableId << objectId);\n\
\n\
    uint8_t cmdLength; buf >> cmdLength;\n\
    if (cmdLength == 0) {\n\
        uint32_t cmdLengthX;\n\
        buf >> cmdLengthX;\n\
    }\n\
    uint8_t commandId_r; buf >> commandId_r;\n\
    ASSERT(commandId_r == responseId);\n\
    uint8_t varId; buf >> varId;\n\
    ASSERT(varId == variableId);\n\
    std::string objectId_r; buf >> objectId_r;\n\
    ASSERT(objectId_r == objectId);\n\
    uint8_t resType_r; buf >> resType_r;\n\
    ASSERT(resType_r == resultTypeId);\n\
    buf >> res;\n\
\n\
    ASSERT(buf.eof());\n\
\n\
    return res;\n\
}\n\
\n\
Coord TraCICommandInterface::genericGetCoord(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId) {\n\
\n\
    uint8_t resultTypeId = POSITION_2D;\n\
    double x;\n\
    double y;\n\
\n\
    TraCIBuffer buf = connection.query(commandId, TraCIBuffer() << variableId << objectId);\n\
\n\
    uint8_t cmdLength; buf >> cmdLength;\n\
    if (cmdLength == 0) {\n\
        uint32_t cmdLengthX;\n\
        buf >> cmdLengthX;\n\
    }\n\
    uint8_t commandId_r; buf >> commandId_r;\n\
    ASSERT(commandId_r == responseId);\n\
    uint8_t varId; buf >> varId;\n\
    ASSERT(varId == variableId);\n\
    std::string objectId_r; buf >> objectId_r;\n\
    ASSERT(objectId_r == objectId);\n\
    uint8_t resType_r; buf >> resType_r;\n\
    ASSERT(resType_r == resultTypeId);\n\
    buf >> x;\n\
    buf >> y;\n\
\n\
    ASSERT(buf.eof());\n\
\n\
    return connection.traci2omnet(TraCICoord(x, y));\n\
}\n\
\n\
double TraCICommandInterface::genericGetDouble(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId) {\n\
\n\
    uint8_t resultTypeId = TYPE_DOUBLE;\n\
    double res;\n\
\n\
    TraCIBuffer buf = connection.query(commandId, TraCIBuffer() << variableId << objectId);\n\
\n\
    uint8_t cmdLength; buf >> cmdLength;\n\
    if (cmdLength == 0) {\n\
        uint32_t cmdLengthX;\n\
        buf >> cmdLengthX;\n\
    }\n\
    uint8_t commandId_r; buf >> commandId_r;\n\
    ASSERT(commandId_r == responseId);\n\
    uint8_t varId; buf >> varId;\n\
    ASSERT(varId == variableId);\n\
    std::string objectId_r; buf >> objectId_r;\n\
    ASSERT(objectId_r == objectId);\n\
    uint8_t resType_r; buf >> resType_r;\n\
    ASSERT(resType_r == resultTypeId);\n\
    buf >> res;\n\
\n\
    ASSERT(buf.eof());\n\
\n\
    return res;\n\
}\n\
\n\
int32_t TraCICommandInterface::genericGetInt(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId) {\n\
\n\
    uint8_t resultTypeId = TYPE_INTEGER;\n\
    int32_t res;\n\
\n\
    TraCIBuffer buf = connection.query(commandId, TraCIBuffer() << variableId << objectId);\n\
\n\
    uint8_t cmdLength; buf >> cmdLength;\n\
    if (cmdLength == 0) {\n\
        uint32_t cmdLengthX;\n\
        buf >> cmdLengthX;\n\
    }\n\
    uint8_t commandId_r; buf >> commandId_r;\n\
    ASSERT(commandId_r == responseId);\n\
    uint8_t varId; buf >> varId;\n\
    ASSERT(varId == variableId);\n\
    std::string objectId_r; buf >> objectId_r;\n\
    ASSERT(objectId_r == objectId);\n\
    uint8_t resType_r; buf >> resType_r;\n\
    ASSERT(resType_r == resultTypeId);\n\
    buf >> res;\n\
\n\
    ASSERT(buf.eof());\n\
\n\
    return res;\n\
}\n\
\n\
std::list<std::string> TraCICommandInterface::genericGetStringList(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId) {\n\
\n\
    uint8_t resultTypeId = TYPE_STRINGLIST;\n\
    std::list<std::string> res;\n\
\n\
    TraCIBuffer buf = connection.query(commandId, TraCIBuffer() << variableId << objectId);\n\
\n\
    uint8_t cmdLength; buf >> cmdLength;\n\
    if (cmdLength == 0) {\n\
        uint32_t cmdLengthX;\n\
        buf >> cmdLengthX;\n\
    }\n\
    uint8_t commandId_r; buf >> commandId_r;\n\
    ASSERT(commandId_r == responseId);\n\
    uint8_t varId; buf >> varId;\n\
    ASSERT(varId == variableId);\n\
    std::string objectId_r; buf >> objectId_r;\n\
    ASSERT(objectId_r == objectId);\n\
    uint8_t resType_r; buf >> resType_r;\n\
    ASSERT(resType_r == resultTypeId);\n\
    uint32_t count; buf >> count;\n\
    for (uint32_t i = 0; i < count; i++) {\n\
        std::string id; buf >> id;\n\
        res.push_back(id);\n\
    }\n\
\n\
    ASSERT(buf.eof());\n\
\n\
    return res;\n\
}\n\
\n\
std::list<Coord> TraCICommandInterface::genericGetCoordList(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId) {\n\
\n\
    uint8_t resultTypeId = TYPE_POLYGON;\n\
    std::list<Coord> res;\n\
\n\
    TraCIBuffer buf = connection.query(commandId, TraCIBuffer() << variableId << objectId);\n\
\n\
    uint8_t cmdLength; buf >> cmdLength;\n\
    if (cmdLength == 0) {\n\
        uint32_t cmdLengthX;\n\
        buf >> cmdLengthX;\n\
    }\n\
    uint8_t commandId_r; buf >> commandId_r;\n\
    ASSERT(commandId_r == responseId);\n\
    uint8_t varId; buf >> varId;\n\
    ASSERT(varId == variableId);\n\
    std::string objectId_r; buf >> objectId_r;\n\
    ASSERT(objectId_r == objectId);\n\
    uint8_t resType_r; buf >> resType_r;\n\
    ASSERT(resType_r == resultTypeId);\n\
    uint8_t count; buf >> count;\n\
    for (uint32_t i = 0; i < count; i++) {\n\
        double x; buf >> x;\n\
        double y; buf >> y;\n\
        res.push_back(connection.traci2omnet(TraCICoord(x, y)));\n\
    }\n\
\n\
    ASSERT(buf.eof());\n\
\n\
    return res;\n\
}\n\
\n\
}\n\
"

    var file = new File([structure], {type: "application/xml;charset==utf-8"});
    saveAs(file, "TraCICommandInterface.cc");
}

function createHFile(){


var structure = "\
#ifndef VEINS_MOBILITY_TRACI_TRACICOMMANDINTERFACE_H_\n\
#define VEINS_MOBILITY_TRACI_TRACICOMMANDINTERFACE_H_\n\
\n\
#include <list>\n\
#include <string>\n\
#include <stdint.h>\n\
\n\
#include \"veins/modules/mobility/traci/TraCIColor.h\"\n\
#include \"veins/base/utils/Coord.h\"\n\
\n\
namespace Veins {\n\
\n\
class TraCIConnection;\n\
\n\
class TraCICommandInterface\n\
{\n\
    public:\n\
        TraCICommandInterface(TraCIConnection&);\n\
\n\
        enum DepartDefs {\n\
            DEPART_NOW = 2,\n\
            DEPART_LANE_BEST_FREE = 5,\n\
            DEPART_POS_BASE = 4,\n\
            DEPART_SPEED_MAX = 3\n\
        };\n\
\n\
        // General methods that do not deal with a particular object in the simulation\n\
        std::pair<uint32_t, std::string> getVersion();\n\
        std::pair<double, double> getLonLat(const Coord&);\n\
        double getDistance(const Coord& position1, const Coord& position2, bool returnDrivingDistance);\n\
\n\
        // Vehicle methods\n\
        bool addVehicle(std::string vehicleId, std::string vehicleTypeId, std::string routeId, simtime_t emitTime_st = -DEPART_NOW, double emitPosition = -DEPART_POS_BASE, double emitSpeed = -DEPART_SPEED_MAX, int8_t emitLane = -DEPART_LANE_BEST_FREE);\n\
        class Vehicle {\n\
            public:\n\
                Vehicle(TraCICommandInterface* traci, std::string nodeId) : traci(traci), nodeId(nodeId) {\n\
                    connection = &traci->connection;\n\
                }\n\
\n\
                double getFuelConsumption();\n\
                double getCOEmission();\n\
                double getCO2Emission();\n\
                double getHCEmission();\n\
                double getNOxEmission();\n\
                double getPMxEmission();\n\
                double getNoiseEmission();\n\
                void setSpeedMode(int32_t bitset);\n\
                void setSpeed(double speed);\n\
                void setColor(const TraCIColor& color);\n\
                void slowDown(double speed, int time);\n\
                void newRoute(std::string roadId);\n\
                void setParking();\n\
                std::string getRoadId();\n\
                std::string getCurrentRoadOnRoute();\n\
                std::string getLaneId();\n\
                double getLanePosition();\n\
                std::list<std::string> getPlannedRoadIds();\n\
                std::string getRouteId();\n\
                void changeRoute(std::string roadId, double travelTime);\n\
                void stopAt(std::string roadId, double pos, uint8_t laneid, double radius, double waittime);\n\
                int32_t getLaneIndex();\n\
                std::string getTypeId();\n\
                bool changeVehicleRoute(const std::list<std::string>& roads);\n\
\n\
            protected:\n\
                TraCICommandInterface* traci;\n\
                TraCIConnection* connection;\n\
                std::string nodeId;\n\
        };\n\
        Vehicle vehicle(std::string nodeId) {\n\
            return Vehicle(this, nodeId);\n\
        }\n\
\n\
        // Road methods\n\
        class Road {\n\
            public:\n\
                Road(TraCICommandInterface* traci, std::string roadId) : traci(traci), roadId(roadId) {\n\
                    connection = &traci->connection;\n\
                }\n\
\n\
                double getCurrentTravelTime();\n\
                double getMeanSpeed();\n\
\n\
            protected:\n\
                TraCICommandInterface* traci;\n\
                TraCIConnection* connection;\n\
                std::string roadId;\n\
        };\n\
        Road road(std::string roadId) {\n\
            return Road(this, roadId);\n\
        }\n\
\n\
        // Lane methods\n\
        std::list<std::string> getLaneIds();\n\
        class Lane {\n\
            public:\n\
                Lane(TraCICommandInterface* traci, std::string laneId) : traci(traci), laneId(laneId) {\n\
                    connection = &traci->connection;\n\
                }\n\
\n\
                std::list<Coord> getShape();\n\
                std::string getRoadId();\n\
                double getLength();\n\
                double getMaxSpeed();\n\
                double getMeanSpeed();\n\
\n\
            protected:\n\
                TraCICommandInterface* traci;\n\
                TraCIConnection* connection;\n\
                std::string laneId;\n\
        };\n\
        Lane lane(std::string laneId) {\n\
            return Lane(this, laneId);\n\
        }\n\
\n\
        // Trafficlight methods\n\
        class Trafficlight {\n\
            public:\n\
                Trafficlight(TraCICommandInterface* traci, std::string trafficLightId) : traci(traci), trafficLightId(trafficLightId) {\n\
                    connection = &traci->connection;\n\
                }\n\
\n\
                void setProgram(std::string program);\n\
                void setPhaseIndex(int32_t index);\n\
\n\
            protected:\n\
                TraCICommandInterface* traci;\n\
                TraCIConnection* connection;\n\
                std::string trafficLightId;\n\
        };\n\
        Trafficlight trafficlight(std::string trafficLightId) {\n\
            return Trafficlight(this, trafficLightId);\n\
        }\n\
\n\
        // Polygon methods\n\
        std::list<std::string> getPolygonIds();\n\
        void addPolygon(std::string polyId, std::string polyType, const TraCIColor& color, bool filled, int32_t layer, const std::list<Coord>& points);\n\
        class Polygon {\n\
            public:\n\
                Polygon(TraCICommandInterface* traci, std::string polyId) : traci(traci), polyId(polyId) {\n\
                    connection = &traci->connection;\n\
                }\n\
\n\
                std::string getTypeId();\n\
                std::list<Coord> getShape();\n\
                void setShape(const std::list<Coord>& points);\n\
                void remove(int32_t layer);\n\
\n\
            protected:\n\
                TraCICommandInterface* traci;\n\
                TraCIConnection* connection;\n\
                std::string polyId;\n\
        };\n\
        Polygon polygon(std::string polyId) {\n\
            return Polygon(this, polyId);\n\
        }\n\
\n\
        // Poi methods\n\
        void addPoi(std::string poiId, std::string poiType, const TraCIColor& color, int32_t layer, const Coord& pos);\n\
        class Poi {\n\
            public:\n\
                Poi(TraCICommandInterface* traci, std::string poiId) : traci(traci), poiId(poiId) {\n\
                    connection = &traci->connection;\n\
                }\n\
\n\
                void remove(int32_t layer);\n\
\n\
            protected:\n\
                TraCICommandInterface* traci;\n\
                TraCIConnection* connection;\n\
                std::string poiId;\n\
        };\n\
        Poi poi(std::string poiId) {\n\
            return Poi(this, poiId);\n\
        }\n\
\n\
        // Junction methods\n\
        std::list<std::string> getJunctionIds();\n\
        class Junction {\n\
            public:\n\
                Junction(TraCICommandInterface* traci, std::string junctionId) : traci(traci), junctionId(junctionId) {\n\
                    connection = &traci->connection;\n\
                }\n\
\n\
                Coord getPosition();\n\
\n\
            protected:\n\
                TraCICommandInterface* traci;\n\
                TraCIConnection* connection;\n\
                std::string junctionId;\n\
        };\n\
        Junction junction(std::string junctionId) {\n\
            return Junction(this, junctionId);\n\
        }\n\
\n\
        // Route methods\n\
        std::list<std::string> getRouteIds();\n\
        class Route {\n\
            public:\n\
                Route(TraCICommandInterface* traci, std::string routeId) : traci(traci), routeId(routeId) {\n\
                    connection = &traci->connection;\n\
                }\n\
\n\
                std::list<std::string> getRoadIds();\n\
\n\
            protected:\n\
                TraCICommandInterface* traci;\n\
                TraCIConnection* connection;\n\
                std::string routeId;\n\
        };\n\
        Route route(std::string routeId) {\n\
            return Route(this, routeId);\n\
        }\n\
\n\
        // Vehicletype methods\n\
        std::list<std::string> getVehicleTypeIds();\n\
\n\
        // GuiView methods\n\
        class GuiView {\n\
            public:\n\
                GuiView(TraCICommandInterface* traci, std::string viewId) : traci(traci), viewId(viewId) {\n\
                    connection = &traci->connection;\n\
                }\n\
\n\
                void setScheme(std::string name);\n\
                void setZoom(double zoom);\n\
                void setBoundary(Coord p1, Coord p2);\n\
                void takeScreenshot(std::string filename = \"\");\n\
\n\
            protected:\n\
                TraCICommandInterface* traci;\n\
                TraCIConnection* connection;\n\
                std::string viewId;\n\
        };\n\
        GuiView guiView(std::string viewId) {\n\
            return GuiView(this, viewId);\n\
        }\n\
\n\
\n\
    private:\n\
        TraCIConnection& connection;\n\
\n\
        std::string genericGetString(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId);\n\
        Coord genericGetCoord(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId);\n\
        double genericGetDouble(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId);\n\
        int32_t genericGetInt(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId);\n\
        std::list<std::string> genericGetStringList(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId);\n\
        std::list<Coord> genericGetCoordList(uint8_t commandId, std::string objectId, uint8_t variableId, uint8_t responseId);\n\
};\n\
\n\
}\n\
\n\
#endif\n\
"

    var file = new File([structure], {type: "application/xml;charset==utf-8"});
    saveAs(file, "TraCICommandInterface.h");
}