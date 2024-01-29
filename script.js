function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getBoxWidth(aspectRatio) {
    // Function to calculate the box width based on the selected aspect ratio
    const [width, height] = aspectRatio.split(':').map(Number);
    const aspectRatioWidth = (80 * width) / height; // Calculate width proportionally
    return `${aspectRatioWidth}px`;
}

function updateBoxes() {
    const container = document.getElementById('boxContainer');
    const numCabinetsWide = parseInt(document.getElementById('numCabinetsWide').value, 10) || 1; // Default to 1 if no value provided
    const numCabinetsTall = parseInt(document.getElementById('numCabinetsTall').value, 10);
    const numCabinetsPerCircuit = document.getElementById('numCabinetsPerCircuit').value ? parseInt(document.getElementById('numCabinetsPerCircuit').value, 10) : numCabinetsTall ? numCabinetsTall : 1;
    const selectedAspectRatio = document.getElementById('boxAspectRatio').value; // Get the selected aspect ratio
    container.innerHTML = ''; // Clear previous boxes
    container.style.gridTemplateColumns = `repeat(${numCabinetsWide}, ${getBoxWidth(selectedAspectRatio)})`; // Set the CSS Grid layout with dynamic box width

    const grid = Array.from({ length: numCabinetsWide }, () => new Array(numCabinetsTall));
    let currentCircuitCount = 0; // Track the number of cabinets in the current circuit
    let currentColor = getRandomColor(); // Initialize the first circuit color
    let columnColors = {}; // Mapping of column index to its line color

    // Before the loop, create an array to store dot colors for each column
    const dotColors = Array.from({ length: numCabinetsWide }, () => getRandomColor());

    // Populate the grid and prepare column colors
    let totalCabinetsCount = 0;
    for (let col = 0; col < numCabinetsWide; col++) {
        if (totalCabinetsCount % numCabinetsPerCircuit === 0) {
            currentColor = getRandomColor(); // Assign a new color for a new circuit
        }
        columnColors[col] = currentColor; // Set the color for the current column

        for (let row = 0; row < numCabinetsTall; row++) {
            grid[col][row] = (col * numCabinetsTall) + row + 1;
            totalCabinetsCount++;
        }

        // Reset the circuit count if it reaches the specified number of cabinets per circuit
        if (totalCabinetsCount >= numCabinetsPerCircuit) {
            totalCabinetsCount %= numCabinetsPerCircuit;
        }
    }

    // Create boxes using the populated 2D array and assigned colors
    for (let row = 0; row < numCabinetsTall; row++) {
        for (let col = 0; col < numCabinetsWide; col++) {
            const boxNumber = grid[col][numCabinetsTall - 1 - row];
            const box = document.createElement('div');
            box.classList.add('box');

            const numberElement = document.createElement('span');
            numberElement.classList.add('number');
            numberElement.textContent = boxNumber;
            box.appendChild(numberElement);
            container.appendChild(box);

            // Add a line inside the box if it's not the last one in its column
            if (row < numCabinetsTall - 1) {
                const line = document.createElement('div');
                line.classList.add('line');
                line.style.backgroundColor = columnColors[col]; // Use the color mapped to this column
                box.appendChild(line);
            }

            // Add a dot only to the first box in the column, accounting for reverse order
            if (row == numCabinetsTall - 1) { // Condition to add dot to the visually first box
                const dot = document.createElement('div');
                dot.classList.add('dot');

                // Check if the tall value is less than 3 and col is even
                if (numCabinetsTall < 3 && col % 2 === 1) {
                    if (col > 0) {
                        dot.style.display = 'none'; // Hide the dot
                        dot.style.backgroundColor = dotColors[col - 1]; // Hide the dot
                    }
                } else {
                    dot.style.backgroundColor = columnColors[col]; // Set dot color based on column

                    if (numCabinetsTall < 3) {
                        if (dotColors[col + 1]) {
                            // connect with first dot
                            const connectLineAway = document.createElement('div');
                            connectLineAway.classList.add('connectLineAway');
                            connectLineAway.style.backgroundColor = columnColors[col];
                            box.appendChild(connectLineAway);
                        }
                    }

                    // connect with first dot
                    const connectLine = document.createElement('div');
                    connectLine.classList.add('connectLine');
                    connectLine.style.backgroundColor = columnColors[col]; // Use the color mapped to this column
                    box.appendChild(connectLine);
                }

                dot.style.backgroundColor = columnColors[col]; // Set dot color based on column
                box.appendChild(dot);
            }
        }
    }
}
