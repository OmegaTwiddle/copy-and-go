chrome.runtime.onStartup.addListener(() => {
		console.log("got called!");
});

chrome.action.onClicked.addListener((tab) => {
		chrome.scripting.executeScript({
				target: {tabId: tab.id},
				function() {
						chrome.storage.sync.get(
								{charsToUse: "ASDFJKL" },
								(items) => {
										var charKey = "charsToUse";
										if (charKey in items) {
												window.charsToUse = items[charKey];
										}
								})
				}
		}).then(() => {
				chrome.scripting.executeScript({
						target: {tabId: tab.id},
						files: [
								'scripts/content.js',
						]
				}).then(() => {
						chrome.scripting.executeScript({
								target: {tabId: tab.id},
								function() {
										toggleCopy();
										window.currMarkerType = "copy";
								}
						});
				});
		});
});


chrome.commands.onCommand.addListener((command, tab) => {
		if (command == "candg-copy-text") {
				chrome.scripting.executeScript({
						target: {tabId: tab.id},
						function() {
								toggleGoto();
								window.currMarkerType = "goto";
						},
				});
		}
});

