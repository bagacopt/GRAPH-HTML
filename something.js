document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('lineChart')
    const ctx = canvas.getContext('2d')
    const tooltip = document.getElementById('tooltiptext')
    const title = document.getElementById('tooltipTitle')
    const value = document.querySelector('.info')
    const colorLine1 = document.getElementById("colorLine1")
    const colorLine2 = document.getElementById("colorLine2")
    const colorLine3 = document.getElementById("colorLine3")
    const colorLine4 = document.getElementById("colorLine4")
    const variable1Select = document.getElementById('VARIABLE1')
    const variable2Select = document.getElementById('VARIABLE2')
    const variable3Select = document.getElementById('VARIABLE3')
    const variable4Select = document.getElementById('VARIABLE4')

    const chartWidth = canvas.width - 66 // Reduced to account for second y-axis
    const chartHeight = canvas.height - 60 // Reduced to make space for the legend
    const chartX = 35
    const chartY = 5
    const chartX2 = canvas.width - 30 // New x position for second y-axis

    // Example dynamic datasets with yAxis property
    let datasets = [
        { label: variable1Select.value, data: [], color: colorLine1.value, yAxis: 'left' },
        { label: variable2Select.value, data: [], color: colorLine2.value, yAxis: 'right' },
        { label: variable3Select.value, data: [], color: colorLine3.value, yAxis: 'right' },
        { label: variable4Select.value, data: [], color: colorLine4.value, yAxis: 'right' }
    ]

    // Example function to fetch dynamic data
    function fetchData() {
        // Replace this with your actual data fetching logic
        return [
            { label: variable1Select.value, data: [0, 1, 1, 0, 0, 0, 1, 1, 1, 0] },
            { label: variable2Select.value, data: [14, 1, 4, 8, 6, 5, 8, 12, 10, 14] },
            { label: variable3Select.value, data: [7, 1, 4, 8, 6, 10, 18, 12, 10, 14] },
            { label: variable4Select.value, data: [3, 2, 4, 8, 6, 10, 8, 12, 10, 14] }
        ]
    }

    // Populate datasets with dynamic data
    const dynamicData = fetchData()
    datasets.forEach((dataset, index) => {
        dataset.data = dynamicData[index].data
    })

    // Function to determine if dataset contains only boolean or numeric 0/1 values
    function containsOnlyBooleanOrNumeric01(data) {
        return data.every(value => typeof value === 'boolean' || value === 0 || value === 1)
    }

    // Determine min and max values for y-axes based on dataset contents
    let minDataValueLeft = Infinity
    let maxDataValueLeft = -Infinity
    let minDataValueRight = Infinity
    let maxDataValueRight = -Infinity

    datasets.forEach(dataset => {
        if (dataset.yAxis === 'left') {
            if (!containsOnlyBooleanOrNumeric01(dataset.data)) {
                const min = Math.min(...dataset.data)
                const max = Math.max(...dataset.data)
                minDataValueLeft = Math.min(minDataValueLeft, min)
                maxDataValueLeft = Math.max(maxDataValueLeft, max)
            } else {
                minDataValueLeft = 0
                maxDataValueLeft = 1
            }
        } else if (dataset.yAxis === 'right') {
            if (!containsOnlyBooleanOrNumeric01(dataset.data)) {
                const min = Math.min(...dataset.data)
                const max = Math.max(...dataset.data)
                minDataValueRight = Math.min(minDataValueRight, min)
                maxDataValueRight = Math.max(maxDataValueRight, max)
            } else {
                minDataValueRight = 0
                maxDataValueRight = 1
            }
        }
    })

    const numGridLinesX = 10
    const numGridLinesY = 5

    // Function to draw the legend
    function drawLegend() {
        const legendX = chartX + chartWidth - 225 // Center of the graph
        const legendY = canvas.height - 20 // Bottom of the canvas
        const itemWidth = 120 // Width of each legend item
        const itemHeight = 20 // Height of each legend item
        const itemSpacing = 20 // Spacing between legend items

        let currentX = legendX - (datasets.length * (itemWidth + itemSpacing)) / 2

        datasets.forEach((dataset, index) => {
            ctx.fillStyle = dataset.color
            ctx.fillRect(currentX, legendY, itemHeight, itemHeight)
            ctx.fillStyle = '#000000'
            ctx.fillText(dataset.label, currentX + itemHeight + 5, legendY + itemHeight - 5)
            currentX += itemWidth + itemSpacing
        })
    }

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    
        // Determine the exact height for the right y-axis to align with the left y-axis
        const leftYAxisHeight = chartHeight / (maxDataValueLeft - minDataValueLeft)
        const rightYAxisHeight = chartHeight / (maxDataValueRight - minDataValueRight)
    
        // Draw X axis
        ctx.beginPath()
        ctx.moveTo(chartX, chartHeight + chartY)
        ctx.lineTo(chartX + chartWidth, chartHeight + chartY)
        ctx.stroke()
    
        // Draw left Y axis
        ctx.beginPath()
        ctx.moveTo(chartX, chartY)
        ctx.lineTo(chartX, chartHeight + chartY)
        ctx.stroke()
    
        // Draw right Y axis
        ctx.beginPath()
        ctx.moveTo(chartX2, chartY)
        ctx.lineTo(chartX2, chartHeight + chartY)
        ctx.stroke()
    
        // Draw grid lines
        for (let i = 0; i <= numGridLinesX; i++) {
            let x = chartX + (chartWidth / numGridLinesX) * i
            ctx.beginPath()
            ctx.moveTo(x, chartY)
            ctx.lineTo(x, chartHeight + chartY)
            ctx.strokeStyle = '#e0e0e0'
            ctx.stroke()
        }
    
        for (let i = 0; i <= numGridLinesY; i++) {
            let y = chartY + (chartHeight / numGridLinesY) * i
            ctx.beginPath()
            ctx.moveTo(chartX, y)
            ctx.lineTo(chartX + chartWidth, y)
            ctx.strokeStyle = '#e0e0e0'
            ctx.fillStyle = '#000000'
            ctx.stroke()
        }
    
        // Draw data lines
        datasets.forEach(dataset => {
            ctx.beginPath()
            ctx.strokeStyle = dataset.color
            ctx.lineWidth = 2
    
            let yScale, minValue, yAxisHeight
            if (dataset.yAxis === 'left') {
                yScale = (value) => chartHeight - ((value - minDataValueLeft) / (maxDataValueLeft - minDataValueLeft)) * chartHeight
                minValue = minDataValueLeft
                yAxisHeight = leftYAxisHeight
            } else {
                yScale = (value) => chartHeight - ((value - minDataValueRight) / (maxDataValueRight - minDataValueRight)) * chartHeight
                minValue = minDataValueRight
                yAxisHeight = rightYAxisHeight
            }
    
            dataset.data.forEach((value, index) => {
                const x = chartX + (chartWidth / (dataset.data.length - 1)) * index
                const y = chartY + yScale(value)
    
                if (index === 0) {
                    ctx.moveTo(x, y)
                } else {
                    ctx.lineTo(x, y)
                }
            })
    
            ctx.stroke()
        })
    
        // Draw Y axis labels
        for (let i = 0; i <= numGridLinesY; i++) {
            let valueLeft, valueRight
            
            // Determine values for left y-axis
            if (minDataValueLeft === 0 && maxDataValueLeft === 1) {
                if (i === 0 || i === numGridLinesY) {
                    valueLeft = i === 0 ? 0 : 1 // Only show 0 at the bottom and 1 at the top
                } else {
                    valueLeft = undefined // Skip intermediate grid lines
                }
            } else {
                valueLeft = minDataValueLeft + (maxDataValueLeft - minDataValueLeft) * (i / numGridLinesY)
            }

            // Determine values for right y-axis
            if (minDataValueRight === 0 && maxDataValueRight === 1) {
                if (i === 0 || i === numGridLinesY) {
                    valueRight = i === 0 ? 0 : 1 // Only show 0 at the bottom and 1 at the top
                } else {
                    valueRight = undefined // Skip intermediate grid lines
                }
            } else {
                valueRight = minDataValueRight + (maxDataValueRight - minDataValueRight) * (i / numGridLinesY)
            }

            const y = chartY + chartHeight - (chartHeight / numGridLinesY) * i

            if (valueLeft !== undefined) {
                ctx.fillText(valueLeft.toFixed(1), chartX - 30, y + 3) // left y-axis labels
            }

            if (valueRight !== undefined) {
                ctx.fillText(valueRight.toFixed(1), chartX2 + 10, y + 3)  // right y-axis labels
            }
        }

        // Draw X axis labels
        datasets[0].data.forEach((_, index) => {
            const x = chartX + (chartWidth / (datasets[0].data.length - 1)) * index
            const label = `${index + 1}`
            ctx.fillText(label, x - 5, chartY + chartHeight + 20) // x-axis labels
        })

        // Draw legend
        drawLegend()
    }

    function showTooltip(event) {
        const rect = canvas.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
        let tooltipContent = ''
        let datasetLabels = []
        let pointsFound = 0
    
        datasets.forEach(dataset => {
            let minValue, maxValue
            if (dataset.yAxis === 'left') {
                minValue = minDataValueLeft
                maxValue = maxDataValueLeft
            } else if (dataset.yAxis === 'right') {
                minValue = minDataValueRight
                maxValue = maxDataValueRight
            }
    
            const dataLength = dataset.data.length
            const xIncrement = chartWidth / (dataLength - 1)
    
            for (let i = 0; i < dataLength; i++) {
                let x = chartX + xIncrement * i
                let y = chartHeight + chartY - ((dataset.data[i] - minValue) / (maxValue - minValue)) * chartHeight
                
                // Adjust the radius to detect points
                let radius = 6 // Increase the radius for points
    
                // Check if the cursor is near the point
                if (Math.abs(mouseX - x) <= radius && Math.abs(mouseY - y) <= radius) {
                    datasetLabels.push(dataset.label)
                    tooltipContent += `<p>${dataset.label} value: ${dataset.data[i]}</p>`
                    pointsFound++
                }
            }
        })
    
        if (pointsFound > 0) {
            title.textContent = datasetLabels.join(' | ')
            value.innerHTML = tooltipContent
            tooltip.style.left = `${mouseX + rect.left - tooltip.offsetWidth / 2}px` // Center the tooltip
            tooltip.style.top = `${mouseY + rect.top - tooltip.offsetHeight - 10}px`
    
            // Set the minimum height based on the number of datasets with points found
            switch (pointsFound) {
                case 1:
                    tooltip.style.minHeight = '80px'
                    break
                case 2:
                    tooltip.style.minHeight = '105px'
                    break
                case 3:
                    tooltip.style.minHeight = '155px'
                    break
                case 4:
                    tooltip.style.minHeight = '180px'
                    break
                default:
                    tooltip.style.minHeight = '80px'
                    break
            }

            tooltip.style.visibility = 'visible'
        } else {
            tooltip.style.visibility = 'hidden'
        }
    }

    // Update dataset function
    function updateDataset() {
        datasets[0].label = variable1Select.value
        datasets[0].color = colorLine1.value
        datasets[1].label = variable2Select.value
        datasets[1].color = colorLine2.value
        datasets[2].label = variable3Select.value
        datasets[2].color = colorLine3.value
        datasets[3].label = variable4Select.value
        datasets[3].color = colorLine4.value

        // Redraw the chart with updated datasets
        drawChart()
    }

    // Initial draw
    drawChart()

    // Hide tooltip
    function hideTooltip() {
        tooltip.style.visibility = 'hidden'
    }
    
    // Event listeners for tooltip
    canvas.addEventListener('mousemove', showTooltip)
    canvas.addEventListener('mouseout', hideTooltip)

    // Event listeners for color inputs
    colorLine1.addEventListener('input', updateDataset)
    colorLine2.addEventListener('input', updateDataset)
    colorLine3.addEventListener('input', updateDataset)
    colorLine4.addEventListener('input', updateDataset)

    // Event listeners for variable select inputs
    variable1Select.addEventListener('change', updateDataset)
    variable2Select.addEventListener('change', updateDataset)
    variable3Select.addEventListener('change', updateDataset)
    variable4Select.addEventListener('change', updateDataset)
})