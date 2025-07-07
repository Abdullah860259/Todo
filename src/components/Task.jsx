import React from 'react'
const baseURL = import.meta.env.VITE_API_URL;

const Task = (props) => {

    async function makeImportant() {
        try {
            let data = await fetch(`${baseURL}/important/${props.task._id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": localStorage.getItem("loginInfo")
                }
            });
            if (data.status === 200) {
                window.location.href = "/";
            } else {
                console.log(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteTask() {
        try {
            let data = await fetch(`${baseURL}/delete/${props.task._id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": localStorage.getItem("loginInfo")
                }
            });
            if (data.status === 200) {
                window.location.href = "/";
            } else {
                alert("Server Error");
            }
        } catch (error) {
            console.log(error);f
        }
    }

    
    async function completed() {
        try {
            let data = await fetch(`${baseURL}/completed/${props.task._id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": localStorage.getItem("loginInfo")
                }
            });
            if (data.status === 200) {
                window.location.href = "/";
            } else {
                alert("Server Error");
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className="task w-full h-15 bg-purple-400 rounded-2xl p-4 flex items-center justify-between">
                <p className={`${props.task.completed ? "linethrough" : ""}`} >{props.title}</p>
                <div className="operations flex h-full w-24   justify-between items-center   ">
                    {props.task.Important ? <svg xmlns="http://www.w3.org/2000/svg" onClick={makeImportant} className='cursor-pointer' height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M840-680H600v-80h240v80ZM200-120v-640q0-33 23.5-56.5T280-840h240v80H280v518l200-86 200 86v-278h80v400L480-240 200-120Zm80-640h240-240Z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' onClick={makeImportant} fill="black" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>}
                    {props.task.completed ? <svg className='cursor-pointer' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg> : <svg
                        onClick={completed}
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        className='cursor-pointer'
                        fill="black"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>}
                    <svg className='cursor-pointer' onClick={deleteTask} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg>
                </div>
            </div>
        </>
    )
}

export default Task