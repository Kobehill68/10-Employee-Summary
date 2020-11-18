const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


const managerQuestions = [
    {
        type: "input",
        name: "managerName",
        message: "What is the manager's name?"
    },
    {
        type: "input",
        name: "managerId",
        message: "What is the manager's ID number?"
    },
    {
        type: "input",
        name: "managerEmail",
        message: "What is the manager's email address?"
    },
    {
        type: "input",
        name: "managerOffice",
        message: "What is the manager's Office Number?"
    },

];

const promptquestions = [
    {
        type: "list",
        name: "nextQuestion",
        message:"Would you like to add more employees to the page?",
        choices: [
            "Add an Engineer",
            "Add an Intern",
            "Don't add any more employees"
        ]
    }

];

const engineerQuestions = [
    {
        type: "input",
        name: "engineerName",
        message: "What is the engineer's name?"
    },
    {
        type: "input",
        name: "engineerId",
        message: "What is the engineer's ID number?"
    },
    {
        type: "input",
        name: "engineerEmail",
        message: "What is the engineer's email address?"
    },
    {
        type: "input",
        name: "engineerGithub",
        message: "What is the engineer's Github username?"
    },

];

const internQuestions = [
    {
        type: "input",
        name: "internName",
        message: "What is the intern's name?"
    },
    {
        type: "input",
        name: "internId",
        message: "What is the intern's ID number?"
    },
    {
        type: "input",
        name: "internEmail",
        message: "What is the intern's email address?"
    },
    {
        type: "input",
        name: "internSchool",
        message: "Where does the intern go to school?"
    },
];

async function prompter(manager, engineers, interns) {
    inquirer.prompt(promptquestions).then((answer) => {
        if (answer.nextQuestion === "Add an Engineer") {
            const engineersArray = engineers;
            inquirer.prompt(engineerQuestions).then((answers)=> {
                const newEngineer = new Engineer(
                    answers.engineerName,
                    answers.engineerID,
                    answers.engineerEmail,
                    answers.engineerGithub 
                );
                engineersArray.push(newEngineer);
                prompter(manager, engineersArray, interns)
            })
        } else if(answer.nextQuestion === "Add an Intern") {
            const internsArray = interns;
            inquirer.prompt(internQuestions).then((answers) => {
                const newIntern = new Intern(
                    answers.internName,
                    answers.internID,
                    answers.internEmail,
                    answers.internSchool 
                );
                internsArray.push(newIntern);
                prompter(manager, engineers, internsArray)
            });
        } else {
            const myHTML = render ([manager, ...engineers, ...interns]);
            fs.writeFileSync("./output/team.html", myHTML)

            return;
        }
    })
}

inquirer.prompt(managerQuestions).then((answers) =>{
    const manager = new Manager(
        answers.managerName,
        answers.managerID,
        answers.managerEmail,
        answers.managerOffice
    )
    prompter(manager, [], [])
});