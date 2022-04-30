import { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]


export default function TextEditor() {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const {id: documentId } = useParams();
  
  const handleSave = ()=>{
    const contents = quill.root.innerHTML;
    console.log(contents);
    console.log(documentId);
    //check if document exists

    const UPDATE_URI = `http://localhost:5001?id=${documentId}`;


    axios.get(UPDATE_URI)
      .then(()=> {
        axios.put(UPDATE_URI, {contents})
          .then(()=>{
            console.log('saved');
          })
          .catch(error => console.log(error));
      })
      .catch(()=>{
        axios.post(UPDATE_URI, {contents})
          .then(()=>{
            console.log('saved');
          })
          .catch(error => console.log(error));
      })
      alert('saved');
  }

  useEffect(() => {
    const s = io('http://localhost:5000');
    setSocket(s);

    return () => {
      s.disconnect();
    }
  }, []);

  useEffect(() => {
    if(socket === null || quill == null) return;

    socket.once('load-document', document => {
      quill.enable();
      console.log(document);
      quill.root.innerHTML = document.contents;
    })

    socket.emit('get-document', documentId);

  }, [socket, quill, documentId]);

  useEffect(()=>{

    if(socket == null || quill == null) return;
    const handler = (delta, old_delta, source) => {
      if(source !== 'user') return;
      socket.emit('send-changes', delta);
    };
    quill.on('text-change', handler);

    return ()=>{
      quill.off('text-change', handler);
    }
  }, [socket, quill]);

  useEffect(()=>{

    if(socket == null || quill == null) return;
    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on('recieve-changes', handler);

    return ()=>{
      quill.off('recieve-changes', handler);
    }
  }, [socket, quill]);


  const wrapperRef = useCallback(wrapper => {
    if(wrapper == null) return;
    wrapper.innerHTML = "";

    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, { theme: "snow" , modules: { toolbar: TOOLBAR_OPTIONS } });

    q.disable();
    // q.setText('Loading...');
    setQuill(q);
  }, [])

  return (
    <div>
      <button onClick={()=>{ handleSave() }}>Save</button>
      <div className='container' ref={wrapperRef}></div>
    </div>
  );
}

// import { useCallback, useEffect, useState } from "react"
// import Quill from "quill"
// import "quill/dist/quill.snow.css"
// import { io } from "socket.io-client"
// import { useParams } from "react-router-dom"

// const SAVE_INTERVAL_MS = 2000
// const TOOLBAR_OPTIONS = [
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   [{ font: [] }],
//   [{ list: "ordered" }, { list: "bullet" }],
//   ["bold", "italic", "underline"],
//   [{ color: [] }, { background: [] }],
//   [{ script: "sub" }, { script: "super" }],
//   [{ align: [] }],
//   ["image", "blockquote", "code-block"],
//   ["clean"],
// ]

// export default function TextEditor() {
//   const { id: documentId } = useParams()
//   const [socket, setSocket] = useState()
//   const [quill, setQuill] = useState()

//   useEffect(() => {
//     const s = io("http://localhost:5000")
//     setSocket(s)

//     return () => {
//       s.disconnect()
//     }
//   }, [])

//   useEffect(() => {
//     if (socket == null || quill == null) return

//     socket.once("load-document", document => {
//       quill.setContents(document)
//       quill.enable()
//     })

//     socket.emit("get-document", documentId)
//   }, [socket, quill, documentId])

//   useEffect(() => {
//     if (socket == null || quill == null) return

//     const interval = setInterval(() => {
//       socket.emit("save-document", quill.getContents())
//     }, SAVE_INTERVAL_MS)

//     return () => {
//       clearInterval(interval)
//     }
//   }, [socket, quill])

//   useEffect(() => {
//     if (socket == null || quill == null) return

//     const handler = delta => {
//       quill.updateContents(delta)
//     }
//     socket.on("receive-changes", handler)

//     return () => {
//       socket.off("receive-changes", handler)
//     }
//   }, [socket, quill])

//   useEffect(() => {
//     if (socket == null || quill == null) return

//     const handler = (delta, oldDelta, source) => {
//       if (source !== "user") return
//       socket.emit("send-changes", delta)
//     }
//     quill.on("text-change", handler)

//     return () => {
//       quill.off("text-change", handler)
//     }
//   }, [socket, quill])

//   const wrapperRef = useCallback(wrapper => {
//     if (wrapper == null) return

//     wrapper.innerHTML = ""
//     const editor = document.createElement("div")
//     wrapper.append(editor)
//     const q = new Quill(editor, {
//       theme: "snow",
//       modules: { toolbar: TOOLBAR_OPTIONS },
//     })
//     q.disable()
//     q.setText("Loading...")
//     setQuill(q)
//   }, [])
//   return <div className="container" ref={wrapperRef}></div>
// }