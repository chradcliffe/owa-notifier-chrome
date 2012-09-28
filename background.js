function printError(e) {
    chrome.alarms.clearAll();
    webkitNotifications.createNotification('', 
            e, '').show();    
}

function setCheckAlarm() {
    chrome.alarms.create({'periodInMinutes': 1, 'delayInMinutes': 1});
}

function checkMail() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4)  {
          return;
      }
      if (xhr.responseText) {
          var matches = xhr.responseText.match(/Message: Unread/g);
          if (matches != null) {
              var count = matches.length;
              if (count > 0) {
                  chrome.alarms.clearAll();
                  var notification = webkitNotifications.createNotification(
                      '', 'New mail message', 'You have ' + count + ' new message(s)'
                  );
                  notification.onclose = setCheckAlarm;
                  notification.show();
              } else {
                  printError('Could not get message count from URL');
              }
          }
      } else {
          printError('Fetching failed');
      }
    };
    xhr.open("GET", localStorage["url"], true);
    xhr.send(null);
}
if (localStorage["url"] != ""){
    chrome.alarms.onAlarm.addListener(checkMail);
    setCheckAlarm();
    checkMail();
} else {
    printError('owa-notification-chrome not configured');
}
