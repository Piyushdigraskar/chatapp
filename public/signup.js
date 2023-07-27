async function saveToLocal(event){
    try{
        event.preventDefault();
        const signupDetails = {
            name:event.target.name.value,
            email:event.target.email.value,
            phone:event.target.phone.value,
            password:event.target.password.value
        }
        const response = await axios.post("",signupDetails);
        if(response.status === 201){
            console.log("success");
        }
        else{
            console.log("error")
        }

    }
    catch(err){
        console.log(err);
    }
}