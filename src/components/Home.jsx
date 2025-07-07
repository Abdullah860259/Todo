import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Task from './Task'
import "../index.css"
const baseURL = import.meta.env.VITE_API_URL;



function Home() {
  const [tasks, setTasks] = useState([]);
  const [impTasks, setImpTasks] = useState([]);
  const [compTasks, setCompTasks] = useState([]);
  const [allTasks, setallTasks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const options = ["All Tasks", "Completed", "Important"];
  useEffect(() => {
    if(activeIndex===0){
      setTasks(allTasks);
    }else if(activeIndex===1){
      setTasks(compTasks);
    }else if(activeIndex===2){
      setTasks(impTasks);
    }
  }, [activeIndex])
  useEffect(() => {
    let res = async () => {
      let data = await fetch(`${baseURL}/gettask`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Authorization": localStorage.getItem("loginInfo")
        }
      })
      let data1 = await data.json();
      setTasks(data1);
      setallTasks(data1);
      setImpTasks(data1.filter((task) => task.Important));
      setCompTasks(data1.filter((task) => task.completed));
    }
    res();
  }, [])

  return (
    <>
      <><Navbar />
        <main className=' w-full h-[calc(100vh-56px)] flex justify-center items-center  bg-purple-200 py-16 ' >
          <section className=' taskContainer flex justify-center  border-2 border-black items-center flex-col gap-4 p-15 min-w-120 w-[55vw] h-[70vh] rounded-2xl bg-purple-800 ' >
            <section className='  rend w-full h-full max-h bg-purple-200 rounded-2xl p-4 flex  items-center flex-col gap-2 '>
              <section className=' buttonsContainer bg-purple-400 h-[60px]   flex items-center justify-center w-full py-1 rounded-xl px-5  '>
                <ul className='flex  justify-between py-1  items-center font-bold  w-full '>
                  {options.map((option, index) => (
                    <button key={index} className={` h-full w-auto rounded-2xl cursor-pointer hover:scale-105 duration-75 hover:bg-white origin-center trasition-all ease-in-out py-1 px-4 ${activeIndex === index ? "active" : ""}`} onClick={() => setActiveIndex(index)} >{option}</button>
                  ))}
                </ul>
              </section>
              <div className=' w-full pr-2 h-full overflow-y-auto flex flex-col gap-2'>
                {tasks.length === 0 && <div className=' w-full h-full flex justify-center items-center ' >No Tasks</div>}
                {tasks.map((task, index) => (
                  <Task
                    key={index}
                    title={task.title}
                    task={task}
                  />
                ))}
              </div>
            </section>
            <button className=' bg-purple-200 h-[60px] min-h-11 flex items-center justify-center w-[150px]  rounded-xl  font-semibold cursor-pointer hover:scale-105 duration-100  transition-all ease-in-out outline-none hover:border-blue-600 hover:border-2 hover:bg-white ' >
              <Link to="/createtask" className="w-full h-full flex items-center justify-center">
                Create Task
              </Link>
            </button>
          </section>
        </main></>
    </>
  )
}

export default Home
