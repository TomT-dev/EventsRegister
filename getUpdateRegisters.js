function testCode() {
  Logger.log(getRegisteredMembersData(JSON.stringify(['1674295910871',])));
}

function deleteregister() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteProperty('registerEventIPM:039');
}


function getDayDateAsString(d) {
  let today = d.getFullYear().toString() + d.getMonth().toString().padStart(2, "0") + d.getDate().toString().padStart(2, "0");
  return today
}

function xxxx() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteProperty('registerEventIPM:039');

}

function updateTodaysRegister() {
  let currentEvents = getEventsFromProperties();
  Logger.log(currentEvents);
  let eventDates = currentEvents.map(value => getDayDateAsString(value[0]));
  Logger.log(eventDates)
  let d = new Date();
  let today = getDayDateAsString(d);

  Logger.log(`Todays date = ${d}, as string: ${today}`)
  var response;
  var eventCode;

  for (var i = 0; i < eventDates.length; i++) {
    if (eventDates[i] == today) {
      eventCode = currentEvents[i][3];
      Logger.log(`Update todays event: ${eventCode}`);
      response = updateMembersInThisRegister(eventCode);
      Logger.log(response)
    }
  }

  if (response == null) {
    response = { 'actionTaken': 'none' };
  } else (
    response.actionTaken = 'update requested'
  )

  Logger.log(response)
  Logger.log(response.actionTaken);
  return response

}

function getStartOfCurrentDay() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return startOfDay;
}

// Example usage
function testGetStartOfCurrentDay() {
  const startOfDay = getStartOfCurrentDay();
  Logger.log(`Start of the current day: ${startOfDay}`);
}


function updateAllExisting_Current_Future_Registers() {

  var scriptProperties = PropertiesService.getScriptProperties();
  let eventRegisters = scriptProperties.getKeys().filter(value => value.indexOf('registerEvent') > -1).toString();
  // Logger.log(eventRegisters);
  let d = getStartOfCurrentDay();
  let events = getEventsFromProperties().filter(value => value[0] >= d).map(value => value[3]);
  let eventsWithRegisters = events.filter(value => eventRegisters.indexOf(value) > -1)
  // Logger.log(events);
  // Logger.log(eventsWithRegisters)


  for(let i = 0 ; i < eventsWithRegisters.length ; i++){
   let response = updateMembersInThisRegister(eventsWithRegisters[i]);
  //  Logger.log(response);

  }
}

function updateMembersInThisRegister(eventCode) {
  Logger.log(`event code received - ${eventCode}`)


  var scriptProperties = PropertiesService.getScriptProperties();
  let registerExists = false;

  // cache and retrieve the current members to make sure we are working with the currently members
  cacheMembers();
  let members = getMembersFromProperties();
  let memberNumbers = members.map(value => value[0]).toString();
  // Logger.log('member numbers');
  // Logger.log(memberNumbers)

  // get the  event register
  var thisEventRegisterCode = `registerEvent${eventCode}`;
  Logger.log(`thisEventRegisterCode = ${thisEventRegisterCode}`);
  // get the event register 
  var thisEventRegister = JSON.parse(scriptProperties.getProperty(thisEventRegisterCode));
  var thisEventRegisterMemberNumbers = thisEventRegister.map(value => value[0]).toString();
  // Logger.log('thisEventRegisterMemberNumbers');
  // Logger.log(thisEventRegisterMemberNumbers);
  // find any new members
  var updatedRegister = thisEventRegister;

  // check for new members
  let addedMembers = [];

  for (var i = 0; i < members.length; i++) {
    if (thisEventRegisterMemberNumbers.indexOf(members[i][0].toString()) == -1) {
      // this is a new member not in the register, so add it to the updated register
      updatedRegister.push([members[i][0], members[i][1], members[i][2], members[i][3], members[i][4], false, false, false]);
      addedMembers.push(`${members[i][3]} ${members[i][4]}`);
      Logger.log('new member added to register');
      [members[i][0], members[i][1], members[i][2], members[i][3], members[i][4], false, false, false]
    }
  }

  // sort the updated register by name


  // define sort routine

  var sortbyName = function sortFunction(a, b) {

    if (a[4] < b[4]) {
      return -1;
    } else if (a[4] > b[4]) {
      return 1;
    } else if (a[4] === b[4] && a[2] == b[2]) { // if the surnames and initials are the same
      return 0
    } else if (a[4] === b[4] && a[2] < b[2]) { // surnames same but initials different
      return -1;
    } else {
      return 1;
    }
  };

  updatedRegister.sort(sortbyName);
  let response = {};
  response.memberRegister = updatedRegister;

  // Logger.log(updatedRegister);
  if (addedMembers.length == 0) {
    response.msg = 'There are no new members to add';
    
  } else if (addedMembers.length == 1) {
    response.msg = `${addedMembers[0]} has been added to the table`;
  } else {
    response.msg = `${addedMembers.toString()} have been added to the table`;
  }
  Logger.log(response.msg);
  response.updated = true;
  response.eventCode = eventCode

  scriptProperties.setProperty(`registerEvent${eventCode}`, JSON.stringify(response.memberRegister));
  Logger.log(`response.eventCode`)
  Logger.log(`response.eventCode = ${response.eventCode}`)
  // Logger.log(response);

  return response;

}

function updateMembersInThisRegisterzz(eventCode) {
  eventCode = 'IPM:039';
  var scriptProperties = PropertiesService.getScriptProperties();
  let registerExists = false;

  // check if this event is in the past - getEventsFromProperties() returns current events only

  let isCurrentEvent = getEventsFromProperties().toString().indexOf(eventCode) > -1 ? true : false;
  let response = {};
  Logger.log(isCurrentEvent);
  if (isCurrentEvent) {
    // cache and retrieve the current members to make sure we are working with the currently members
    cacheMembers();
    let members = getMembersFromProperties();

    // create a new event register with no registrations
    var cleanEventRegister = getMembersFromProperties().map(value => [value[0], value[1], value[2], value[3], value[4], false, false, false]);

    // get the current event register
    var thisEventRegisterCode = `registerEvent${eventCode}`;
    Logger.log(`thisEventRegisterCode = ${thisEventRegisterCode}`);

    registerExists = scriptProperties.getKeys().toString().indexOf(thisEventRegisterCode) > -1 ? true : false;
    let thisEventRegister = [];

    if (registerExists) {
      // get the event register 
      thisEventRegister = JSON.parse(scriptProperties.getProperty(thisEventRegisterCode));

      let thisEventRegisteredMembers = [];
      // if attending in person or by zoom is set to TRUE, copy member's registration record to thisEventRegisteredMembers 
      thisEventRegisteredMembers = thisEventRegister.map(value => value[5] || value[7] ? value : null).filter(value => value != null);
      Logger.log('thisEventRegisteredMembers');
      Logger.log(thisEventRegisteredMembers);
      Logger.log(` number of registered members = ${thisEventRegisteredMembers.length}`);

      // copy across any entries from current members
      // for each member in the clean event register check through thisEventRegisteredMembers array to see if it a regsitered member
      // and if it is overwrite the record in the clean event register

      for (var i = 0; i < cleanEventRegister.length; i++) {

        for (var j = 0; j < thisEventRegisteredMembers.length; j++) {

          if (cleanEventRegister[i][0] == thisEventRegisteredMembers[j][0]) {
            // copy across data
            Logger.log(`match cleanEventRegister - ${i}, ${cleanEventRegister[i][0]} : thisEventRegisteredMembers - ${j}, ${thisEventRegisteredMembers[j][0]}`);
            cleanEventRegister[i][5] = thisEventRegisteredMembers[j][5];
            cleanEventRegister[i][6] = thisEventRegisteredMembers[j][6];
            cleanEventRegister[i][7] = thisEventRegisteredMembers[j][7];

          }

        }

      }

      Logger.log('UPDATED cleanEventRegister with current registered members');
      Logger.log(cleanEventRegister);
      let before = cleanEventRegister.length;

      // now copy across any guests

      let guestsRegistered = thisEventRegisteredMembers.map(value => parseInt(value[0]) > 9000 ? value : null).filter(value => value != null);
      Logger.log('guestsRegistered');
      Logger.log(guestsRegistered);

      for (x = 0; x < guestsRegistered.length; x++) {
        cleanEventRegister.push(guestsRegistered[x]);

      }

      Logger.log(`added ${guestsRegistered.length} guests to cleanEventRegister`);
      Logger.log(`length before = ${before}, number guests = ${guestsRegistered.length}, number after = ${cleanEventRegister.length}`);
      response.msg = 'Register checked to ensure all current members and guests included';
      // now check whether any members have been deleted

      let notCopied = [];

      let memberNumbers = cleanEventRegister.map(value => value[0]).toString();
      Logger.log('membernumbers = ' + memberNumbers);

      for (var y = 0; y < thisEventRegisteredMembers.length; y++) {
        Logger.log('checking record ' + thisEventRegisteredMembers[y]);
        if (memberNumbers.indexOf(thisEventRegisteredMembers[y][0].toString()) < 0) {
          Logger.log('This record not copied over ' + thisEventRegisteredMembers[y]);
          cleanEventRegister.push(thisEventRegisteredMembers[y])
          notCopied.push(thisEventRegisteredMembers[y]);
          response.msg = 'Register updated - note, some attendees are no longer u3a members';
        } else {
          Logger.log(`member number ${thisEventRegisteredMembers[y][0].toString()} was copied over`);
        }

      }

      Logger.log(notCopied);
      response.notCopied = notCopied;



    } else {
      thisEventRegister = cleanEventRegister;
      response.msg = 'Nobody registered but updated to include all members';
    }

    response.memberRegister = cleanEventRegister;

  } else {
    response.msg = `${eventCode} is a past event, you cannot update the list of members in it.`;
    Logger.log(`msg returned = ${response.msg}`);
  }



  response.eventCode = eventCode

  scriptProperties.setProperty(`registerEvent${eventCode}`, JSON.stringify(cleanEventRegister));

  return response;

}

function getRegisteredMembersData(dataJSON) {
  var data = JSON.parse(dataJSON);
  Logger.log(data);
  Logger.log('data length = ' + data.length);
  var sessionId = data[0];
  var eventCode = data[1];
  Logger.log('received ' + sessionId + ' ' + eventCode);

  var response = {};

  if (data[1] == "") {
    Logger.log('no event code ')
    response.sessionIdOk = 'null event code';
    response.sessionId = sessionId;
    Logger.log('response is');
    Logger.log(response);
    return response;

  } else {

    var thisEventData = 'registerEvent' + eventCode.toString();
    var scriptProperties = PropertiesService.getScriptProperties();
    var memberRegister = [];

    if (checkSessionIdValid(sessionId)) {
      Logger.log('getting register')

      memberRegister = JSON.parse(scriptProperties.getProperty(thisEventData));

      if (memberRegister == null) {

        // make new reg table for this event

        var data = getMembersFromProperties();

        Logger.log(data);

        memberRegister = data.map(value => [value[0], value[1], value[2], value[3], value[4], false, false, false]);
        Logger.log('member register follows')
        Logger.log(memberRegister);

      }

      scriptProperties.setProperty(thisEventData, JSON.stringify(memberRegister));
      response.memberRegister = memberRegister;
      response.eventCode = eventCode;
      response.sessionIdOk = 'validSessionId';
      response.sessionId = sessionId;
      Logger.log(response);

      return response;

    } else {

      response.sessionIdOk = 'invalidSessionId';
      response.sessionId = sessionId;
      Logger.log('response is');
      Logger.log(response);
      return response;
    }
  }

}

function getRegisteredlMembersTable(dataJSON) {

  var data = JSON.parse(dataJSON);
  Logger.log(data);

  var sessionId = data[0];
  var eventCode = data[1];
  Logger.log('received ' + sessionId + ' ' + eventCode);

  var response = {};

  if (checkSessionIdValid(sessionId)) {

    var registeredMembers = getEventRegister(eventCode);
    Logger.log(registeredMembers);


    response.registeredMembers = registeredMembers;
    response.eventCode = eventCode;
    Logger.log(response);
    //  Logger.log(makeTable(response));
    return makeTable(response);

  } else {
    response.sessionIdOk = 'invalidSessionId';
    response.sessionId = sessionId;
    Logger.log('response is');
    Logger.log(response);
    return response;
  }


}


function UNUSEDmakeTable(response) {
  Logger.log('MAKETABLE');

  // response is a json
  //  response.eventCode is the eventCode
  // response.membersTable is the table for this event
  // the fields in this table (data) are
  // mnum = data[index][0];
  // memberTitle = data[index][1];
  // memberForename = data[index][3];
  // memberSurname = data[index][4];
  // registered = data[index][5] - value = true / false
  // checked = data[index][6] - value = true / false

  var regLink, checkLink, part1, part2, iconColour, thisUrl, thisReg = {}, mnum;

  //  var response = JSON.parse(responseJson);

  var sessionIdOk = response.sessionIdOk;
  var eventCode = response.eventCode;

  var data = response.registeredMembers;

  var membersTable = `<table id="membersTable" style="font-size: 1.5vw;"><tr>
                        <th>MNUM</th>
                        <th>Name</th>
                        <th>Register</th>
						<th>Check</th>
                      </tr>`;

  for (var index = 0; index < data.length; index++) {

    thisReg.eventCode = eventCode;
    thisReg.mnum = data[index][0];
    thisReg.memberTitle = data[index][1];
    thisReg.memberForename = data[index][3];
    thisReg.memberSurname = data[index][4];
    thisReg.memberRegistered = data[index][5];
    thisReg.memberChecked = data[index][6];
    Logger.log(thisReg);


    part1 = `<button id="showbtn" 
                class= "saveButton" 
                onclick=registerMemberFor(${JSON.stringify(thisReg)})>
                <i class="material-icons md-40" style="width:100%; height:auto; padding-left: 1.1vw;color:`;

    part2 = `;">`;



    part3 = `</i></button>`;


    mnum = data[index][0].toString().padStart(3, "0");
    if (mnum.length > 3) {
      mnum = mnum.slice(0, 3) + '-';
    }



    if (data[index][5]) {

      regLink = part1 + '#2eb82e' + part2 + 'how_to_reg' + part3;
    } else {
      regLink = part1 + '#a6a6a6' + part2 + 'psychology_alt' + part3;

    }

    if (data[index][6]) {

      checkLink = part1 + '#2eb82e' + part2 + 'how_to_reg' + part3;

    } else {

      checkLink = part1 + ' #a6a6a6' + part2 + 'psychology_alt' + part3;
    }

    membersTable = membersTable + `<tr>
                                        <td>${mnum}</td>
                                        <td>${data[index][1]} ${data[index][3]} ${data[index][4]}</td>
                                        <td>${regLink}</td>
										<td>${checkLink}</td>
                                        </tr>`;


  }
  membersTable = membersTable + '</row>';
  Logger.log(membersTable);
  return membersTable;

}

function showregData() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var memberRegister = JSON.parse(scriptProperties.getProperty('registerEventIPM:030'));

  for (var i = 0; i < 10; i++) {
    Logger.log(memberRegister[i]);
  }

}

function manageMemberFor(thisReg) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // wait 30 seconds for others' use of the code section and lock to stop and then proceed
  } catch (e) {
    Logger.log('Could not obtain lock after 30 seconds.');
    return "Server Busy please try after some time ";
  }

  Logger.log(thisReg);

  var eventCode, sessionId, member2Register, action, field2Change, changeValueTo;
  eventCode = thisReg.eventCode;
  Logger.log('event code = ' + eventCode);
  sessionId = thisReg.sessionId;
  var thisEventData = 'registerEvent' + eventCode.toString();
  Logger.log('thisEventData = ' + thisEventData);
  var scriptProperties = PropertiesService.getScriptProperties();
  var memberRegister = JSON.parse(scriptProperties.getProperty(thisEventData));
  let currentStatus = {};

  Logger.log(memberRegister[0]);
  for (var i = 0; i < memberRegister.length; i++) {
    if (memberRegister[i][0].toString() == thisReg.mnum.toString()) {
      Logger.log('match ' + memberRegister[i][0].toString())
      currentStatus.registered = memberRegister[i][5];
      currentStatus.checked = memberRegister[i][6];
      currentStatus.zoomed = memberRegister[i][7];
      memberRegister[i][5] = thisReg.memberRegistered;
      memberRegister[i][6] = thisReg.memberChecked;
      memberRegister[i][7] = thisReg.memberZoomed;
      Logger.log(memberRegister[i]);
      scriptProperties.setProperty(thisEventData, JSON.stringify(memberRegister));
    }
  }

  var response = {};
  var numAttendees = memberRegister
    .map(value => {
      if (value[5]) {
        return value[0];
      }
    })
    .filter(value => value != null).length;

  response.numAttendees = numAttendees;

  const preamble = `${thisReg.memberTitle} ${thisReg.memberForename} ${thisReg.memberSurname} has been `;

  let registeredStatus = thisReg.memberRegistered ? 'registered as attending in person.' : 'removed from the register.';
  let checkedStatus = thisReg.memberChecked ? `checked as present in roll call` : `removed from the roll call`;
  let zoomStatus = thisReg.memberZoomed ? 'marked as attending via Zoom.' : 'removed from attending via Zoom.';

  if (!currentStatus.registered && thisReg.memberRegistered || currentStatus.registered && !thisReg.memberRegistered) {
    // the action was to register or de register the member
    response.status = preamble + registeredStatus;

  } else if (!currentStatus.checked && thisReg.memberChecked || currentStatus.checked && !thisReg.memberChecked) {
    // the action was to check or decheck the member
    response.status = preamble + checkedStatus;

  } else if (!currentStatus.zoomed && thisReg.memberZoomed || currentStatus.zoomed && !thisReg.memberZoomed) {
    //action was to mark as zoom or de zoom member
    response.status = preamble + zoomStatus;

  } else {
    response.status = `${thisReg.memberTitle} ${thisReg.memberForename} ${thisReg.memberSurname} has been ${registeredStatus}, ${checkedStatus}, and ${zoomStatus}`;
  }

  lock.releaseLock();
  return response;
}


function registerMemberFor(thisReg) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // wait 30 seconds for others' use of the code section and lock to stop and then proceed
  } catch (e) {
    Logger.log('Could not obtain lock after 30 seconds.');
    return "Server Busy please try after some time ";
  }
  Logger.log(thisReg);
  Logger.log(thisReg.memberRegistered);

  var eventCode, sessionId, member2Register, action, field2Change, changeValueTo;
  eventCode = thisReg.eventCode;
  Logger.log('event code = ' + eventCode);
  sessionId = thisReg.sessionId;
  var thisEventData = 'registerEvent' + eventCode.toString();
  Logger.log('thisEventData = ' + thisEventData);
  var scriptProperties = PropertiesService.getScriptProperties();
  var memberRegister = JSON.parse(scriptProperties.getProperty(thisEventData));
  Logger.log(memberRegister[0]);
  for (var i = 0; i < memberRegister.length; i++) {
    if (memberRegister[i][0].toString() == thisReg.mnum.toString()) {
      Logger.log('match ' + memberRegister[i][0].toString())
      memberRegister[i][5] = thisReg.memberRegistered;
      Logger.log(memberRegister[i]);
      scriptProperties.setProperty(thisEventData, JSON.stringify(memberRegister));
    }
  }
  var response = {};
  if (thisReg.memberRegistered) {
    response.status = `${thisReg.memberTitle} ${thisReg.memberForename} ${thisReg.memberSurname} has been added to the register`;
  } else {
    response.status = `${thisReg.memberTitle} ${thisReg.memberForename} ${thisReg.memberSurname} has been removed from the register`;
  }

  var numAttendees = memberRegister.map(value => {
    if (value[5]) {
      return value[0];
    };
  }).filter(value => value != null).length;

  response.numAttendees = numAttendees;

  lock.releaseLock()
  return response;
}

function checkMemberFor(thisReg) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // wait 30 seconds for others' use of the code section and lock to stop and then proceed
  } catch (e) {
    Logger.log('Could not obtain lock after 30 seconds.');
    return "Server Busy please try after some time ";
  }
  Logger.log(thisReg);
  Logger.log(thisReg.memberChecked);

  var eventCode, sessionId, member2Register, action, field2Change, changeValueTo;
  eventCode = thisReg.eventCode;
  Logger.log('event code = ' + eventCode);
  sessionId = thisReg.sessionId;
  var thisEventData = 'registerEvent' + eventCode.toString();
  Logger.log('thisEventData = ' + thisEventData);
  var scriptProperties = PropertiesService.getScriptProperties();
  var memberRegister = JSON.parse(scriptProperties.getProperty(thisEventData));
  Logger.log(memberRegister[0]);
  for (var i = 0; i < memberRegister.length; i++) {
    if (memberRegister[i][0].toString() == thisReg.mnum.toString()) {
      Logger.log('match ' + memberRegister[i][0].toString())
      memberRegister[i][6] = thisReg.memberChecked;
      Logger.log(memberRegister[i]);
      scriptProperties.setProperty(thisEventData, JSON.stringify(memberRegister));
    }
  }
  var response = {};
  if (thisReg.memberChecked) {
    response.status = `${thisReg.memberTitle} ${thisReg.memberForename} ${thisReg.memberSurname} has been marked as Present`;
  } else {
    response.status = `${thisReg.memberTitle} ${thisReg.memberForename} ${thisReg.memberSurname} has been marked as NOT Present`;
  }
  lock.releaseLock();
  return response;
}

function zoomMemberFor(thisReg) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // wait 30 seconds for others' use of the code section and lock to stop and then proceed
  } catch (e) {
    Logger.log('Could not obtain lock after 30 seconds.');
    return "Server Busy please try after some time ";
  }
  Logger.log(thisReg);
  Logger.log(thisReg.memberZoomed);

  var eventCode, sessionId, member2Register, action, field2Change, changeValueTo;
  eventCode = thisReg.eventCode;
  Logger.log('event code = ' + eventCode);
  sessionId = thisReg.sessionId;
  var thisEventData = 'registerEvent' + eventCode.toString();
  Logger.log('thisEventData = ' + thisEventData);
  var scriptProperties = PropertiesService.getScriptProperties();
  var memberRegister = JSON.parse(scriptProperties.getProperty(thisEventData));
  Logger.log(memberRegister[0]);
  for (var i = 0; i < memberRegister.length; i++) {
    if (memberRegister[i][0].toString() == thisReg.mnum.toString()) {
      Logger.log('match ' + memberRegister[i][0].toString())
      memberRegister[i][7] = thisReg.memberZoomed;
      Logger.log(memberRegister[i]);
      scriptProperties.setProperty(thisEventData, JSON.stringify(memberRegister));
    }
  }
  var response
  if (thisReg.memberZoomed) {
    response = `${thisReg.memberTitle} ${thisReg.memberForename} ${thisReg.memberSurname} has been marked as Present on Zoom`;
  } else {
    response = `${thisReg.memberTitle} ${thisReg.memberForename} ${thisReg.memberSurname} has been marked as NOT Present om Zoom`;
  }
  lock.releaseLock();
  return response;
}

function addGuest(guestTitle, guestForename, guestSurname, guestPhone, eventCode) {
  Logger.log(guestTitle + ' , ' + guestForename + ' , ' + guestSurname + ' , ' + guestPhone + ' , ' + eventCode);
  // get register for event
  var thisEventData = 'registerEvent' + eventCode.toString();

  var response = {};
  var scriptProperties = PropertiesService.getScriptProperties();
  var memberRegister = [];
  memberRegister = JSON.parse(scriptProperties.getProperty(thisEventData));
  var rowId = memberRegister.length;
  var lastMember = memberRegister.length - 1;
  Logger.log(lastMember);
  Logger.log(memberRegister[lastMember]);
  var guests = memberRegister.map(value => {
    if (value[0] > 9000) {
      return value[0];
    };
  }).filter(value => value != null);
  var nextNumber;
  Logger.log('guests ' + guests);

  nextNumber = 9001 + guests.length;

  Logger.log(nextNumber);

  memberRegister.push([nextNumber, guestTitle, guestForename.slice(0, 1).toUpperCase(), guestForename, guestSurname + ' - ' + guestPhone, true, false, false]);
  lastMember = memberRegister.length - 1;
  Logger.log(memberRegister[lastMember]);
  scriptProperties.setProperty(thisEventData, JSON.stringify(memberRegister));
  var response = {};
  response.mnum = nextNumber;
  response.title = guestTitle;
  response.forename = guestForename;
  response.surname = guestSurname;
  response.phone = guestPhone;
  response.eventCode = eventCode;
  response.status = true;
  response.rowId = rowId;
  return response;
}

function max(input) {
  if (toString.call(input) !== "[object Array]")
    return false;
  return Math.max.apply(null, input);
}

function emailRegisterFor(eventCodeDetails) {
  eventCode = eventCodeDetails.toString().split(',')[0].trim().replace("/","-")
  Logger.log(eventCode);
  try {
    var msg;
    const SS = SpreadsheetApp.openById('1FwHzbMzO_iXtALkrQryf0YnjQf5uJ_ONh3-BCzCs_ss');
    const emailToWs = SS.getSheetByName('emailRegisterTo');
    const numRows = emailToWs.getRange(1, 2).getDataRegion().getLastRow();
    Logger.log('numrows ' + numRows)
    const emailAddresses = emailToWs.getRange(1, 1, numRows, 1).getValues().toString();
    Logger.log(emailAddresses);
    var emailSubject = 'Register for ' + eventCode
    var fileId = createPDFRegisterFor(eventCode);
    var htmlBody = doc_to_html(fileId);

    GmailApp.sendEmail(emailAddresses, emailSubject, 'you cannot receive the event register, contact Tom', {
      htmlBody: htmlBody,

    });

    msg = "The register for " + eventCode + " has been emailed to the designated contacts";
  } catch (e) {
    Logger.log(JSON.stringify(e));
    var d = new Date();
    msg = "There has been an error, contact Tom and give him the following date and time: " + d;
  }
  return msg

}




function uploadBeaconExtract(data, fileName) {
  Logger.log(fileName);
  // let result = .uploadFileToGoogleDrivev2023(data,fileName);
  Logger.log(ManageMemberDatabase.uploadFileToGoogleDrivev2023(data, fileName));

  return 'something';
}
