function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/* Function to calculate the box width based on the selected aspect ratio */
function getBoxWidth(aspectRatio) {
    const [width, height] = aspectRatio.split(':').map(Number);
    /* Calculate width proportionally */
    const aspectRatioWidth = (80 * width) / height;
    return `${aspectRatioWidth}px`;
}

function populateGridAndAssignColors(numCabinetsWide, numCabinetsTall, numCabinetsPerCircuit) {
    const grid = Array.from({ length: numCabinetsWide }, () => new Array(numCabinetsTall));
    let currentColor = getRandomColor(); // Initialize the first circuit color
    let columnColors = {};
    let cumulativeCabinetCounter = 0; // Counter for cumulative cabinets to track complete circuits
    let nextColorChangeAt = numCabinetsPerCircuit; // Next cumulative count at which to change color

    for (let col = 0; col < numCabinetsWide; col++) {
        // Assign color at the start of the column
        columnColors[col] = currentColor;

        for (let row = 0; row < numCabinetsTall; row++) {
            grid[col][row] = (col * numCabinetsTall) + row + 1;
            cumulativeCabinetCounter++;

            // Change color after completing the circuit
            if (cumulativeCabinetCounter == nextColorChangeAt) {
                currentColor = getRandomColor(); // Assign a new color for the next circuit
                nextColorChangeAt += numCabinetsPerCircuit; // Update the next color change point
            }
        }
    }

    return { grid, columnColors };
}






function updateBoxes() {
    const container = document.getElementById('boxContainer');
    const numCabinetsWide = parseInt(document.getElementById('numCabinetsWide').value, 10) || 1;
    const numCabinetsTall = parseInt(document.getElementById('numCabinetsTall').value, 10);
    const numCabinetsPerCircuit = document.getElementById('numCabinetsPerCircuit').value ? parseInt(document.getElementById('numCabinetsPerCircuit').value, 10) : numCabinetsTall ? numCabinetsTall : 1;
    const selectedAspectRatio = document.getElementById('boxAspectRatio').value;
    container.innerHTML = '';

    /* Set the CSS Grid layout with dynamic box width */
    container.style.gridTemplateColumns = `repeat(${numCabinetsWide}, ${getBoxWidth(selectedAspectRatio)})`;

    /*  Before the loop, create an array to store dot colors for each column */
    const dotColors = Array.from({ length: numCabinetsWide }, () => getRandomColor());

    // Populate the grid and assign colors to columns
    const { grid, columnColors } = populateGridAndAssignColors(numCabinetsWide, numCabinetsTall, numCabinetsPerCircuit);

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
            if (row == numCabinetsTall - 1) {
                const dot = document.createElement('div');
                dot.classList.add('dot');

                /* Check if the tall value is less than 3 and col is even */
                if (numCabinetsTall < 3 && col % 2 === 1 && numCabinetsPerCircuit % numCabinetsTall === 0 && numCabinetsPerCircuit !== numCabinetsTall) {
                    if (col > 0 && numCabinetsPerCircuit % numCabinetsTall === 0 && numCabinetsPerCircuit !== numCabinetsTall) {
                        /* Hide the dot */
                        dot.style.display = 'none';
                        dot.style.backgroundColor = dotColors[col - 1];
                    }
                } else {
                    /* Set dot color based on column */
                    dot.style.backgroundColor = columnColors[col];
                    if (numCabinetsTall < 3 && numCabinetsPerCircuit % numCabinetsTall === 0 && numCabinetsPerCircuit !== numCabinetsTall) {
                        if (dotColors[col + 1]) {
                            /* connect with first dot */
                            const connectLineAway = document.createElement('div');
                            connectLineAway.classList.add('connectLineAway');
                            connectLineAway.style.backgroundColor = columnColors[col];
                            if (selectedAspectRatio === '16:9') {
                                connectLineAway.style.height = "150px";
                                connectLineAway.style.transform = "rotate(80deg)";
                            }
                            box.appendChild(connectLineAway);
                        }
                    }

                    /* line to connect with base dot */
                    const connectLine = document.createElement('div');
                    connectLine.classList.add('connectLine');
                    /* Use the color mapped to this column */
                    connectLine.style.backgroundColor = columnColors[col];
                    box.appendChild(connectLine);
                }

                /* Set dot color based on column */
                dot.style.backgroundColor = columnColors[col];
                box.appendChild(dot);
            }
        }
    }
}
