// TODO: fix globals...
var markers = [];
var currentlyShowing = false;
var currTypedCopyString = "";
var currMarkerType = "";


// Note, inspired by vimium.
class HintMarker {
		element;
		markerType;
		copyString;
		linkUrl;
		cardKey;
}

function buildCopyKeys(maxMarkers) {
		var chars = "FDSJKL";
		var copyKeys = [""];
		while (copyKeys.length < maxMarkers) {
				const e = copyKeys.shift();
				for (const c of chars) {
						copyKeys.push(e + c);
				}
		}
		return copyKeys;
}

function isHidden(el) {
		return (el.offsetParent === null)
}


function getText(c) {
		// TODO: Should it be one or the other? how do these really differ? User can configure it?
		return c.innerText || c.textContent
}

function addCopyMarkers() {
		addMarkers("code", "copy");
}

function addLinkMarkers() {
		addMarkers("a", "goto");
}

function getUrl(anchor) {
		return anchor.href;
}

function findElements(divType, markerType) {
		if (markerType == "goto") {
				return document.querySelectorAll(divType);
		} else if (markerType == "copy") {
				var codes = [...document.querySelectorAll("code")];
				var spans = [...document.querySelectorAll("span, pre")];
				for (const c of spans) {
						if (c.innerText.length > 20) {
								codes.push(c);
						}
				}
				return codes;
		}
}

function addMarkers(divType, markerType) {
		const elems = findElements(divType, markerType);
		if (elems) {
				var tmpCopyKeys = buildCopyKeys(elems.length);
				console.log(tmpCopyKeys);
				var markerIndex = 0;
				var nextChar = "A";
				for (const c of elems) {
						if (isHidden(c)) {
								continue;
						}
						var marker = new HintMarker();
						marker.markerType = markerType;
						var el = document.createElement("div");
						var rect = c.getBoundingClientRect();
						var yOffset = window.pageYOffset;
						var copyKey = tmpCopyKeys[markerIndex]; 

						// stylistic offset
						var stylisticOffset = 5;
						el.style.left = (rect.left - stylisticOffset) + "px";
						el.style.top = (yOffset + rect.top - stylisticOffset - 10) + "px";
						el.style.paddingLeft = "5px";
						el.style.paddingRight = "5px";
						el.style.position = "absolute";
						el.innerHTML = copyKey;
						el.id="test_id";
						el.style.visibility = "hidden";
						
						marker.cardKey = copyKey;
						marker.copyString = getText(c);
						marker.linkUrl = getUrl(c);
						marker.element = el;


						document.body.appendChild(el);
						markers.push(marker);
						markerIndex++;
				}
		}
}

function highlightMarkers(elems, markerType) {
		for (const m of markers) {
				if (m.markerType != markerType) {
						continue;
				}
				m.element.style.backgroundColor = "#5283ff";
				m.element.style.visibility = "visible";
		}
}

function hideMarkers() {
		for (const m of markers) {
				hideMarker(m);
		}
}
function hideMarker(m) {
		m.element.style.visibility = "hidden";
		m.element.innerHTML = m.cardKey;
}

function highlightPrefix(m, prefix) {
		var e = m.element;
		e.innerHTML = "";
		remaining = m.cardKey.slice(prefix.length);
		e.innerHTML = "<span style='color:red'>" + prefix + "</span>" + remaining;
}

function takeAction(m) {
		if (m.markerType == "copy") {
				navigator.clipboard.writeText(m.copyString);
		} else if (m.markerType == "goto") {
				// open page;
				window.open(m.linkUrl, '_blank').focus();
		}
}

function processKeyEvent(zEvent, elems, markerType) {
		if (zEvent.ctrlKey || zEvent.shiftKey || zEvent.altKey || zEvent.escKey) {
				// If user is pressing ctrl, they are issuing a command, not a copy.
				return false;
		}

		currTypedCopyString += zEvent.key.toUpperCase();
		for (const m of markers) {
				if (m.markerType != markerType) {
						continue;
				}
				
				// TODO :: implement similar to vimium, to allow multiple keys in the copy code.
				if (m.cardKey.startsWith(currTypedCopyString)) {
						highlightPrefix(m, currTypedCopyString);
				} else {
						hideMarker(m);
				}
				if (m.cardKey == currTypedCopyString) {
						takeAction(m);
						return true;
				}
		}
		return false;
}

function keyMatches(zEvent, keyStr) {
		return zEvent.ctrlKey && zEvent.shiftKey && (zEvent.key == keyStr)
}

function resetMarkerState() {
		hideMarkers();
		currentlyShowing = false;
		currTypedCopyString = "";
}

function toggleMarkers(markerType) {
		if (currentlyShowing) {
				resetMarkerState();
		} else {
				currentlyShowing = true;
				highlightMarkers(markers, markerType);
		}
}

function toggleCopy() {
		toggleMarkers("copy");
}

function toggleGoto() {
		toggleMarkers("goto");
}


// TODO: how to allow user to choose their own keys in extension? commands API
document.addEventListener ("keydown", function (zEvent) {
		if (zEvent.key == "Escape") {
				resetMarkerState();
				return;
		}

		if (currentlyShowing) {
				var foundFullKey = processKeyEvent(zEvent, markers, currMarkerType);
				if (foundFullKey) {
						resetMarkerState();
						return;
				}
		}

		// TODO: build "list of actions", though maybe just copy and goto for now.
		if (keyMatches(zEvent, "Z")) {
				toggleCopy();
				currMarkerType = "copy";
		} else if (keyMatches(zEvent, "X")) {
				toggleGoto();
				currMarkerType = "goto";
		} else if (keyMatches(zEvent, "T")) {
				// TODO: Try to do "token matching" within JSON content.
		}

});

// Notes, when included as a content script, it was helpful to use onload. Now just run it directly.
//window.addEventListener('load', function () {
addCopyMarkers();
addLinkMarkers();
//})
