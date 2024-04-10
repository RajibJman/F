import logo from './logo.svg';
import { BrowserRouter,Routes, Route, BrowserRouter as Router, Outlet, Navigate } from 'react-router-dom';
import './App.css';

import Login from './page/Login';
import RegistrationPage from './component/registration';
// import PasswordResetForm from './page/passReset';
// import Axlldata from './component/Alldata';
import Dashboard from './page/Admin/Dashboard';
import AddModule from './component/AddModule';
// import Navbar from './component/NAvbar';
import AddUserModule from './component/AddUserModule';
// import PasswordResetForm from './passReset';
import AddQuizForm from './page/Admin/addquiz';
import UserList from './page/Admin/UserCRUD';
import ModuleList from './page/Admin/ModuleCRUD';
import UserDashboard from './page/User/UserDashboard';
// import UserModule from './page/UserModule';
import ModuleStatus from './page/Admin/ModuleStatus';
import QuizModule from './component/QuizModule';
import AllModule from './page/Admin/AllModule';
import QuizPage from './page/User/quiz';
import PasswordResetForm from './page/passReset';
import ForgotPassword from './page/ForgotPassword';
import AddModuleTrainer from './component/AddModuleTrainer';
import Profile from './page/User/Profile';
import ModulePerformance from './page/Admin/ModulePerformance';
import MarksAndModules from './page/User/UserResult';
import Navbar from './component/Navbar';







const AdminProtectedRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';
  return isAdmin && localStorage.getItem('token') !== null ? children : <Navigate to="/" replace />;
};

const UserProtectedRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  const isUser = role === 'Intern' || role === 'Employee';;
  return isUser && localStorage.getItem('token') !== null ? children : <Navigate to="/" replace />;
};



function App() {
  return (
    <BrowserRouter>
    {/* <NAvbar></NAvbar> */}
    <Routes>
      
        <Route path="/" element={<Login/>}/>
        
        <Route path="/register" element={<AdminProtectedRoute><RegistrationPage/></AdminProtectedRoute>}/>
        <Route path="/passReset" element={<PasswordResetForm/>}/>
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/dashboard" element={<AdminProtectedRoute><Dashboard/></AdminProtectedRoute>}/>
        <Route path="/userdashboard" element={<UserProtectedRoute><UserDashboard/></UserProtectedRoute>}/>
        {/* <Route path="/navbar" element={<Navbar/>}/> */}
        <Route path="/addmodule" element={<AdminProtectedRoute><AddModule/></AdminProtectedRoute>}/>
        <Route path="/addusermodule" element={<AdminProtectedRoute><AddUserModule/></AdminProtectedRoute>}/>
        <Route path="/addmoduletrainer" element={<AdminProtectedRoute><AddModuleTrainer/></AdminProtectedRoute>}/>
        <Route path="/addquiz" element={<AdminProtectedRoute><AddQuizForm/></AdminProtectedRoute>}/>
        <Route path="/user" element={<AdminProtectedRoute><UserList/></AdminProtectedRoute>}/>
        <Route path="/module" element={<AdminProtectedRoute><ModuleList/></AdminProtectedRoute>}/>
        {/* <Route path="/usermodule" element={<AdminProtectedRoute><UserModule/></AdminProtectedRoute>}/> */}
        <Route path="/modulestatus" element={<ModuleStatus/>}/>
        {/* <Route path="/quizmodule" element={<QuizModule/>}/> */}
        <Route path="/assesment" element={<AllModule/>}/>
        <Route path="/quiz" element={<QuizPage/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/performance" element={<AdminProtectedRoute><ModulePerformance/></AdminProtectedRoute>}/>
        <Route path="/userresult" element={<MarksAndModules/>}/>

    </Routes>
    </BrowserRouter>

  );
}

export default App;
