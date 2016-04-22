var VSS = function() {
    var head = document.getElementsByTagName('body')[0];
    this.enabled = false;
    this.cssCache = '';

    function createPanel() {
        var objPanel, objHeader, objList, objContainer, objClose;
        objHeader = document.createElement('h2');
        objHeader.setAttribute('id', 'vss-h2');
        objHeader.innerHTML = 'Style Sheets &darr;';
        objList = document.createElement('ul');
        objList.setAttribute('id', 'vss-list');
        for (var i = 0; i < document.styleSheets.length - 1; i++) {
            var link = document.styleSheets[i].href;
            if (link !== null) {
                objLi = "objItem" + (i + 1);
                objLink = "objA" + (i + 1);
                objLi = document.createElement('li');
                objList.appendChild(objLi);
                objLink = document.createElement('a');
                objLi.appendChild(objLink);
                objLink.innerHTML = cssFileName(link);
                objLink.setAttribute("href", link);
            };
        };
        objContainer = document.createElement('div');
        objContainer.appendChild(objHeader);
        objContainer.appendChild(objList);
        objPanel = document.createElement('div');
        objPanel.setAttribute('id', 'vss-panel');
        objPanel.appendChild(objContainer);
        document.body.appendChild(objPanel);
    }

    function openInNewTab(link) {
        safari.self.tab.dispatchMessage("doOpen", link);
    }

    function cssFileName(str) {
        var slash = '/';
        if (str.match(/\\/)) {
            slash = '\\';
        }
        return str.substring(str.lastIndexOf(slash) + 1, str.lastIndexOf('.'));
    }

    function addStyleTag() {
        var obj = document.createElement('style');
        obj.id = 'vss-styles';
        obj.setAttribute("type", "text/css");
        head.appendChild(obj);
    }

    function fillStyleTag(css) {
        var obj = document.getElementById('vss-styles');
        if (obj.styleSheet) {
            obj.styleSheet.cssText = css;
        } else {
            if (obj.lastChild) {
                obj.removeChild(obj.lastChild);
            }
            var txt = document.createTextNode(css);
            obj.appendChild(txt);
        }
        this.cssCache = css;
    }

    function init() {
        this.enabled = true;
        addStyleTag();
        fillStyleTag();
        createPanel();
    }

    function exit() {
        var obj = document.getElementById('vss-styles');
        obj.parentElement.removeChild(obj);
        var obj = document.getElementById('vss-panel');
        obj.parentElement.removeChild(obj);
        this.enabled = false;
    }
    return {
        show: function() {
            if (document.getElementById('vss-panel') !== null) {
                exit();
            } else {
                init();
            }
        },
        exit: function() {
            exit();
        }
    };
}();

function handleMessage(msgEvent) {
    var messageName = msgEvent.name;
    var messageData = msgEvent.message;
    if (messageName === "VSS") {
        VSS.show();
    }
}
safari.self.addEventListener("message", handleMessage, false);