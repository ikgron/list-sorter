const inputBox = document.createElement('textarea');
const outputBox = document.createElement('textarea');
const clearButton = document.createElement('button');
const copyButton = document.createElement('button');

const sortMethodLabel = document.createElement('label');
sortMethodLabel.setAttribute('for', 'sortMethod');
sortMethodLabel.textContent = 'Sort by:';
sortMethodLabel.style.color = 'white';

const sortMethodSelect = document.createElement('select');
sortMethodSelect.id = 'sortMethod';
sortMethodSelect.classList.add('form-select-sm');
sortMethodSelect.style.backgroundColor = 'black';
sortMethodSelect.style.color = 'white';
sortMethodSelect.addEventListener('change', sort);

const option1 = document.createElement('option');
option1.value = 'alphabetical';
option1.textContent = 'Alphabetical';

const option2 = document.createElement('option');
option2.value = 'length';
option2.textContent = 'Length';

sortMethodSelect.appendChild(option1);
sortMethodSelect.appendChild(option2);

const reverseCheckboxLabel = document.createElement('label');
reverseCheckboxLabel.setAttribute('for', 'reverseCheckbox');
reverseCheckboxLabel.textContent = 'Reverse?';
reverseCheckboxLabel.style.color = 'white';
reverseCheckboxLabel.style.marginLeft = '10px';

const reverseCheckbox = document.createElement('input');
reverseCheckbox.id = 'reverseCheckbox';
reverseCheckbox.type = 'checkbox';
reverseCheckbox.addEventListener('change', sort);

inputBox.rows = 10;
inputBox.cols = 40;
inputBox.placeholder = 'Separate by semicolons (;) or new lines';
inputBox.style.resize = 'none';

outputBox.rows = 10;
outputBox.cols = 40;
outputBox.placeholder = 'Output appears here';
outputBox.style.resize = 'none';
outputBox.readOnly = true;

clearButton.textContent = 'Clear';
clearButton.id = 'clearButton';

copyButton.textContent = 'Copy';
copyButton.id = 'copyButton';

document.body.appendChild(inputBox);
document.body.appendChild(sortMethodLabel);
document.body.appendChild(sortMethodSelect);
document.body.appendChild(reverseCheckboxLabel);
document.body.appendChild(reverseCheckbox);
document.body.appendChild(clearButton);
document.body.appendChild(outputBox);
document.body.appendChild(copyButton);

let prevInputLength = 0;

inputBox.addEventListener('input', sort);
clearButton.addEventListener('click', clearInput);
copyButton.addEventListener('click', copyOutput);

function sort() {
    const inputValue = inputBox.value.trim();
    updateSortedOutput(inputValue);
    prevInputLength = inputValue.length;
}

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

    const sortMethod = document.getElementById('sortMethod').value;
    if (sortMethod === 'alphabetical') {
        items.sort(Intl.Collator().compare);
    } else if (sortMethod === 'length') {
        items.sort((a, b) => a.length - b.length);
    }

    const reversed = document.getElementById('reverseCheckbox').checked;
    if (reversed) {
        items.reverse();
    }

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

function clearInput() {
    inputBox.value = '';
    sort();
}

function copyOutput() {
    outputBox.focus();
    outputBox.select();
    document.execCommand('copy');
    clearSelection();
    notify();
}

let timeoutId;

function notify() {
    const copiedText = "Copied!";
    clearTimeout(timeoutId);
    copyButton.innerHTML = copiedText;

    timeoutId = setTimeout(function () {
        copyButton.innerHTML = "Copy";
    }, 1000);
}

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
