document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltiptext');
    const title = document.getElementById('tooltipTitle');
    const value1 = document.getElementById('V1');
    const value2 = document.getElementById('V2');
    const value3 = document.getElementById('V3');
    const value4 = document.getElementById('V4');

    const chartWidth = canvas.width - 40;
    const chartHeight = canvas.height - 40;
    const chartX = 30;
    const chartY = 10;

    const datasets = [
        { name: "Dataset 1", data: [0, 2, 4, 8, 6, 10, 8, 12, 10, 14], color: '#007bff' },
        { name: "Dataset 2", data: [14, 10, 12, 8, 10, 6, 8, 4, 2, 0], color: '#ff5733' }
    ];
    
    const maxDataValue = Math.max(...datasets.flatMap(dataset => dataset.data));
    const numGridLinesX = 10;
    const numGridLinesY = 5;

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(chartX, chartHeight + chartY);
        ctx.lineTo(chartWidth + chartX, chartHeight + chartY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(chartX, chartY);
        ctx.lineTo(chartX, chartHeight + chartY);
        ctx.stroke();

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
            ctx.lineTo(chartWidth + chartX, y);
            ctx.strokeStyle = '#e0e0e0';
            ctx.stroke();
        }

        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        for (let i = 0; i <= numGridLinesX; i++) {
            let x = chartX + (chartWidth / numGridLinesX) * i;
            ctx.fillText(i, x, chartHeight + chartY + 20);
        }

        ctx.textAlign = 'right';
        for (let i = 0; i <= numGridLinesY; i++) {
            let y = chartY + (chartHeight / numGridLinesY) * i;
            ctx.fillText(numGridLinesY - i, chartX - 10, y + 5);
        }

        datasets.forEach(dataset => {
            ctx.beginPath();
            for (let i = 0; i < dataset.data.length; i++) {
                let x = chartX + (chartWidth / (dataset.data.length - 1)) * i;
                let y = chartHeight + chartY - (dataset.data[i] / maxDataValue) * chartHeight;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            for (let i = 0; i < dataset.data.length; i++) {
                let x = chartX + (chartWidth / (dataset.data.length - 1)) * i;
                let y = chartHeight + chartY - (dataset.data[i] / maxDataValue) * chartHeight;
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

        let foundPoints = [];

        datasets.forEach(dataset => {
            for (let i = 0; i < dataset.data.length; i++) {
                let x = chartX + (chartWidth / (dataset.data.length - 1)) * i;
                let y = chartHeight + chartY - (dataset.data[i] / maxDataValue) * chartHeight;
                let dx = mouseX - x;
                let dy = mouseY - y;
                if (dx * dx + dy * dy < 9) {
                    foundPoints.push({ name: dataset.name, value: dataset.data[i] });
                }
            }
        });

        if (foundPoints.length > 0) {
            tooltip.style.visibility = 'visible';

            let tooltipTitleText = foundPoints.map(point => point.name).join(' | ');
            title.innerHTML = tooltipTitleText;
            
            value1.innerHTML = `Value1: ${foundPoints[0] ? foundPoints[0].value : ''}`;
            value2.innerHTML = `Value2: ${foundPoints[1] ? foundPoints[1].value : ''}`;
            value3.innerHTML = `Value3: ${foundPoints[2] ? foundPoints[2].value : ''}`;
            value4.innerHTML = `Value4: ${foundPoints[3] ? foundPoints[3].value : ''}`;

            tooltip.style.left = `${mouseX - 80}px`;
            tooltip.style.top = `${mouseY + 20}px`;
        } else {
            tooltip.style.visibility = 'hidden';
        }
    }

    canvas.addEventListener('mousemove', showTooltip);
    canvas.addEventListener('mouseout', () => {
        tooltip.style.visibility = 'hidden';
    });

    drawChart();
});
