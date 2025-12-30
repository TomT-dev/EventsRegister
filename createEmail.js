function testcreatePDFRegisterFor(){
createPDFRegisterFor('IPM:032, 30/03/2023');
}

function createPDFRegistersForTheseEvents(eventsDetails){
  Logger.log(eventsDetails);
  Logger.log('number of events = ' + eventsDetails.length);


}

function createPDFRegisterFor(eventCodeDetails) {
  Logger.log(eventCodeDetails)
  var d = new Date()
  var timeCreated = d.toString().slice(0,24);
  Logger.log(timeCreated);

  // get the registrations

  var thisEventData = 'registerEvent' + eventCodeDetails.toString().slice(0,7);
  var scriptProperties = PropertiesService.getScriptProperties();
  var memberRegister = [];

  memberRegister = JSON.parse(ScriptProperties.getProperty(thisEventData));
  Logger.log(memberRegister);
  var tableData = [['#', 'Mnum', 'Name']];
  var lineNum = 0;
  for(var x = 0 ; x < memberRegister.length ; x++){
    if(memberRegister[x][5]){
      lineNum++;
    tableData.push([lineNum.toString().padStart(3,''), memberRegister[x][0].toString().padStart(3,'0'),`${memberRegister[x][1]} ${memberRegister[x][3]} ${memberRegister[x][4]}`])
    }
  }
  Logger.log(tableData);
   
  // create a table
  //define header cell style which we will use while adding cells in header row
  //Backgroud color, text bold, white
  var headerStyle = {};
  headerStyle[DocumentApp.Attribute.BACKGROUND_COLOR] = '#2886e6';
  headerStyle[DocumentApp.Attribute.BOLD] = true;
  headerStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#FFFFFF';
  //Style for the cells other than header row
  var cellStyle = {};
  cellStyle[DocumentApp.Attribute.BOLD] = false;
  cellStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#000000';
  //By default, each paragraph had space after, so we will change the paragraph style to add zero space
  //we will use it later
  var paraStyle = {};
  paraStyle[DocumentApp.Attribute.SPACING_AFTER] = 0;
  paraStyle[DocumentApp.Attribute.LINE_SPACING] = 1;
  paraStyle[DocumentApp.Attribute.FONT_SIZE] = 12;

  //get the document

  var templateDocId = '1PG01VspAN907eGUynlGhl448OQGWar2ItOZG_r3R8j4';
  var pdfTemplateFile = DriveApp.getFileById(templateDocId );
  var pdfFilename = eventCodeDetails + ' register, created on ' + timeCreated;
  var pdfFolder = DriveApp.getFolderById('1XRqF1OiwjtuLr7wd-ai-7DOuz8q_O2E0');
  var pdfFile= pdfTemplateFile.makeCopy(pdfFilename, pdfFolder);
  var docId = pdfFile.getId();

  // open the file as google doc for processing

  var doc = DocumentApp.openById(pdfFile.getId());
  var hdr = doc.addHeader();
  var hdrStyle = {};
  hdrStyle[DocumentApp.Attribute.FONT_FAMILY] = 'Calibri';
  hdrStyle[DocumentApp.Attribute.FOREGROUND_COLOR] = '#005ab8';
  hdrStyle[DocumentApp.Attribute.FONT_SIZE] = 18;
  hdrStyle[DocumentApp.Attribute.BOLD] = true;
  var hdrText = 'Event register for ' + eventCodeDetails;
  hdr.setText(hdrText);
  hdr.setAttributes(hdrStyle);
  //get the body section of document
  var body = doc.getBody();
  body.clear();
  //Add a table in document
  var table = body.appendTable();
  var val = "";
  //Create 5 rows and 3 columns
  for (var i = 0; i < tableData.length; i++) {
    var tr = table.appendTableRow();
    //add 2 cells in each row
    for (var j = 0; j < 3; j++) {
      val = tableData[i][j];
      if (val == null) { val = '' };
      Logger.log(val);
      if (j < 2) {
        var td = tr.appendTableCell(val).setWidth(50);
      };
      if (j == 2) {
        var td = tr.appendTableCell(val);
      };
      //if it is header cell, apply the header style else cellStyle
      if (i == 0) td.setAttributes(headerStyle);
      else td.setAttributes(cellStyle);
      //Apply the para style to each paragraph in cell
      var paraInCell = td.getChild(0).asParagraph();
      paraInCell.setAttributes(paraStyle);
    };
  }
  //Save and close the document
  doc.saveAndClose();
  Logger.log('doc id is ' + docId);
  return docId;
}

function doc_to_html(document_Id) {
  var id = document_Id;
  var url = "https://docs.google.com/feeds/download/documents/export/Export?id=" + id + "&exportFormat=html";
  var param =
  {
    method: "get",
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  };
  var htmlBody = UrlFetchApp.fetch(url, param).getContentText();
  return htmlBody;
}

function emailpdf(fileId){
  Logger.log('sending email')
        var htmlBody = doc_to_html(fileId);

        GmailApp.sendEmail('webmaster@goringgapu3a.org.uk', 'register', 'here it is', {
        htmlBody: htmlBody,

      });
}

