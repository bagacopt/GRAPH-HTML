document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltiptext');
    const title = document.getElementById('tooltipTitle');
    const value = document.querySelector('.info');
    const colorLine1 = document.getElementById("colorLine1");
    const colorLine2 = document.getElementById("colorLine2");
    const colorLine3 = document.getElementById("colorLine3");
    const colorLine4 = document.getElementById("colorLine4");

    const chartWidth = canvas.width - 90; // Reduced to account for second y-axis
    const chartHeight = canvas.height - 40;
    const chartX = 40;
    const chartY = 5;
    const chartX2 = canvas.width - 49; // New x position for second y-axis

    // Example dynamic datasets with yAxis property
    let datasets = [
        { label: "Dataset 1", data: [], color: colorLine1.value, yAxis: 'right' },
        { label: "Dataset 2", data: [], color: colorLine2.value, yAxis: 'left' },
        { label: "Dataset 3", data: [], color: colorLine3.value, yAxis: 'left' },
        { label: "Dataset 4", data: [], color: colorLine4.value, yAxis: 'left' }
    ];

    // Example function to fetch dynamic data
    function fetchData() {
        // Replace this with your actual data fetching logic
        return [
            { label: "Dataset 1", data: [false, true, true, false, false, false, true, true, true, false] },
            { label: "Dataset 2", data: [14, 1, 4, 8, 6, 5, 8, 12, 10, 14] },
            { label: "Dataset 3", data: [7, 1, 4, 8, 6, 10, 18, 12, 10, 14] },
            { label: "Dataset 4", data: [3, 2, 4, 8, 6, 10, 8, 12, 10, 14] }
        ];
    }

    // Populate datasets with dynamic data
    const dynamicData = fetchData();
    datasets.forEach((dataset, index) => {
        dataset.data = dynamicData[index].data;
    });

    // Function to determine if dataset contains only boolean or numeric 0/1 values
    function containsOnlyBooleanOrNumeric01(data) {
        return data.every(value => typeof value === 'boolean' || value === 0 || value === 1);
    }

    // Determine min and max values for y-axes based on dataset contents
    let minDataValueLeft = Infinity;
    let maxDataValueLeft = -Infinity;
    let minDataValueRight = Infinity;
    let maxDataValueRight = -Infinity;

    datasets.forEach(dataset => {
        if (dataset.yAxis === 'left') {
            if (!containsOnlyBooleanOrNumeric01(dataset.data)) {
                const min = Math.min(...dataset.data);
                const max = Math.max(...dataset.data);
                minDataValueLeft = Math.min(minDataValueLeft, min);
                maxDataValueLeft = Math.max(maxDataValueLeft, max);
            } else {
                minDataValueLeft = 0;
                maxDataValueLeft = 1;
            }
        } else if (dataset.yAxis === 'right') {
            if (!containsOnlyBooleanOrNumeric01(dataset.data)) {
                const min = Math.min(...dataset.data);
                const max = Math.max(...dataset.data);
                minDataValueRight = Math.min(minDataValueRight, min);
                maxDataValueRight = Math.max(maxDataValueRight, max);
            } else {
                minDataValueRight = 0;
                maxDataValueRight = 1;
            }
        }
    });

    const numGridLinesX = 10;
    const numGridLinesY = 5;

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Determine the exact height for the right y-axis to align with the left y-axis
        const leftYAxisHeight = chartHeight / (maxDataValueLeft - minDataValueLeft);
        const rightYAxisHeight = chartHeight / (maxDataValueRight - minDataValueRight);
    
        // Draw X axis
        ctx.beginPath();
        ctx.moveTo(chartX, chartHeight + chartY);
        ctx.lineTo(chartX + chartWidth, chartHeight + chartY);
        ctx.stroke();
    
        // Draw left Y axis
        ctx.beginPath();
        ctx.moveTo(chartX, chartY);
        ctx.lineTo(chartX, chartHeight + chartY);
        ctx.stroke();
    
        // Draw right Y axis
        ctx.beginPath();
        ctx.moveTo(chartX2, chartY);
        ctx.lineTo(chartX2, chartHeight + chartY);
        ctx.stroke();
    
        // Draw grid lines
        for (let i = 0; i <= numGridLinesX; i++) {
            let x = chartX + (chartWidth / numGridLinesX) * i;
            ctx.beginPath();
            ctx.moveTo(x, chartY);
            ctx.lineTo(x, chartHeight + chartY);
            ctx.strokeStyle = '#e0e0e0';
            ctx.stroke();
        }
    
        for (let i = 0; i <= numGridLinesY; i++) {
            let y = chartY + (chartHeight / numGridLinesY) * i;
            ctx.beginPath();
            ctx.moveTo(chartX, y);
            ctx.lineTo(chartX + chartWidth, y);
            ctx.strokeStyle = '#e0e0e0';
            ctx.fillStyle = '#000000';
            ctx.stroke();
        }
    
        // Draw data lines
        datasets.forEach(dataset => {
            ctx.beginPath();
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 2
    
            let yScale, minValue, yAxisHeight;
            if (dataset.yAxis === 'left') {
                yScale = (value) => chartHeight - ((value - minDataValueLeft) / (maxDataValueLeft - minDataValueLeft)) * chartHeight;
                minValue = minDataValueLeft;
                yAxisHeight = leftYAxisHeight;
            } else {
                yScale = (value) => chartHeight - ((value - minDataValueRight) / (maxDataValueRight - minDataValueRight)) * chartHeight;
                minValue = minDataValueRight;
                yAxisHeight = rightYAxisHeight;
            }
    
            dataset.data.forEach((value, index) => {
                const x = chartX + (chartWidth / (dataset.data.length - 1)) * index;
                const y = chartY + yScale(value);
    
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
    
            ctx.stroke();
        });
    
        // Draw Y axis labels
        for (let i = 0; i <= numGridLinesY; i++) {
            let valueLeft, valueRight;

            // Determine values for left y-axis
            if (minDataValueLeft === false && maxDataValueLeft === true) {
                if (i === 0 || i === numGridLinesY) {
                    valueLeft = i === 0 ? false : true; // Only show 0 at the bottom and 1 at the top
                } else {
                    continue; // Skip intermediate grid lines
                }
            } else {
                valueLeft = minDataValueLeft + (maxDataValueLeft - minDataValueLeft) * (i / numGridLinesY);
            }

            // Determine values for right y-axis
            if (minDataValueRight === false && maxDataValueRight === true) {
                if (i === 0 || i === numGridLinesY) {
                    valueRight = i === 0 ? false : true; // Only show 0 at the bottom and 1 at the top
                } else {
                    continue; // Skip intermediate grid lines
                }
            } else {
                valueRight = minDataValueRight + (maxDataValueRight - minDataValueRight) * (i / numGridLinesY);
            }

            const y = chartY + chartHeight - (chartHeight / numGridLinesY) * i;

            

            if (valueLeft === true || valueLeft === false) {
                ctx.fillText(valueLeft, chartX - 30, y + 3); // left y-axis labels
            } else { ctx.fillText(valueLeft.toFixed(2), chartX - 30, y + 3); } // left y-axis labels

            if (valueRight === true || valueRight === false) { ctx.fillText(valueRight, chartX - 30, y + 3); } // left y-axis labels  
            else { ctx.fillText(valueRight.toFixed(2), chartX2 + 10, y + 3); } // left y-axis labels
        }

        // Draw X axis labels
        datasets[0].data.forEach((_, index) => {
            const x = chartX + (chartWidth / (datasets[0].data.length - 1)) * index;
            const label = `P${index + 1}`; // Replace with actual labels if available
            ctx.fillStyle = '#000000';
            ctx.fillText(label, x - 10, chartHeight + chartY + 20);
        });
    }

    // Tooltip functionality
    function showTooltip(event) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        let tooltipContent = '';
        let datasetLabels = [];
        let pointsFound = 0;
    
        datasets.forEach(dataset => {
            let minValue, maxValue;
            if (dataset.yAxis === 'left') {
                minValue = minDataValueLeft;
                maxValue = maxDataValueLeft;
            } else if (dataset.yAxis === 'right') {
                minValue = minDataValueRight;
                maxValue = maxDataValueRight;
            }
    
            const dataLength = dataset.data.length;
            const xIncrement = chartWidth / (dataLength - 1);
    
            for (let i = 0; i < dataLength; i++) {
                let x = chartX + xIncrement * i;
                let y = chartHeight + chartY - ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight;
                
                // Adjust the radius to detect points
                let radius = 6; // Increase the radius for points
    
                // Check if the cursor is near the point
                if (Math.abs(mouseX - x) <= radius && Math.abs(mouseY - y) <= radius) {
                    datasetLabels.push(dataset.label);
                    tooltipContent += `<p>${dataset.label} value: ${dataset.data[i]}</p>`;
                    pointsFound++;
                }
            }
        });
    
        if (pointsFound > 0) {
            title.textContent = datasetLabels.join(' | ');
            value.innerHTML = tooltipContent;
            tooltip.style.left = `${mouseX + rect.left - tooltip.offsetWidth / 2}px`; // Center the tooltip
            tooltip.style.top = `${mouseY + rect.top - tooltip.offsetHeight - 10}px`;
    
            // Set the minimum height based on the number of datasets with points found
            switch (pointsFound) {
                case 1:
                    tooltip.style.minHeight = '80px';
                    break;
                case 2:
                    tooltip.style.minHeight = '105px';
                    break;
                case 3:
                    tooltip.style.minHeight = '155px';
                    break;
                case 4:
                    tooltip.style.minHeight = '180px';
                    break;
                default:
                    tooltip.style.minHeight = '80px';
                    break;
            }

            tooltip.style.visibility = 'visible';
        } else {
            tooltip.style.visibility = 'hidden';
        }
    } 
    
    // Hide tooltip
    function hideTooltip() {
        tooltip.style.visibility = 'hidden';
    }

    // Event listeners for tooltip
    canvas.addEventListener('mousemove', showTooltip);
    canvas.addEventListener('mouseout', hideTooltip);

    // Update chart when color input changes
    [colorLine1, colorLine2, colorLine3, colorLine4].forEach((colorInput, index) => {
        colorInput.addEventListener('input', () => {
            datasets[index].color = colorInput.value;
            drawChart();
        });
    });

    // Draw the initial chart
    drawChart();
});
