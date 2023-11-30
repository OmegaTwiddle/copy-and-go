// Saves options to chrome.storage
const saveOptions = () => {
		const chars_to_use = document.getElementById('chars').value;
		console.log("saving chars to use: ", chars_to_use);

		chrome.storage.sync.set(
				{ charsToUse: chars_to_use },
				() => {
						// Update status to let user know options were saved.
						const status = document.getElementById('status');
						status.textContent = 'Options saved.';
						setTimeout(() => {
								status.textContent = '';
						}, 1750);
				}
		);
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
		chrome.storage.sync.get(
				{charsToUse: "ASDFJKL" },
				(items) => {
						document.getElementById('chars').value = items.charsToUse;
				}
		);
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
