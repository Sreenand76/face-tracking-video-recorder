import FaceDetectionRecorder from "@/components/FaceDetectionRecorder";
import NavBar from "@/components/NavBar";
import { ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {

  return (    
   <div>   
    <ToastContainer/>
    <NavBar/>
    <FaceDetectionRecorder/>
   </div>
  );
}
