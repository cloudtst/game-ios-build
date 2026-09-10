function exportData() {
(function() {
    function exportLocalStorageToJson() {
        let storage;
        const iframe = document.getElementById('game-inner-frame');

        // Check if iframe exists and is accessible
        if (iframe && iframe.contentWindow && iframe.contentWindow.localStorage) {
            storage = iframe.contentWindow.localStorage;
        } else {
            storage = window.localStorage;
        }

        const localStorageData = {};

        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            const value = storage.getItem(key);
            try {
                localStorageData[key] = JSON.parse(value);
            } catch (e) {
                localStorageData[key] = value;
            }
        }

        const jsonData = JSON.stringify(localStorageData, null, 2);
        const base64Data = btoa(unescape(encodeURIComponent(jsonData)));

        if (window.saveDataManager && window.saveDataManager.saveAsJson) {
            // Android WebView bridge
            window.saveDataManager.saveAsJson(base64Data);
        } else {
            // Fallback for browser download
            const dataUri = 'data:application/json;base64,' + base64Data;
            const link = document.createElement('a');
            link.href = dataUri;
            const filename = document.title || 'SavesData';
            link.download = `${filename}_SavesData.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Trigger export
    exportLocalStorageToJson();
})();


}

function importData() {
function importLocalStorageFromJson(event) {
        const file = event.target.files[0];  // Get the file from input
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result); // Parse the JSON data
                for (const key in jsonData) {
                    if (jsonData.hasOwnProperty(key)) {
                        // Store each key-value pair in localStorage
                        localStorage.setItem(key, JSON.stringify(jsonData[key]));
                    }
                }
                alert('Save data has been successfully imported! Please reload the game to take effect.');
            } catch (error) {
                console.error('Error importing localStorage data:', error);
                alert('Failed to import data. Please ensure the file is a valid JSON file.');
            }
        };
        reader.readAsText(file);  // Read the file as text
    }

    // Add an input element to the page for importing the JSON file
    function createImportButton() {
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.accept = '.json';  // Only allow .json files
        inputElement.addEventListener('change', importLocalStorageFromJson);

        inputElement.style.zIndex = 100;  // Set z-index to 100
        inputElement.style.position = 'absolute';  // Position the button as needed
        inputElement.style.zIndex = 100;  // You can adjust the z-index as needed
        inputElement.style.top = '50%';  // Center the button vertically
        inputElement.style.left = '50%';  // Center the button horizontally
        inputElement.style.transform = 'translate(-50%, -50%)';
        
        // Add the input element to the page (for example, append to body)
        const body = document.body;
        body.insertBefore(inputElement, body.firstChild);

        inputElement.click();
        
        setTimeout(function() {
            inputElement.remove();
        }, 5000);
        
    }

    // Trigger the export function (optional)
    // exportLocalStorageToJson(); // Uncomment this if you want to export on load

    // Create the import button on page load
    createImportButton();
    
}