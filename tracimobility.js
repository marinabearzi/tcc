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

function createCCFile(){

var speed_check = document.getElementById("speed_data").checked
var accel_check = document.getElementById("accel_data").checked
var posx_check = document.getElementById("posx_data").checked
var posy_check = document.getElementById("posy_data").checked

var distance_check = document.getElementById("distance_data").checked
var minspeed_check = document.getElementById("minspeed_data").checked
var maxspeed_check = document.getElementById("maxspeed_data").checked
var fuel_check = document.getElementById("fuel_data").checked
var co_check = document.getElementById("co_data").checked
var co2_check = document.getElementById("co2_data").checked
var hc_check = document.getElementById("hc_data").checked
var nox_check = document.getElementById("nox_data").checked
var pmx_check = document.getElementById("pmx_data").checked
var noise_check = document.getElementById("noise_data").checked

var stringInitializeVector = ""
var stringUpdateVector_0 = ""
var stringUpdateVector_1 = ""
var stringUpdateVector_2 = ""
var stringUpdateVector_3 = ""

var stringInitializeScalar = ""
var stringRecordScalar = ""
var stringUpdateScalar_0 = ""
var stringUpdateScalar_1 = ""
var stringUpdateScalar_2 = ""
var stringUpdateScalar_3 = ""

if(speed_check){
    stringInitializeVector += "\t\tcurrentSpeedVec.setName(\"speed\");\n"
    stringUpdateVector_2 += "\t\t\tcurrentSpeedVec.record(speed);\n"
}
if(accel_check){
    stringInitializeVector += "\t\tcurrentAccelerationVec.setName(\"acceleration\");\n"
    stringUpdateVector_3 += "\t\t\t\tcurrentAccelerationVec.record(acceleration);\n"
}
if(posx_check){
    stringInitializeVector += "\t\tcurrentPosXVec.setName(\"posx\");\n"
    stringUpdateVector_0 += "\tcurrentPosXVec.record(move.getStartPos().x);\n"
}
if(posy_check){
    stringInitializeVector += "\t\tcurrentPosYVec.setName(\"posy\");\n"
    stringUpdateVector_0 += "\tcurrentPosYVec.record(move.getStartPos().y);\n"
}
if(distance_check){
    stringInitializeScalar += "\ttotalDistance = 0;\n"
    stringRecordScalar += "\tmodule.recordScalar(\"totalDistance\", totalDistance);\n"
    stringUpdateScalar_1 += "\t\tdouble distance = move.getStartPos().distance(nextPos);\n\t\tstatistics.totalDistance += distance;\n"
}
if(minspeed_check){
    stringInitializeScalar += "\tminSpeed = MY_INFINITY;\n"
    stringRecordScalar += "\tif (minSpeed != MY_INFINITY) module.recordScalar(\"minSpeed\", minSpeed);\n"
    stringUpdateScalar_2 += "\t\t\tstatistics.minSpeed = std::min(statistics.minSpeed, speed);\n"
}
if(maxspeed_check){
    stringInitializeScalar += "\tmaxSpeed = -MY_INFINITY;\n"
    stringRecordScalar += "\tif (maxSpeed != -MY_INFINITY) module.recordScalar(\"maxSpeed\", maxSpeed);\n"
    stringUpdateScalar_2 += "\t\t\tstatistics.maxSpeed = std::min(statistics.maxSpeed, speed);\n"
}
if(fuel_check){
    stringInitializeScalar += "\ttotalFuelConsumption = 0; \n"
    stringRecordScalar += "\tmodule.recordScalar(\"totalFuelConsumption\", totalFuelConsumption);\n"
    stringUpdateScalar_3 += "\t\t\t\tdouble fuelConsumption = getVehicleCommandInterface()->getFuelConsumption();\n\t\t\t\tstatistics.totalFuelConsumption+=fuelConsumption;\n"
}
if(co_check){
    stringInitializeScalar += "\ttotalCOEmission = 0; \n"
    stringRecordScalar += "\tmodule.recordScalar(\"totalCOEmission\", totalCOEmission);\n"
    stringUpdateScalar_3 += "\t\t\t\tdouble COEmission = getVehicleCommandInterface()->getCOEmission();\n\t\t\t\tstatistics.totalCOEmission+=COEmission;\n"
}
if(co2_check){
    stringInitializeScalar += "\ttotalCO2Emission = 0; \n"
    stringRecordScalar += "\tmodule.recordScalar(\"totalCO2Emission\", totalCO2Emission);\n"
    stringUpdateScalar_3 += "\t\t\t\tdouble CO2Emission = getVehicleCommandInterface()->getCO2Emission();\n\t\t\t\tstatistics.totalCO2Emission+=CO2Emission;\n"
}
if(hc_check){
    stringInitializeScalar += "\ttotalHCEmission = 0; \n"
    stringRecordScalar += "\tmodule.recordScalar(\"totalHCEmission\", totalHCEmission);\n"
    stringUpdateScalar_3 += "\t\t\t\tdouble HCEmission = getVehicleCommandInterface()->getHCEmission();\n\t\t\t\tstatistics.totalHCEmission+=HCEmission;\n"
}
if(nox_check){
    stringInitializeScalar += "\ttotalNOxEmission = 0; \n"
    stringRecordScalar += "\tmodule.recordScalar(\"totalNOxEmission\", totalNOxEmission);\n"
    stringUpdateScalar_3 += "\t\t\t\tdouble NOxEmission = getVehicleCommandInterface()->getNOxEmission();\n\t\t\t\tstatistics.totalNOxEmission+=NOxEmission;\n"
}
if(pmx_check){
    stringInitializeScalar += "\ttotalPMxEmission = 0; \n"
    stringRecordScalar += "\tmodule.recordScalar(\"totalPMxEmission\", totalPMxEmission);\n"
    stringUpdateScalar_3 += "\t\t\t\tdouble PMxEmission = getVehicleCommandInterface()->getPMxEmission();\n\t\t\t\tstatistics.totalPMxEmission+=PMxEmission;\n"
}
if(noise_check){
    stringInitializeScalar += "\ttotalNoiseEmission = 0; \n"
    stringRecordScalar += "\tmodule.recordScalar(\"totalNoiseEmission\", totalNoiseEmission);\n"
    stringUpdateScalar_3 += "\t\t\t\tdouble noiseEmission = getVehicleCommandInterface()->getNoiseEmission();\n\t\t\t\tstatistics.totalNoiseEmission+=noiseEmission;\n"
}

var structure = "\
//\n\
// Copyright (C) 2006-2012 Christoph Sommer <christoph.sommer@uibk.ac.at>\n\
//\n\
// Documentation for these modules is at http://veins.car2x.org/\n\
//\n\
// This program is free software; you can redistribute it and/or modify\n\
// it under the terms of the GNU General Public License as published by\n\
// the Free Software Foundation; either version 2 of the License, or\n\
// (at your option) any later version.\n\
//\n\
// This program is distributed in the hope that it will be useful,\n\
// but WITHOUT ANY WARRANTY; without even the implied warranty of\n\
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\
// GNU General Public License for more details.\n\
//\n\
// You should have received a copy of the GNU General Public License\n\
// along with this program; if not, write to the Free Software\n\
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA\n\
//\n\
\n\
#include <limits>\n\
#include <iostream>\n\
#include <sstream>\n\
\n\
#include \"veins/modules/mobility/traci/TraCIMobility.h\"\n\
\n\
using Veins::TraCIMobility;\n\
\n\
Define_Module(Veins::TraCIMobility);\n\
\n\
const simsignalwrap_t TraCIMobility::parkingStateChangedSignal = simsignalwrap_t(TRACI_SIGNAL_PARKING_CHANGE_NAME);\n\
\n\
namespace {\n\
    const double MY_INFINITY = (std::numeric_limits<double>::has_infinity ? std::numeric_limits<double>::infinity() : std::numeric_limits<double>::max());\n\
}\n\
\n\
void TraCIMobility::Statistics::initialize()\n\
{\n\
    firstRoadNumber = MY_INFINITY;\n\
    startTime = simTime();\n\
    totalTime = 0;\n\
    stopTime = 0;\n\
"+stringInitializeScalar+"\n\
}\n\
\n\
void TraCIMobility::Statistics::watch(cSimpleModule& )\n\
{\n\
    WATCH(totalTime);\n\
    WATCH(minSpeed);\n\
    WATCH(maxSpeed);\n\
    WATCH(totalDistance);\n\
}\n\
\n\
void TraCIMobility::Statistics::recordScalars(cSimpleModule& module)\n\
{\n\
    if (firstRoadNumber != MY_INFINITY) module.recordScalar(\"firstRoadNumber\", firstRoadNumber);\n\
    module.recordScalar(\"startTime\", startTime);\n\
    module.recordScalar(\"totalTime\", totalTime);\n\
    module.recordScalar(\"stopTime\", stopTime);\n\
"+stringRecordScalar+"\n\
}\n\
\n\
void TraCIMobility::initialize(int stage)\n\
{\n\
    if (stage == 0)\n\
    {\n\
        BaseMobility::initialize(stage);\n\
\n\
        debug = par(\"debug\");\n\
        antennaPositionOffset = par(\"antennaPositionOffset\");\n\
        accidentCount = par(\"accidentCount\");\n\
\n\
"+stringInitializeVector+"\n\
\n\
        statistics.initialize();\n\
        statistics.watch(*this);\n\
\n\
        ASSERT(isPreInitialized);\n\
        isPreInitialized = false;\n\
\n\
        Coord nextPos = calculateAntennaPosition(roadPosition);\n\
        nextPos.z = move.getCurrentPosition().z;\n\
\n\
        move.setStart(nextPos);\n\
        move.setDirectionByVector(Coord(cos(angle), -sin(angle)));\n\
        move.setSpeed(speed);\n\
\n\
        WATCH(road_id);\n\
        WATCH(speed);\n\
        WATCH(angle);\n\
\n\
        isParking = false;\n\
\n\
        startAccidentMsg = 0;\n\
        stopAccidentMsg = 0;\n\
        manager = 0;\n\
        last_speed = -1;\n\
\n\
        if (accidentCount > 0) {\n\
            simtime_t accidentStart = par(\"accidentStart\");\n\
            startAccidentMsg = new cMessage(\"scheduledAccident\");\n\
            stopAccidentMsg = new cMessage(\"scheduledAccidentResolved\");\n\
            scheduleAt(simTime() + accidentStart, startAccidentMsg);\n\
        }\n\
    }\n\
    else if (stage == 1)\n\
    {\n\
        // don't call BaseMobility::initialize(stage) -- our parent will take care to call changePosition later\n\
    }\n\
    else\n\
    {\n\
        BaseMobility::initialize(stage);\n\
    }\n\
\n\
}\n\
\n\
void TraCIMobility::finish()\n\
{\n\
    statistics.stopTime = simTime();\n\
\n\
    statistics.recordScalars(*this);\n\
\n\
    cancelAndDelete(startAccidentMsg);\n\
    cancelAndDelete(stopAccidentMsg);\n\
\n\
    isPreInitialized = false;\n\
}\n\
\n\
void TraCIMobility::handleSelfMsg(cMessage *msg)\n\
{\n\
    if (msg == startAccidentMsg) {\n\
        getVehicleCommandInterface()->setSpeed(0);\n\
        simtime_t accidentDuration = par(\"accidentDuration\");\n\
        scheduleAt(simTime() + accidentDuration, stopAccidentMsg);\n\
        accidentCount--;\n\
    }\n\
    else if (msg == stopAccidentMsg) {\n\
        getVehicleCommandInterface()->setSpeed(-1);\n\
        if (accidentCount > 0) {\n\
            simtime_t accidentInterval = par(\"accidentInterval\");\n\
            scheduleAt(simTime() + accidentInterval, startAccidentMsg);\n\
        }\n\
    }\n\
}\n\
\n\
void TraCIMobility::preInitialize(std::string external_id, const Coord& position, std::string road_id, double speed, double angle)\n\
{\n\
    this->external_id = external_id;\n\
    this->lastUpdate = 0;\n\
    this->roadPosition = position;\n\
    this->road_id = road_id;\n\
    this->speed = speed;\n\
    this->angle = angle;\n\
    this->antennaPositionOffset = par(\"antennaPositionOffset\");\n\
\n\
    Coord nextPos = calculateAntennaPosition(roadPosition);\n\
    nextPos.z = move.getCurrentPosition().z;\n\
\n\
    move.setStart(nextPos);\n\
    move.setDirectionByVector(Coord(cos(angle), -sin(angle)));\n\
    move.setSpeed(speed);\n\
\n\
    isPreInitialized = true;\n\
}\n\
\n\
void TraCIMobility::nextPosition(const Coord& position, std::string road_id, double speed, double angle, TraCIScenarioManager::VehicleSignal signals)\n\
{\n\
    if (debug) EV << \"nextPosition \" << position.x << \" \" << position.y << \" \" << road_id << \" \" << speed << \" \" << angle << std::endl;\n\
    isPreInitialized = false;\n\
    this->roadPosition = position;\n\
    this->road_id = road_id;\n\
    this->speed = speed;\n\
    this->angle = angle;\n\
    this->signals = signals;\n\
\n\
    changePosition();\n\
}\n\
\n\
void TraCIMobility::changePosition()\n\
{\n\
    // ensure we're not called twice in one time step\n\
    ASSERT(lastUpdate != simTime());\n\
\n\
    // keep statistics (for current step)\n\
"+stringUpdateScalar_0+"\n\
"+stringUpdateVector_0+"\n\
\n\
    Coord nextPos = calculateAntennaPosition(roadPosition);\n\
    nextPos.z = move.getCurrentPosition().z;\n\
\n\
    // keep statistics (relative to last step)\n\
    if (statistics.startTime != simTime()) {\n\
        simtime_t updateInterval = simTime() - this->lastUpdate;\n\
\n\
"+stringUpdateScalar_1+"\n\
        statistics.totalTime += updateInterval;\n\
        if (speed != -1) {\n\
"+stringUpdateScalar_2+"\n\
"+stringUpdateVector_2+"\n\
            if (last_speed != -1) {\n\
"+stringUpdateScalar_3+"\n\
                double acceleration = (speed - last_speed) / updateInterval;\n\
"+stringUpdateVector_3+"\n\
            }\n\
            last_speed = speed;\n\
        } else {\n\
            last_speed = -1;\n\
            speed = -1;\n\
        }\n\
    }\n\
    this->lastUpdate = simTime();\n\
\n\
    move.setStart(Coord(nextPos.x, nextPos.y, move.getCurrentPosition().z)); // keep z position\n\
    move.setDirectionByVector(Coord(cos(angle), -sin(angle)));\n\
    move.setSpeed(speed);\n\
    fixIfHostGetsOutside();\n\
    updatePosition();\n\
}\n\
\n\
void TraCIMobility::changeParkingState(bool newState) {\n\
    isParking = newState;\n\
    emit(parkingStateChangedSignal, this);\n\
}\n\
\n\
void TraCIMobility::fixIfHostGetsOutside()\n\
{\n\
    Coord pos = move.getStartPos();\n\
    Coord dummy = Coord::ZERO;\n\
    double dum;\n\
\n\
    bool outsideX = (pos.x < 0) || (pos.x >= playgroundSizeX());\n\
    bool outsideY = (pos.y < 0) || (pos.y >= playgroundSizeY());\n\
    bool outsideZ = (!world->use2D()) && ((pos.z < 0) || (pos.z >= playgroundSizeZ()));\n\
    if (outsideX || outsideY || outsideZ) {\n\
        error(\"Tried moving host to (%f, %f) which is outside the playground\", pos.x, pos.y);\n\
    }\n\
\n\
    handleIfOutside( RAISEERROR, pos, dummy, dummy, dum);\n\
}\n\
\n\
Coord TraCIMobility::calculateAntennaPosition(const Coord& vehiclePos) const {\n\
    Coord corPos;\n\
    if (antennaPositionOffset >= 0.001) {\n\
        //calculate antenna position of vehicle according to antenna offset\n\
        corPos = Coord(vehiclePos.x - antennaPositionOffset*cos(angle), vehiclePos.y + antennaPositionOffset*sin(angle), vehiclePos.z);\n\
    } else {\n\
        corPos = Coord(vehiclePos.x, vehiclePos.y, vehiclePos.z);\n\
    }\n\
    return corPos;\n\
}\n\
\n\
"

    var file = new File([structure], {type: "application/xml;charset==utf-8"});
    saveAs(file, "TraCIMobility.cc");
}

function createHFile(){

var speed_check = document.getElementById("speed_data").checked
var accel_check = document.getElementById("accel_data").checked
var posx_check = document.getElementById("posx_data").checked
var posy_check = document.getElementById("posy_data").checked

var distance_check = document.getElementById("distance_data").checked
var minspeed_check = document.getElementById("minspeed_data").checked
var maxspeed_check = document.getElementById("maxspeed_data").checked
var fuel_check = document.getElementById("fuel_data").checked
var co_check = document.getElementById("co_data").checked
var co2_check = document.getElementById("co2_data").checked
var hc_check = document.getElementById("hc_data").checked
var nox_check = document.getElementById("nox_data").checked
var pmx_check = document.getElementById("pmx_data").checked
var noise_check = document.getElementById("noise_data").checked

var stringScalar = ""
var stringVector = ""

if(speed_check){
    stringVector += "\t\tdouble cOutVector currentSpeedVec;\n"
}
if(accel_check){
    stringVector += "\t\tdouble cOutVector currentAccelerationVec;\n"
}
if(posx_check){
    stringVector += "\t\tdouble cOutVector currentPosXVec;\n"
}
if(posy_check){
    stringVector += "\t\tdouble cOutVector currentPosYVec;\n"
}
if(distance_check){
    stringScalar += "\t\t\t\tdouble totalDistance;\n"
}
if(minspeed_check){
    stringScalar += "\t\t\t\tdouble minSpeed;\n"
}
if(maxspeed_check){
    stringScalar += "\t\t\t\tdouble maxSpeed;\n"
}
if(fuel_check){
    stringScalar += "\t\t\t\tdouble totalFuelConsumption;\n"
}
if(co_check){
    stringScalar += "\t\t\t\tdouble totalCOEmission;\n"
}
if(co2_check){
    stringScalar += "\t\t\t\tdouble totalCO2Emission;\n"
}
if(hc_check){
    stringScalar += "\t\t\t\tdouble totalHCEmission;\n"
}
if(nox_check){
    stringScalar += "\t\t\t\tdouble totalNOxEmission;\n"
}
if(pmx_check){
    stringScalar += "\t\t\t\tdouble totalPMxEmission;\n"
}
if(noise_check){
    stringScalar += "\t\t\t\tdouble totalNoiseEmission;\n"
}

var structure = "\
//\n\
// Copyright (C) 2006-2012 Christoph Sommer <christoph.sommer@uibk.ac.at>\n\
//\n\
// Documentation for these modules is at http://veins.car2x.org/\n\
//\n\
// This program is free software; you can redistribute it and/or modify\n\
// it under the terms of the GNU General Public License as published by\n\
// the Free Software Foundation; either version 2 of the License, or\n\
// (at your option) any later version.\n\
//\n\
// This program is distributed in the hope that it will be useful,\n\
// but WITHOUT ANY WARRANTY; without even the implied warranty of\n\
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n\
// GNU General Public License for more details.\n\
//\n\
// You should have received a copy of the GNU General Public License\n\
// along with this program; if not, write to the Free Software\n\
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA\n\
//\n\
\n\
#ifndef VEINS_MOBILITY_TRACI_TRACIMOBILITY_H\n\
#define VEINS_MOBILITY_TRACI_TRACIMOBILITY_H\n\
\n\
#define TRACI_SIGNAL_PARKING_CHANGE_NAME \"parkingStateChanged\"\n\
\n\
#include <string>\n\
#include <fstream>\n\
#include <list>\n\
#include <stdexcept>\n\
\n\
#include \"veins/base/modules/BaseMobility.h\"\n\
#include \"veins/base/utils/FindModule.h\"\n\
#include \"veins/modules/mobility/traci/TraCIScenarioManager.h\"\n\
#include \"veins/modules/mobility/traci/TraCICommandInterface.h\"\n\
\n\
/**\n\
 * @brief\n\
 * Used in modules created by the TraCIScenarioManager.\n\
 *\n\
 * This module relies on the TraCIScenarioManager for state updates\n\
 * and can not be used on its own.\n\
 *\n\
 * See the Veins website <a href=\"http://veins.car2x.org/\"> for a tutorial, documentation, and publications </a>.\n\
 *\n\
 * @author Christoph Sommer, David Eckhoff, Luca Bedogni, Bastian Halmos, Stefan Joerer\n\
 *\n\
 * @see TraCIScenarioManager\n\
 * @see TraCIScenarioManagerLaunchd\n\
 *\n\
 * @ingroup mobility\n\
 */\n\
namespace Veins {\n\
class TraCIMobility : public BaseMobility\n\
{\n\
    public:\n\
        class Statistics {\n\
            public:\n\
                double firstRoadNumber; /**< for statistics: number of first road we encountered (if road id can be expressed as a number) */\n\
                simtime_t startTime; /**< for statistics: start time */\n\
                simtime_t totalTime; /**< for statistics: total time travelled */\n\
                simtime_t stopTime; /**< for statistics: stop time */\n\
"+stringScalar+"\n\
\n\
                void initialize();\n\
                void watch(cSimpleModule& module);\n\
                void recordScalars(cSimpleModule& module);\n\
        };\n\
\n\
        TraCIMobility() : BaseMobility(), isPreInitialized(false), manager(0), commandInterface(0), vehicleCommandInterface(0) {}\n\
        ~TraCIMobility() {\n\
            delete vehicleCommandInterface;\n\
        }\n\
        virtual void initialize(int);\n\
        virtual void finish();\n\
\n\
        virtual void handleSelfMsg(cMessage *msg);\n\
        virtual void preInitialize(std::string external_id, const Coord& position, std::string road_id = \"\", double speed = -1, double angle = -1);\n\
        virtual void nextPosition(const Coord& position, std::string road_id = \"\", double speed = -1, double angle = -1, TraCIScenarioManager::VehicleSignal signals = TraCIScenarioManager::VEH_SIGNAL_UNDEF);\n\
        virtual void changePosition();\n\
        virtual void changeParkingState(bool);\n\
        virtual void setExternalId(std::string external_id) {\n\
            this->external_id = external_id;\n\
        }\n\
        virtual std::string getExternalId() const {\n\
            if (external_id == \"\") throw cRuntimeError(\"TraCIMobility::getExternalId called with no external_id set yet\");\n\
            return external_id;\n\
        }\n\
        virtual double getAntennaPositionOffset() const {\n\
            return antennaPositionOffset;\n\
        }\n\
        virtual Coord getPositionAt(const simtime_t& t) const {\n\
            return move.getPositionAt(t) ;\n\
        }\n\
        virtual bool getParkingState() const {\n\
            return isParking;\n\
        }\n\
        virtual std::string getRoadId() const {\n\
            if (road_id == \"\") throw cRuntimeError(\"TraCIMobility::getRoadId called with no road_id set yet\");\n\
            return road_id;\n\
        }\n\
        virtual double getSpeed() const {\n\
            if (speed == -1) throw cRuntimeError(\"TraCIMobility::getSpeed called with no speed set yet\");\n\
            return speed;\n\
        }\n\
        virtual TraCIScenarioManager::VehicleSignal getSignals() const {\n\
            if (signals == -1) throw cRuntimeError(\"TraCIMobility::getSignals called with no signals set yet\");\n\
            return signals;\n\
        }\n\
        /**\n\
         * returns angle in rads, 0 being east, with -M_PI <= angle < M_PI.\n\
         */\n\
        virtual double getAngleRad() const {\n\
            if (angle == M_PI) throw cRuntimeError(\"TraCIMobility::getAngleRad called with no angle set yet\");\n\
            return angle;\n\
        }\n\
        virtual TraCIScenarioManager* getManager() const {\n\
            if (!manager) manager = TraCIScenarioManagerAccess().get();\n\
            return manager;\n\
        }\n\
        virtual TraCICommandInterface* getCommandInterface() const {\n\
            if (!commandInterface) commandInterface = getManager()->getCommandInterface();\n\
            return commandInterface;\n\
        }\n\
        virtual TraCICommandInterface::Vehicle* getVehicleCommandInterface() const {\n\
            if (!vehicleCommandInterface) vehicleCommandInterface = new TraCICommandInterface::Vehicle(getCommandInterface()->vehicle(getExternalId()));\n\
            return vehicleCommandInterface;\n\
        }\n\
\n\
\n\
    protected:\n\
        bool debug; /**< whether to emit debug messages */\n\
        int accidentCount; /**< number of accidents */\n\
\n\
"+stringVector+"\n\
\n\
        Statistics statistics; /**< everything statistics-related */\n\
\n\
        bool isPreInitialized; /**< true if preInitialize() has been called immediately before initialize() */\n\
\n\
        std::string external_id; /**< updated by setExternalId() */\n\
        double antennaPositionOffset; /**< front offset for the antenna on this car */\n\
\n\
        simtime_t lastUpdate; /**< updated by nextPosition() */\n\
        Coord roadPosition; /**< position of front bumper, updated by nextPosition() */\n\
        std::string road_id; /**< updated by nextPosition() */\n\
        double speed; /**< updated by nextPosition() */\n\
        double angle; /**< updated by nextPosition() */\n\
        TraCIScenarioManager::VehicleSignal signals; /**<updated by nextPosition() */\n\
\n\
        cMessage* startAccidentMsg;\n\
        cMessage* stopAccidentMsg;\n\
        mutable TraCIScenarioManager* manager;\n\
        mutable TraCICommandInterface* commandInterface;\n\
        mutable TraCICommandInterface::Vehicle* vehicleCommandInterface;\n\
        double last_speed;\n\
\n\
        const static simsignalwrap_t parkingStateChangedSignal;\n\
\n\
        bool isParking;\n\
\n\
\n\
        virtual void fixIfHostGetsOutside(); /**< called after each read to check for (and handle) invalid positions */\n\
\n\
        /**\n\
         * Returns the amount of CO2 emissions in grams/second, calculated for an average Car\n\
         * @param v speed in m/s\n\\n\
         * @param a acceleration in m/\n\s^2\n\
         * @returns emission in g/s\n\\n\
         */\n\\n\
        double calculateCO2emission(double v, double a) const;\n\
\n\
        /**\n\
         * Calculates where the antenna of this car is, given its front bumper position\n\
         */\n\
        Coord calculateAntennaPosition(const Coord& vehiclePos) const;\n\
};\n\
}\n\
\n\
namespace Veins {\n\
class TraCIMobilityAccess\n\
{\n\
    public:\n\
        TraCIMobility* get(cModule* host) {\n\
            TraCIMobility* traci = FindModule<TraCIMobility*>::findSubModule(host);\n\
            ASSERT(traci);\n\
            return traci;\n\
        };\n\
};\n\
}\n\
\n\
#endif\n\
"

    var file = new File([structure], {type: "application/xml;charset==utf-8"});
    saveAs(file, "TraCIMobility.h");
}