function updateBoxes() {
    const container = document.getElementById('boxContainer');
    const numCabinetsWide = parseInt(document.getElementById('numCabinetsWide').value, 10);
    const numCabinetsTall = parseInt(document.getElementById('numCabinetsTall').value, 10);

    // Clear previous boxes
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${numCabinetsWide}, 50px)`; // Set the number of columns based on input

    // Total number of boxes
    const totalBoxes = numCabinetsWide * numCabinetsTall;

    // Create and append boxes in mirrored and rotated order
    for (let row = 0; row < numCabinetsTall; row++) {
        for (let col = 0; col < numCabinetsWide; col++) {
            const box = document.createElement('div');
            box.classList.add('box');

            // Calculate the box number considering the grid is mirrored and rotated
            const boxNumber = totalBoxes - (row * numCabinetsWide + col);

            const numberElement = document.createElement('span');
            numberElement.classList.add('number');
            numberElement.textContent = boxNumber;
            box.appendChild(numberElement);

            container.appendChild(box);
        }
    }
}
