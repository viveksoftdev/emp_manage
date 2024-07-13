//code for add extra container dynamically for workexp,qualifications and projects

const addWorkExperienceBtn = document.querySelector("#add__work");
const addQualificationsBtn = document.querySelector("#add__qualifications");
const addProjectsBtn = document.querySelector("#add__projects");

const workExperienceContainer = document.querySelector(
  "#work__experiece-container"
);
const workExperience = document.querySelectorAll(".work__experience");

const qualificationsContainer = document.querySelector(
  "#qualifications__container"
);
const qualification = document.querySelectorAll(".qualification");

const projectsContainer = document.querySelector("#projects__container");
const project = document.querySelectorAll(".project");

//function for add fields dynamically to the relevant containers.

//parameters are the fields that are going to get cloned in this function, containerChange is for appending the changes for dynamic for fields.

let currentState = { workBtn: 1, qualBtn: 1, proBtn: 1 };

const onClickAddFormFields = (node, containerChange, btnType) => {
  counter = currentState[btnType];
  console.log(currentState[btnType]);
  const container = node[0].cloneNode(true);
  counter++;
  currentState[btnType] = counter;

  container.querySelectorAll("input").forEach((element) => {
    //getting the name attribute value of the element.
    const name = element.getAttribute("name");

    //getting the id attribute value of the element.
    const id = element.getAttribute("id");

    console.log(counter);
    //now setting the attribute id, and name with some modification so that id and name should not be duplicated.
    element.setAttribute("id", id.slice(0, -1) + `${counter}`);
    element.setAttribute("name", name.slice(0, -1) + `${counter}`);
    element.value = "";
  });

  if (counter <= 4) {
    containerChange.appendChild(container);
  }
};
//onclick workexperice dynamic form fields addition

// //onclick projects dynamic form fields addition

addWorkExperienceBtn.onclick = (event) => {
  event.preventDefault();

  onClickAddFormFields(workExperience, workExperienceContainer, "workBtn");
};

//onclick qualifiction dynamic form fields addition
addQualificationsBtn.onclick = (event) => {
  event.preventDefault();

  onClickAddFormFields(qualification, qualificationsContainer, "qualBtn");
};

addProjectsBtn.onclick = (event) => {
  event.preventDefault();

  onClickAddFormFields(project, projectsContainer, "proBtn");
};
