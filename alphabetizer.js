const inputBox = document.createElement('textarea');
const outputBox = document.createElement('textarea');
const clearButton = document.createElement('button');
const copyButton = document.createElement('button');

inputBox.rows = 10;
inputBox.cols = 40;
inputBox.placeholder = 'Separate by semicolons (;) or new lines';
inputBox.style.resize = `none`;

outputBox.rows = 10;
outputBox.cols = 40;
outputBox.placeholder = 'Output appears here';
outputBox.style.resize = `none`
outputBox.readOnly = true;

clearButton.textContent = 'Clear';
clearButton.id = 'clearButton';

copyButton.textContent = 'Copy';
copyButton.id = 'copyButton';

document.body.appendChild(inputBox);
document.body.appendChild(clearButton);
document.body.appendChild(outputBox);
document.body.appendChild(copyButton);

let prevInputLength = 0;


inputBox.addEventListener('input', sort);

// Sort
function sort() {
    const inputValue = inputBox.value.trim();
    updateSortedOutput(inputValue);
    prevInputLength = inputValue.length;
}

// Update sorted output
function updateSortedOutput(inputValue) {
    let items;
    if (inputValue.includes('\n')) {
        items = inputValue.split('\n');
    } else if (inputValue.includes(';')) {
        items = inputValue.split(';');
    } else {
        items = [inputValue];
    }

    items = items.map(item => item.trim()).filter(item => item !== '');
    items.sort(Intl.Collator().compare);

    let outputValue;
    if (inputValue.includes('\n')) {
        outputValue = items.join('\n');
    } else if (inputValue.includes(';')) {
        outputValue = items.join('; ');
    } else {
        outputValue = items.join('');
    }

    outputBox.value = outputValue;
}

// Clear input box
clearButton.onclick = function () {
    inputBox.value = '';
    sort();
};

// Copy
copyButton.onclick = function () {
    outputBox.focus();
    outputBox.select();
    document.execCommand('copy');
    clearSelection();
    notify();
};

let timeoutId;

// Copy notification
function notify() {
    const copiedText = "Copied!";
    clearTimeout(timeoutId);
    copyButton.innerHTML = copiedText;

    timeoutId = setTimeout(function () {
        copyButton.innerHTML = "Copy";
    }, 1000);
}

// Clear selection
function clearSelection() {
    let selected;
    if ((selected = document.selection) && selected.empty) {
        selected.empty();
    } else {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        const activeElement = document.activeElement;
        if (activeElement) {
            const tagName = activeElement.nodeName.toLowerCase();
            if (tagName == "textarea" || (tagName == "input" && activeElement.type == "text")) {
                activeElement.selectionStart = activeElement.selectionEnd;
            }
        }
    }
}
