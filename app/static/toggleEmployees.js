const addEmployeeBtn = document.getElementById("add"); //addEmployeeForm button

function toggleemployeeShowForm(className) {
  const formContainer = document.getElementById("form__container");
  //main container should have an overlay property attached to it after click on showAddEmployeeForm

  const showAddEmployeeForm = () => {
    if (
      !document.querySelector("#emp__container").classList.contains("hidden")
    ) {
      document.querySelector("#emp__container").classList.toggle("hidden");
    }
    formContainer.classList.toggle(className);
    // formContainer.classList.toggle(overlay);
  };
  showAddEmployeeForm();
}
//showing the form on click add employee button

addEmployeeBtn.onclick = () => {
  toggleemployeeShowForm("hidden");
};


//close btn employee hiding the employee add form
document.addEventListener('click',(event)=>{
  if(event.target.id ==='closeBtnEmployee'){
  event.preventDefault();
  toggleemployeeShowForm("hidden");}
})




