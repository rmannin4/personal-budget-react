import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3ChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    d3.json('http://localhost:3000/budget')
      .then((data) => {
        if (data && data.myBudget) {
          createD3chart(data.myBudget);
        }
      })
      .catch((error) => {
        console.error('Error fetching budget data for D3 chart:', error);
      });

    return () => {
      d3.select(chartRef.current).selectAll('*').remove();
    };
  }, []);

  const createD3chart = (budgetData) => {
    const width = 960,
      height = 500,
      radius = Math.min(width, height) / 2;

    d3.select(chartRef.current).html('');

    const svg = d3
      .select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    const color = d3
      .scaleOrdinal()
      .domain(budgetData.map(d => d.title))  
      .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d.budget);

    const arc = d3
      .arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    svg
      .selectAll('path.slice')
      .data(pie(budgetData))
      .enter()
      .append('path')
      .attr('class', 'slice')
      .style('fill', (d) => color(d.data.title))
      .attr('d', arc);

    svg
      .selectAll('text')
      .data(pie(budgetData))
      .enter()
      .append('text')
      .attr('transform', (d) => 'translate(' + arc.centroid(d) + ')')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text((d) => d.data.title);
  };

  return <svg ref={chartRef}></svg>;
};

export default D3ChartComponent;
