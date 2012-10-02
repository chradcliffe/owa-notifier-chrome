function printError(e) {
    chrome.alarms.clearAll();
    webkitNotifications.createNotification('', 
            e, '').show();    
}

function setCheckAlarm() {
    chrome.alarms.create({'periodInMinutes': 1, 'delayInMinutes': 1});
}

function size(set) {
    var size = 0;
    for(var i in set) {
        if (set.hasOwnProperty(i)) {
            size++;
        }
    }
    return size;
}



function checkMail() {
    if (localStorage["message_set"] == undefined) {
        localStorage["message_set"] = JSON.stringify(new Object());
    }
    $.get(localStorage["url"], function(data) {
        var newSet = {};
        var oldSet = JSON.parse(localStorage["message_set"]);
        var shouldNotify = false;
        $(data).find(".sI[alt='Message: Unread']").parent().siblings("td").find("input[name='chkmsg']")
                .each(function() {
            if (!(this.value in oldSet)) {
                shouldNotify = true;
            }
            newSet[this.value] = null;
        });
        if (shouldNotify) {
            var notification = webkitNotifications.createNotification('',
                    'New mail message',
                    'You have ' + size(newSet) + ' new message(s)');
            notification.onclose = function() {
                setCheckAlarm();
                localStorage["message_set"] = JSON.stringify(newSet);
            };
            notification.show();
            // TODO: fix this, it's not working for some reason
            // chrome.tabs.query({url: localStorage["url"]+"/*"}, function(results) {
            //     for (var tab in results) {
            //         chrome.tabs.reload(tab.id);
            //     }
            // });
        }
    });
}

$(document).ready(function() {
    if (localStorage["url"] != ""){
        chrome.alarms.onAlarm.addListener(checkMail);
        setCheckAlarm();
        checkMail();
    } else {
        printError('owa-notification-chrome not configured');
    }
});
