function save_options() {
    var url = document.getElementById("url");
    localStorage["url"] = url.value;
    var status = document.getElementById("status");
    status.innerHTML = "Options Saved.";
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
    chrome.alarms.create({'delayInMinutes': 1});
}

function restore_options() {
    var url = localStorage["url"];
    if (!url) {
        return;
    }
    document.getElementById("url").value = url;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#save').addEventListener('click', 
            save_options);
});
