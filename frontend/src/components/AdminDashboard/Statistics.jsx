import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2'; // Import Pie
import axios from 'axios';
import '../../styles/Statistics.css'; // Ensure this path is correct
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement, // Required for Pie Chart
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement); // Register ArcElement for Pie

const Statistics = () => {
    const [chartData, setChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null); // State for Pie chart
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading
            try {
                console.log('Fetching data...'); // Debug log
                const response = await axios.get('http://localhost:5000/trailAdmin'); // Adjust to your API endpoint
                console.log('Response data:', response.data); // Log the response data
                
                const incomeData = response.data;
                
                // Check if incomeData is not empty
                if (!incomeData || Object.keys(incomeData).length === 0) {
                    setError('No data available.');
                    setLoading(false);
                    return; // Exit early if no data
                }

                // Prepare data for the chart
                const labels = Object.keys(incomeData);
                const incomeValues = labels.map(label => incomeData[label].totalIncome);
                
                // Generate random colors for each bar
                const colors = labels.map(() => `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.6)`);
                const borderColors = colors.map(color => color.replace(/0.6/, '1')); // Darker borders

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Current total Income by Event Type',
                            data: incomeValues,
                            backgroundColor: colors,
                            borderColor: borderColors,
                            borderWidth: 1,
                        },
                    ],
                });

                // Prepare data for the Pie chart
                setPieChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: ' Current total Income by Event Type (Pie Chart)',
                            data: incomeValues,
                            backgroundColor: colors, // Use the same colors for consistency
                            borderColor: borderColors,
                            borderWidth: 1,
                        },
                    ],
                });

            } catch (error) {
                console.error('Error fetching chart data:', error);
                setError('Failed to fetch data. Please try again later.');
            } finally {
                console.log('Loading finished'); // Debug log
                setLoading(false); // End loading
            }
        };

        fetchData();
    }, []); // Ensure empty dependency array

    // Function to generate a random color
    const randomColor = () => {
        return Math.floor(Math.random() * 256); // Random number between 0-255
    };

    return (
        <div className="container1">
            <h2>Current Total Income of Ongoing Events by Event Type</h2>
            {loading && <div className="message">Loading...</div>}
            {error && <div className={`message error`}>{error}</div>}
            {chartData && (
                <div className="chartContainer1">
                    <h3>Bar Chart</h3>
                    <Bar 
                        data={chartData} 
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Event Type',
                                    },
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Total Income (₹)',
                                    },
                                    beginAtZero: true,
                                },
                            },
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (tooltipItem) {
                                            return `${tooltipItem.dataset.label}: ₹${tooltipItem.raw.toLocaleString()}`;
                                        },
                                    },
                                },
                            },
                        }} 
                    />
                </div>
            )}
            {pieChartData && (
                <div className="chartContainer1">
                    <h3>Pie Chart</h3>
                    <Pie
                        data={pieChartData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (tooltipItem) {
                                            return `${tooltipItem.label}: ₹${tooltipItem.raw.toLocaleString()}`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Statistics;
