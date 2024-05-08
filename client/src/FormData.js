import React from "react"
import { MdClose } from "react-icons/md"

const FormData = ({handleSubmit,handleOnChange,handleclose,rest}) => {
    return (
        <div className="addContainer">
            <form onSubmit={handleSubmit}> 
            <div className="close-btn" onClick={handleclose}><MdClose/></div>
              <label htmlFor="name">Name : </label>
              <input type="text" id="name" name="name" onChange={handleOnChange} value={rest.name}/>
    
              <label htmlFor="location">Location : </label>
              <input type="text" id="location" name="location" onChange={handleOnChange} value={rest.location}/>
    
              <label htmlFor="date">Date : </label>
              <input type="text" id="date" name="date" onChange={handleOnChange} value={rest.date}/>
    
              <label htmlFor="time">Time : </label>
              <input type="text" id="time" name="time" onChange={handleOnChange} value={rest.time}/>
    
              <button className="btn">Submit</button>
            </form>
        </div>
    )
}

export default FormData;