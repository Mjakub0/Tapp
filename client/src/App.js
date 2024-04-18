import logo from './logo.svg';
import './App.css';
import {MdClose, MdElderlyWoman} from "react-icons/md"
import { useEffect, useState } from 'react';
import axios from "axios"
import FormData from './FormData';

axios.defaults.baseURL = "http://localhost:8080/"

function App() {
  const [addSection,setAddSection] = useState(false)
  const [editSection,setEditSection] = useState(false)
  const [formData,setFormData] = useState({
    name : "",
    location : "",
    date : "",
    time : "",
  })
  const [formDataEdit,setFormDataEdit] = useState({
    name : "",
    location : "",
    date : "",
    time : "",
    _id : ""
  })
  const [dataList,setDataList] = useState([])

  const handleOnChange = (e)=>{
    const {value,name} = e.target
    setFormData((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    axios.post("/create",formData).then((res) => {
      dataList.unshift(res.data.data)
      setAddSection(false)
      getFetchData()
      setFormData({
        name : "",
        location : "",
        date : "",
        time : "",
      })
    })
  }
  
  const getFetchData = async()=>{
    const data = await axios.get("/")
    console.log(data)
    if(data.data.success){
      setDataList(data.data.data)
      
    }
  }
  useEffect(()=>{
    getFetchData()
  },[])

  const handleDelete = async(id)=>{
    const data = await axios.delete("/delete/"+id)
      
      if(data.data.success){
      getFetchData()
      alert(data.data.message)
      }
  }

  const handleUpdate = async(e)=>{
    e.preventDefault()
    const data = await axios.put("/update/",formDataEdit)
    if(data.data.success){
      getFetchData()
      alert(data.data.message)
      setEditSection(false)
      }    
  }
  const handleEditOnChange = async(e)=>{
    const {value,name} = e.target
    setFormDataEdit((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })    
  }

  const handleEdit = (el)=>{
    setFormDataEdit(el)
    setEditSection(true)
  }

  return (
    <>
    <div className="container">
      <button className="btn btn-add" onClick={()=>setAddSection(true)}>Add</button>
      {
        addSection && (
          <FormData
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          handleclose = {()=>setAddSection(false)}
          rest={formData}
          />
        )
      }
      {
        editSection && (
          <FormData
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          handleclose = {()=>setEditSection(false)}
          rest={formDataEdit}
          />
        )
      }

      <div className='tableContainer'>     
         <table>
          <table>
          <thead>
            <tr>
              <th>Name</th>            
              <th>Location</th>            
              <th>Date</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          </table>
          <table>
          <tbody>
            {
              dataList.map((el)=>{
                console.log(el)
                return(
                  <tr>
                    <td>{el.name}</td>
                    <td>{el.location}</td>
                    <td>{el.date}</td>
                    <td>{el.time}</td>
                    <td>
                    <button className='btn btn-edit' onClick={()=>handleEdit(el)}>Edit</button>
                    <button className='btn btn-delete'onClick={()=>handleDelete(el._id)}>Delete</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
          </table>
         </table>
        </div>

      </div>    
  </>  
  );
}

export default App;
