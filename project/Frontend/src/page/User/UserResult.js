import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import Navbar from '../../component/Navbar';


function MarksAndModules() {
    const [moduleData, setModuleData] = useState([]);
    const [marksData, setMarksData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to fetch data from API
        const fetchData = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                return data;
            } catch (error) {
                setError(error.message);
            }
        };

        // Function to get user ID from local storage
        const getUserIdFromLocalStorage = () => {
            return localStorage.getItem('userId');
        };

        // Fetch data
        const userId = getUserIdFromLocalStorage();
        const marksUrl = `http://localhost:3000/api/auth/marks/user/${userId}`;
        const modulesUrl = 'http://localhost:3000/api/auth/modules';

        Promise.all([fetchData(marksUrl), fetchData(modulesUrl)])
            .then(([marksData, moduleData]) => {
                setMarksData(marksData);
                setModuleData(moduleData.modules);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);
            });

    }, []);

    // Display component
    return (
        <div>
            <Navbar></Navbar>
            <div style={{ textAlign: 'center', color: 'orange', marginTop: '20px' }}>
                <h1>RESULTS</h1>
            </div>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!isLoading && !error && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead style={{ backgroundColor: '#5AAA66' }}>
                            <TableRow>
                                <TableCell style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white' }}>Module</TableCell>
                                <TableCell style={{ fontSize: '1.2em', fontWeight: 'bold', color: 'white' }}>Marks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {marksData.map((mark, index) => {
                                const module = moduleData.find(module => module._id === mark.moduleId);
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{module ? <strong>{module.moduleName} </strong>: "Module Not Found"}</TableCell>
                                        <TableCell>{<strong>{mark.marks}</strong>}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}

export default MarksAndModules;
