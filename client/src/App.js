import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import FormData from './FormData';

axios.defaults.baseURL = "http://localhost:8080/";

function App() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
  });
  const [formDataEdit, setFormDataEdit] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    _id: ""
  });
  const [dataList, setDataList] = useState([]);
  const [notesPage, setNotesPage] = useState("MakePlan");

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kontrola, či sú všetky polia vyplnené
    if (!formData.name || !formData.location || !formData.date || !formData.time) {
      alert('Musíte vyplniť všetky políčka!');
      return;
    }

    try {
      const res = await axios.post("/createPlan", formData);
      dataList.unshift(res.data.data);
      setAddSection(false);
      getFetchData();
      setFormData({
        name: "",
        location: "",
        date: "",
        time: "",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getFetchData = async () => {
    try {
      const data = await axios.get("/");
      if (data.data.success) {
        setDataList(data.data.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  useEffect(() => {
    getFetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const data = await axios.delete("/delete/" + id);
      if (data.data.success) {
        getFetchData();
        alert(data.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.put("/update/", formDataEdit);
      if (data.data.success) {
        getFetchData();
        alert(data.data.message);
        setEditSection(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEditOnChange = async (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  const handlePageChange = (page) => {
    setNotesPage(page);
  };

  return (
    <>
    <nav>
        <div className="navbar">
          <h1>T plan</h1>
        </div>
      </nav>
      <div className="container">
      <div className="logo"></div>
        <div className="sidebar">
          <button className="btn-makePlan" onClick={() => handlePageChange("MakePlan")}>Make Plan</button>
          <button className="btn-notes" onClick={() => handlePageChange("Notes")}>Notes</button>
        </div>
        {notesPage === "MakePlan" && (
          <div className="content">
            <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>
            {addSection && (
              <FormData
                handleSubmit={handleSubmit}
                handleOnChange={handleOnChange}
                handleclose={() => setAddSection(false)}
                rest={formData}
              />
            )}
            {editSection && (
              <FormData
                handleSubmit={handleUpdate}
                handleOnChange={handleEditOnChange}
                handleclose={() => setEditSection(false)}
                rest={formDataEdit}
              />
            )}
            <div className='tableContainer'>
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
                <tbody>
                  {dataList.map((el) => (
                    <tr key={el._id}>
                      <td>{el.name}</td>
                      <td>{el.location}</td>
                      <td>{el.date}</td>
                      <td>{el.time}</td>
                      <td>
                        <button className='btn btn-edit' onClick={() => handleEdit(el)}>Edit</button>
                        <button className='btn btn-delete' onClick={() => handleDelete(el._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {notesPage === "Notes" && (
          <div className="contents">
          <h1>Notes</h1>
          <h3>Here you can write notes about your trip</h3>
          <textarea className="note-textarea" style={{ width: "400px", resize: "vertical",fontFamily: "Arial", fontSize: "16px"}} placeholder="Write your notes here..."></textarea>
        </div>
        )}
      </div>
    </>
  );
  
}

export default App;
