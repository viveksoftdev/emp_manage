document.addEventListener("DOMContentLoaded", () => {
  //

  // code for send post data to server on form submit //

  //Getting Csrf Token From Cookies

  const getCsrfTokenFromCookies = (name) => {
    //cookie value variable to store the csrftoken set to null in the beginning
    let cookieValue = null;

    //checking for cookies and checking whether they hold any value
    if (document.cookie && document.cookie != "") {
      //splitting at ;
      const cookies = document.cookie.split(";");

      //looping in the range from 0 to cookies.length
      for (let i = 0; i < cookies.length; i++) {
        //holding the cookie in a cookie var
        const cookie = cookies[i].trim();

        //checking that the cookie has the name as substring
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

          break;
        }
      }
    }
    return cookieValue;
  };

  //csrf token value
  const csrfToken = getCsrfTokenFromCookies("csrftoken");
  console.log(csrfToken);
  //csrf token value
  const formData = document.getElementById("emp__form");
  const formSubmitBtn = document.getElementById("form__submit");
  const url = "http://localhost:8000/post";
  console.log(formData);
  console.log(formSubmitBtn);
  // function for capturing and sending employee data to the backend
  const sendEmployeeDataTobackend = (url,data) => {
    fetch(url, {
      method: "POST",
      body: data,
      headers: {
        'csrfmiddlewaretoken': csrfToken,
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          
          alert(resp.status)
          
        } else {
          return resp.json()
        }
      })
      .then((data) => {
        alert(data.message);
      });
  };

  formSubmitBtn.onclick = (event) => {
    event.preventDefault();
    const form = new FormData(formData)
    sendEmployeeDataTobackend(url,form);
  };

  // code for send post data to server on form submit //

  //function related to showing employees in a tabular format
  let employeeArray = new Array();
  const showEmployees = document.getElementById("show");
  const row = document.querySelector("#table__head");
  // const table = document.getElementById('table');
  const empContainer = document.querySelector("#emp__container");
  const tableHead = document.querySelector("#table__head");
  const closeBtn = document.querySelector("#closeBtn");

  const makeTableFromEmpData = (data) => {
    const tBody = document.querySelector("tbody"); // Get the tbody element

    // Clear existing content in the tbody
    tBody.innerHTML = "";

    data.forEach((employee) => {
      const trElement = document.createElement("tr"); // Create a new row for each employee
      const editLink = document.createElement("a");
      const deleteLink = document.createElement("a");
      const tableDataElement = document.createElement("td");
      
      // Iterate over each column header ('th') in the table
      const columns = ["name", "email", "gender", "age"]; // Adjust as per your actual column headers

      columns.forEach((column) => {
        const td = document.createElement("td"); // Create a table data cell
        

        td.textContent = employee[column] || ""; // Set the data cell text to the corresponding employee property

        trElement.appendChild(td); // Append the data cell to the row
      });
      editLink.setAttribute('class','edit')//setting the id attribute for future reference
      editLink.textContent = "Edit";
      deleteLink.setAttribute('class','delete')//setting the id attribute for future reference
      deleteLink.textContent = 'Delete'
      tableDataElement.appendChild(editLink);
      tableDataElement.appendChild(deleteLink)
      trElement.appendChild(tableDataElement);
      tBody.appendChild(trElement); // Append the row to the tbody
    });
  };

  const fetchAllEmployees = () => {
    fetch("http://localhost:8000/show", {
      method: "GET",
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        makeTableFromEmpData(data.values);
      });
  };

  showEmployees.onclick = () => {
    if(document.querySelector('#delete__employees')){
      document.querySelector('#delete__employees').classList.add('hidden')
    }
    empContainer.classList.toggle("hidden");
    

    fetchAllEmployees();
    document.querySelectorAll('.container')[0].classList.add('hidden');
  }

  closeBtn.onclick = () => {
    empContainer.classList.toggle("hidden");
  };

  //making employee table row editable

  //fuctions related to deleting employee

  const deleteEmployee = (data) => {
    fetch(`http://localhost:8000/delete`, {
      method: "DELETE",
      body:data,
      headers: {
        "Content-Type": "application/json",
        csrfmiddlewaretoken: csrfToken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          alert("Network response was not ok");
        }
        // Optionally handle the response data if your server returns any
        return response.json();
      })
      .then((data) => {
        // Handle the data if needed
        alert(data.message);
      })
      .catch((error) => {
        if (error.status=='404'){
          alert('Employee does not exist')
        }
      });
  };

//function for editing employee record

const editBtn = document.getElementById('edit');


//function for making the emmployees show table row editable
let isEditing = false;
document.addEventListener('click',(event)=>{
     if(event.target.classList.contains('edit')){
      const elementEdit = event.target.parentElement.parentElement;
      const rowHeaderValues = ['name','email','gender','age']
      let value;
      elementEdit.querySelectorAll('td').forEach((element,index)=>{
      value = element.textContent;
        
        if(element.textContent!='EditDelete' && !isEditing && element.textContent!='Edit' && element.textContent!='Save'){
          
          
            element.innerHTML =`<input class="current" id="${rowHeaderValues[index]}"type="text" value="${value}"/>`}

            if (element.innerHTML.includes('@')){
              element.innerHTML =`<input class="current" id="${rowHeaderValues[index]}"type="text" value="${value}" readonly="readonly"/>`
            }
          
        else if(element.textContent ==='EditDelete' && !isEditing){
          element.textContent = isEditing? 'Edit':'Save'
          element.classList.toggle('save')
          element.classList.toggle('clicked')
          console.log(element.classList)
          element.style.cursor = 'pointer';
          element.onmouseover = ()=>{
            element.style.color = 'green';
          }
          isEditing = true;
        }
        
      
        
      }
    )

      
     }
})


document.addEventListener('click',(event)=>{
  
  if(event.target.classList.contains('clicked')){
    let updateObject = {}
    console.log('save operation.')
    
    const elementEdit = event.target.closest('tr');
    elementEdit.querySelectorAll('input').forEach((element)=>{
      
      if(element.textContent != 'save'){
        updateObject[element.id] = element.value;
        
      }
      
    })
    
    alert(`{sending to the backend ${Object.values(updateObject)}`)
    const updateUrl = 'http://localhost:8000/updateview'
    sendEmployeeDataTobackend(updateUrl,JSON.stringify(updateObject))
    isEditing = false;
    
  
    
   
    
  }
 
})

//handling the delete operations
//handling closing down the employee add form on clicking close__btn


const deleteEmployeeBtn = document.querySelector('#delete');
const formContainer = document.querySelector('#form__container');

deleteEmployeeBtn.onclick = ()=>{
  if(empContainer){
    empContainer.classList.add('hidden');
  }
    document.querySelector('#delete__employees').classList.toggle('hidden');
}


const deleteBtn = document.querySelector('#delete__user');
console.log(deleteBtn);


deleteBtn.onclick = ()=>{
  
  const value = document.querySelector('#delete__user-email').value;
  
  deleteEmployee(JSON.stringify({email:value}));
  document.querySelector('#delete__employees').classList.toggle('hidden');
  
}





























});




