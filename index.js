const svg = d3.select('svg')

const height = svg.attr('height')
const width = svg.attr('width')
const margin = {left: 90, right: 50, top: 60, bottom: 50}

const render = data =>{
  const innerHeight = height - margin.top - margin.bottom
  const innerWidth = width - margin.left - margin.right
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.World)])
    .range([0, innerWidth])

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([0, innerHeight])
    .padding(0.2)

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const xAxisTickFormat = number => 
    d3.format('.2s')(number)
    .replace('G', 'B')

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight)

  g.append('g')
    .call(d3.axisLeft(yScale))
    .selectAll('.domain, .tick line')
      .remove()

  const xAxisG = g.append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${innerHeight})`)

  xAxisG.select('.domain').remove()

  xAxisG.append('text')
      .attr('class', 'axis-label')
      .attr('x', innerWidth/2)
      .attr('y', 50)
      .attr('fill', 'black')
      .text('Number of CoronaVirus Cases')

  g.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('y', d => yScale(d.date))
  .attr('width', d => xScale(d.World))
  .attr('height', yScale.bandwidth())

  g.append('text')
    .attr('class', 'title')
    .attr('y', -20)
    .text('CoronaVirus Cases over Time')
  
}


d3.csv('total_cases.csv').then(data => {
  data.forEach(d => {
    d.World = +d.World
  })
  render(data)
})

