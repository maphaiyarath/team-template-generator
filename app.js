const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

// array to hold all staff
const employees = [];

// array of questions for the user
const questions = [
    {
        type: 'list',
        name: 'role',
        message: 'What is the role of the employee you are adding:',
        choices: ['Manager', 'Engineer', 'Intern']
    },
    {
        type: 'input',
        name: 'name',
        message: "What is the employee's name?"
    },
    {
        type: 'input',
        name: 'id',
        message: "What is the employee's ID?"
    },
    {
        type: 'input',
        name: 'email',
        message: "What is the employee's email?"
    },
    {
        type: 'input',
        name: 'officeNumber',
        message: "What is the manager's office number?",
        when: employee => employee.role === 'Manager'
    },
    {
        type: 'input',
        name: 'github',
        message: "What is the engineer's Github?",
        when: employee => employee.role === 'Engineer'
    },
    {
        type: 'input',
        name: 'school',
        message: "Where does the intern go to school?",
        when: employee => employee.role === 'Intern'
    },
    {
        type: 'confirm',
        name: 'addEmployee',
        message: "Would you like to add another employee?"
    }
];

// function to initialize program
const askQs = () => {
    inquirer
        .prompt(questions)
        .then(answers => {
            // create a new employee
            let newEmployee;

            if (answers.role === 'Manager') {
                newEmployee = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
            } else if (answers.role === 'Engineer') {
                newEmployee = new Engineer(answers.name, answers.id, answers.email, answers.github);
            } else if (answers.role === 'Intern') {
                newEmployee = new Intern(answers.name, answers.id, answers.email, answers.school);
            }
            
            // add the employee to the array
            employees.push(newEmployee);

            // write inquirer data to outputPath file
            if (!answers.addEmployee) {
                const data = render(employees);
                fs.writeFile(outputPath, data, (err) => {
                    if (err) console.log(err);
                });
            } else {
                // continue adding more employees
                askQs();
            }
        });
};

askQs();