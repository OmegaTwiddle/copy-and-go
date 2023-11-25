import "./sw-commands.js";
import "./sw-tips.js";

// chrome.commands.onCommand.addListener((command) => {
// 		console.log(`Command "${command}" triggered`);
// 		// TODO: split multiple commands?
// 		const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
// 		const response = await chrome.tabs.sendMessage(tab.id, message);

// 		// Busted code?
// 		// 
// 		// //const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
// 		// chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
// 		// 		console.log(tab.id, { "msg": "copy command triggered"});
// 		// 		chrome.tabs.sendMessage(tab.id, { "msg": "copy command triggered"});
// 		// })
// });
