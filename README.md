# MicroLED Configuration Tool - README


## File Descriptions

### `index.html`

This file serves as the entry point for the tool. It defines the structure of the web page, including the input fields for configuration parameters (such as the number of cabinets wide and tall, the number of cabinets per circuit, and the aspect ratio for boxes), and the container where the visual representation of the MicroLED configuration will be displayed.

### `script.js`

This JavaScript file contains the logic for reading user inputs, dynamically updating the visual representation of the LED cabinet configuration based on those inputs, and implementing interactive features of the tool. Key functions within `script.js` include `getRandomColor`, `getBoxWidth`, `populateGridAndAssignColors`, and `updateBoxes`.

### `style.css`

The CSS file is responsible for the visual styling of the web page. It defines the appearance of input fields, the grid layout for displaying the LED cabinet configuration, and other aesthetic elements such as colors, fonts, and spacing. The `style.css` file ensures that the tool is not only functional but also visually appealing and user-friendly.


## Overview

The MicroLED Configuration Tool is designed to facilitate the visualization and layout of LED cabinet arrangements. It provides a dynamic interface for users to configure the number of cabinets horizontally and vertically, define the number of cabinets per circuit, and select an aspect ratio for the boxes. The tool then displays a visual representation of this configuration, using unique colors to differentiate between circuits.

## Key Functions

### `getRandomColor`

Generates a random hexadecimal color code. This function is crucial for assigning unique colors to different circuits within the LED configuration, enhancing the visual distinction between them.

```javascript
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
```

### `getBoxWidth`

Calculates the width of each box (cabinet) based on the selected aspect ratio, ensuring that each cabinet is represented accurately according to its dimensions.

```javascript
function getBoxWidth(aspectRatio) {
    const [width, height] = aspectRatio.split(':').map(Number);
    const aspectRatioWidth = (80 * width) / height;
    return '${aspectRatioWidth}px';
}
```

### `populateGridAndAssignColors`

Populates a grid representing the LED cabinets and assigns colors to each column based on the circuit configuration. This function is key to visualizing how cabinets are grouped into circuits.

```javascript
function populateGridAndAssignColors(numCabinetsWide, numCabinetsTall, numCabinetsPerCircuit) {
    const grid = Array.from({ length: numCabinetsWide }, () => new Array(numCabinetsTall));
    let currentColor = getRandomColor(); // Initialize the first circuit color
    let columnColors = {};
    let cumulativeCabinetCounter = 0; // Tracks the total number of cabinets to determine circuit completion
    let nextColorChangeAt = numCabinetsPerCircuit; // Determines when to change the circuit color

    for (let col = 0; col < numCabinetsWide; col++) {
        columnColors[col] = currentColor; // Assign the current color to the entire column

        for (let row = 0; row < numCabinetsTall; row++) {
            grid[col][row] = (col * numCabinetsTall) + row + 1; // Populate the grid with cabinet numbers
            cumulativeCabinetCounter++;

            // Change the circuit color after completing the specified number of cabinets per circuit
            if (cumulativeCabinetCounter == nextColorChangeAt) {
                currentColor = getRandomColor(); // Assign a new color for the next circuit
                nextColorChangeAt += numCabinetsPerCircuit; // Update the threshold for the next color change
            }
        }
    }

    return { grid, columnColors };
}
```

###`updateBoxes`

The core function that orchestrates the tool's functionality. It reads user inputs, clears any existing configuration, sets up the grid layout according to the selected aspect ratio, and populates the grid with cabinets. Each cabinet is color-coded based on its circuit, and additional visual elements (like lines and dots) are added for clarity.


```javascript
function updateBoxes() {
    const container = document.getElementById('boxContainer');
    // Extract configuration values from the user inputs
    const numCabinetsWide = parseInt(document.getElementById('numCabinetsWide').value, 10) || 1;
    const numCabinetsTall = parseInt(document.getElementById('numCabinetsTall').value, 10);
    const numCabinetsPerCircuit = parseInt(document.getElementById('numCabinetsPerCircuit').value, 10) || numCabinetsTall || 1;
    const selectedAspectRatio = document.getElementById('boxAspectRatio').value;
    container.innerHTML = ''; // Clear any existing configuration

    // Set up the CSS Grid layout based on the number of cabinets wide and the selected aspect ratio
    container.style.gridTemplateColumns = `repeat(${numCabinetsWide}, ${getBoxWidth(selectedAspectRatio)})`;

    // Populate the grid and assign colors to the columns based on the circuit configuration
    const { grid, columnColors } = populateGridAndAssignColors(numCabinetsWide, numCabinetsTall, numCabinetsPerCircuit);

    // Iterate over each row and column to create and style the cabinet boxes
    for (let row = 0; row < numCabinetsTall; row++) {
        for (let col = 0; col < numCabinetsWide; col++) {
            const boxNumber = grid[col][numCabinetsTall - 1 - row]; // Determine the cabinet number
            const box = document.createElement('div'); // Create a new div for the cabinet
            box.classList.add('box'); // Assign the 'box' class for styling

            // Create and append the cabinet number element
            const numberElement = document.createElement('span');
            numberElement.classList.add('number');
            numberElement.textContent = boxNumber;
            box.appendChild(numberElement);

            // Add a decorative line inside the box for all but the last cabinet in each column
            if (row < numCabinetsTall - 1) {
                const line = document.createElement('div');
                line.classList.add('line');
                line.style.backgroundColor = columnColors[col]; // Color the line based on the column's circuit color
                box.appendChild(line);
            }

            // Add a dot to the first cabinet in each column
            if (row == numCabinetsTall - 1) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.style.backgroundColor = columnColors[col]; // Color the dot based on the column's circuit color
                box.appendChild(dot);

                // Additional logic for connecting lines and dots based on specific conditions
                // (omitted for brevity)
            }

            container.appendChild(box); // Append the fully configured cabinet box to the container
        }
    }
}
```





