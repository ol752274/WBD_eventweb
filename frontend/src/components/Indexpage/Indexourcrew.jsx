import React, { useEffect, useRef, useState } from 'react';
import '../../styles/Indexourcrew.css'; // Include your CSS for the styles
import emp1 from '../../assests/emp1.jpg';
import emp2 from '../../assests/emp2.jpg';
import emp3 from '../../assests/emp3.jpg';
import emp4 from '../../assests/emp4.jpg';
import emp5 from '../../assests/emp5.jpg';
import emp6 from '../../assests/emp6.jpg';
import emp7 from '../../assests/emp7.jpg';
import emp8 from '../../assests/emp8.jpg';
import emp9 from '../../assests/emp9.jpg';

const CrewSection = () => {
  const employeesRef = useRef([]); // Create a ref to hold references to each employee
  const [stepIndex, setStepIndex] = useState(0); // Manage the current step
  const stepCount = 9; // Total number of employees
  const stepsPerView = 3; // Number of employees to show at a time
  const transitionTime = 1000; // Time in milliseconds for each employee to start fading in
  const displayDuration = 5000; // Time in milliseconds to display each set of employees

  // UseEffect to handle the animation and interval logic
  useEffect(() => {
    // Function to hide all employees
    const hideAllEmployees = () => {
      employeesRef.current.forEach((employee) => {
        if (employee) {
          employee.classList.remove('fade-in');
          employee.style.opacity = 0;
          employee.style.visibility = 'hidden';
        }
      });
    };

    // Function to show the current set of employees with staggered timing
    const showSteps = () => {
      hideAllEmployees();

      // Show the current set of employees with staggered delays
      for (let i = 0; i < stepsPerView; i++) {
        const index = (stepIndex + i) % stepCount;
        const staggeredDelay = i * transitionTime; // Stagger the timing

        setTimeout(() => {
          if (employeesRef.current[index]) {
            employeesRef.current[index].classList.add('fade-in');
            employeesRef.current[index].style.opacity = 1;
            employeesRef.current[index].style.visibility = 'visible';
          }
        }, staggeredDelay);
      }
    };

    // Initial load to show steps
    showSteps();

    // Set interval to repeat the animation logic
    const interval = setInterval(() => {
      setStepIndex((prevIndex) => (prevIndex + stepsPerView) % stepCount);
    }, displayDuration + transitionTime * stepsPerView);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [stepIndex, stepCount, stepsPerView, transitionTime, displayDuration]);

  // Define the employees data array (all 9 employees)
  const employeesData = [
    {
      name: 'Alex',
      title: 'Event Manager',
      description: 'As the Event Coordinator, Alex ensures that all details are aligned with your vision and goals.',
      imgUrl: emp1,
    },
    {
      name: 'Jasmine',
      title: 'Event Planner',
      description: 'Jasmine is our Creative Planner, responsible for tailoring activities and logistics to fit your event needs.',
      imgUrl: emp2,
    },
    {
      name: 'Michael',
      title: 'Venue Manager',
      description: 'Michael, our Operations Specialist, ensures smooth execution and handles all on-site management tasks.',
      imgUrl: emp3,
    },
    {
      name: 'Emily',
      title: 'Event Photographer',
      description: 'Emily captures every moment to ensure the memories of your event last forever.',
      imgUrl: emp4,
    },
    {
      name: 'David',
      title: 'Room Setup Crew Lead',
      description: 'David ensures that every detail in the room is perfect and set up just the way you need it.',
      imgUrl: emp5,
    },
    {
      name: 'Olivia',
      title: 'On-Site Tech Supporter',
      description: 'Olivia provides all the technical support needed to ensure everything runs smoothly.',
      imgUrl: emp6,
    },
    {
      name: 'James',
      title: 'Check-In Kiosk Operator',
      description: 'James helps guests check in smoothly and makes sure they are ready for the event.',
      imgUrl: emp7,
    },
    {
      name: 'Alice',
      title: 'Transportation Assistant',
      description: 'Alice coordinates transportation to ensure your guests arrive on time and comfortably.',
      imgUrl: emp8,
    },
    {
      name: 'Linda',
      title: 'Gift Bag Assembler',
      description: 'Linda ensures every guest receives a personalized gift bag to take home memorable items.',
      imgUrl: emp9,
    },
  ];

  return (
    <div className="big-container-crew">
      <div className="title">
        Our Crew
        <p className="subcrew">
          Our dedicated employees bring diverse skills and a passion for excellence, driving our company’s success and fostering a collaborative and innovative work environment.
        </p>
      </div>

      <div className="employees" id="employees">
        {/* Render each employee and attach ref */}
        {employeesData.map((employee, index) => (
          <div
            key={index}
            className="employee"
            ref={(el) => (employeesRef.current[index] = el)} // Attach ref for each employee
            style={{
              top: `${Math.floor(index / 3) * 50}%`,
              left: `${(index % 3) * 33}%`,
            }}
          >
            <img
              src={employee.imgUrl}
              alt={`${employee.title} Icon`}
            />
            <h3>{employee.title}</h3>
            <p>{employee.description}</p>
            <div className="employee-name">{employee.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrewSection;
