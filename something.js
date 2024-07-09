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

    const chartWidth = canvas.width - 65; // Reduced to account for second y-axis
    const chartHeight = canvas.height - 40;
    const chartX = 40;
    const chartY = 5;
    const chartX2 = canvas.width - 25; // New x position for second y-axis

    // Example dynamic datasets with yAxis property
    let datasets = [
        { label: "Dataset 1", data: [], color: colorLine1.value, yAxis: 'left' },
        { label: "Dataset 2", data: [], color: colorLine2.value, yAxis: 'right' },
        { label: "Dataset 3", data: [], color: colorLine3.value, yAxis: 'left' },
        { label: "Dataset 4", data: [], color: colorLine4.value, yAxis: 'left' }
    ];

    // Example function to fetch dynamic data
    function fetchData() {
        // Replace this with your actual data fetching logic
        return [
            { label: "Dataset 1", data: [0, 1, 1, 0, 0, 0, 1, 1, 1, 1] },
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
                const min = 0;
                const max = Math.max(...dataset.data);
                minDataValueLeft = Math.min(minDataValueLeft, min);
                maxDataValueLeft = Math.max(maxDataValueLeft, max);
            }
        } else if (dataset.yAxis === 'right') {
            if (containsOnlyBooleanOrNumeric01(dataset.data)) {
                minDataValueRight = 0;
                maxDataValueRight = 1;
            } else {
                const min = 0;
                const max = Math.max(...dataset.data);
                minDataValueRight = Math.min(minDataValueRight, min);
                maxDataValueRight = Math.max(maxDataValueRight, max);
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
            ctx.stroke();
        }
    
        // Draw X axis labels
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
    
        for (let i = 0; i <= numGridLinesX; i++) {
            let x = chartX + (chartWidth / numGridLinesX) * i;
            ctx.fillText(i, x, chartHeight + chartY + 20);
        }
    
        // Draw left Y axis labels
        ctx.textAlign = 'right';
        ctx.fillText(minDataValueLeft.toFixed(1), chartX - 10, chartHeight + chartY);
        ctx.fillText(maxDataValueLeft.toFixed(1), chartX - 10, chartY + 10);
    
        // Draw right Y axis labels
        ctx.textAlign = 'left';
        ctx.fillText(minDataValueRight.toFixed(1), chartX2 + 10, chartHeight + chartY);
        ctx.fillText(maxDataValueRight.toFixed(1), chartX2 + 10, chartY + 10);
    
        // Draw data lines and points
        datasets.forEach(dataset => {
            let minValue, maxValue;
            if (dataset.yAxis === 'left') {
                minValue = minDataValueLeft;
                maxValue = maxDataValueLeft;
            } else if (dataset.yAxis === 'right') {
                // Adjust minValue and maxValue to align with left y-axis height
                minValue = minDataValueLeft + (minDataValueRight - minDataValueRight) * leftYAxisHeight / rightYAxisHeight;
                maxValue = maxDataValueLeft + (maxDataValueRight - minDataValueRight) * leftYAxisHeight / rightYAxisHeight;
            }
    
            const dataLength = dataset.data.length;
            const xIncrement = chartWidth / (dataLength - 1);
    
            ctx.beginPath();
            for (let i = 0; i < dataLength; i++) {
                let x;
                if (dataset.yAxis === 'left') {
                    x = chartX + xIncrement * i;
                } else if (dataset.yAxis === 'right') {
                    x = chartX2 - xIncrement * i;
                }
                let y = chartHeight + chartY - ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 2;
            ctx.stroke();
    
            for (let i = 0; i < dataLength; i++) {
                let x;
                if (dataset.yAxis === 'left') {
                    x = chartX + xIncrement * i;
                } else if (dataset.yAxis === 'right') {
                    x = chartX2 - xIncrement * i;
                }
                let y = chartHeight + chartY - ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2, true);
                ctx.fillStyle = dataset.color;
                ctx.fill();
            }
        });
    }    

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
                let x;
                if (dataset.yAxis === 'left') {
                    x = chartX + xIncrement * i;
                } else if (dataset.yAxis === 'right') {
                    x = chartX2 - xIncrement * i; // Adjust for right y-axis
                }
                let y = chartHeight + chartY - ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight;
                
                // Adjust the radius to detect points
                let radius = 6; // Increase the radius for points on the right y-axis
    
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

    canvas.addEventListener('mousemove', showTooltip);
    canvas.addEventListener('mouseout', () => {
        tooltip.style.visibility = 'hidden';
    });

    // Event listeners for color inputs
    colorLine1.addEventListener('change', function() {
        datasets[0].color = this.value;
        drawChart();
    });

    colorLine2.addEventListener('change', function() {
        datasets[1].color = this.value;
        drawChart();
    });

    colorLine3.addEventListener('change', function() {
        datasets[2].color = this.value;
        drawChart();
    });

    colorLine4.addEventListener('change', function() {
        datasets[3].color = this.value;
        drawChart();
    });

    drawChart();
});
