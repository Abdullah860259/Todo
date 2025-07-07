import React, { useState } from 'react'
import Error from '../components/Error'
const baseURL = import.meta.env.VITE_API_URL;

const CreateTask = () => {
    const [errtitle,seterrtitle] = useState("");
    const [showerror, setShowerror] = useState(false);
    const [form, setform] = useState({
        title: "",
        important: false,
        completed: false
    })

    function keyhandler(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendreq();
        }
    }
    async function sendreq() {
        if (form.title === "") {
            seterrtitle("Title must not be empty");
            setShowerror(true);
            return
        }
        const token = localStorage.getItem("loginInfo");
        let req = await fetch(`${baseURL}/createtask`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": token,
            },
            credentials: "include",
            body: JSON.stringify({
                title: form.title,
                important: form.important,
                completed: form.completed
            })
        })
        window.location.href = "/";
    }
    function handler(e) {
        if (e.target.type === 'checkbox') {
            return setform({ ...form, [e.target.name]: e.target.checked });
        }
        setform({ ...form, [e.target.name]: e.target.value });
    }

    return (
        <>
            <div className="ceateTask bg-blue-300 w-full h-screen  flex justify-center items-center flex-col gap-4 ">
                <h1 className='text-2xl font-bold'>Create Task</h1>
                <div className='flex justify-evenly flex-col gap-4 h-[50vh] items-center px-10 backdrop-blur-sm bg-white/100 p-4 rounded-2xl '>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={(e) => { handler(e) }}
                        onKeyDown={(e) => { keyhandler(e) }}
                        style={{ border: "2px solid black" }}
                        className=' outline-none border-2 bg-white border-gray-400 p-2  rounded-xl w-full ' placeholder="Enter Task" />

                    <div className=" w-full flex items-center gap-2">
                        <input
                            name='important'
                            type="checkbox"
                            checked={form.important}
                            id="important"
                            className="w-4 h-4 text-blue-600 accent-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer outline-none focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={(e) => { handler(e) }}
                        />
                        <label htmlFor="important" className=" cursor-pointer select-none text-gray-700 font-medium">
                            Important
                        </label>
                    </div>
                    <button
                        onClick={() => { sendreq() }}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-all duration-100 ease-in-out hover:scale-105' >Submit</button>
                </div>
            </div>
            {showerror && (<Error decs={errtitle} onClose={() => { setShowerror(false) }} />)}
        </>
    )
}

export default CreateTask