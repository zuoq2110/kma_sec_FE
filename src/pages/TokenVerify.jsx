import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/kSecurityService';
import { isTokenExpired } from '../utils/jwtService';
import { Toast } from 'primereact/toast';
import { DataContext } from '../context/dataContext';

const TokenVerify = () => {
    const navigate = useNavigate();
    const toast = useRef(null);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            console.log(token);

            try {
                if (token) {
                    const response = await fetch(`${BASE_URL}/api/v1/user/verify-token/${token}`, { method: "GET" });
                    console.log(response);
                    if (!response.ok) {
                        throw new Error("Token verification failed!");
                    }
                }
                if (!token) {
                    return;
                }
                if (!isTokenExpired(token)) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('userData')
                    localStorage.removeItem('isAdmin')
                    localStorage.removeItem('id')

                    navigate("/login")
                    toast.current.show({
                        severity: "error",
                        summary: "Failure",
                        detail: "Token is expired! Please login again.",
                    });
                    return;
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('dataUser');
            }
        };

        verifyToken();
    }, [navigate]); // Thêm navigate vào dependency array

    return (
        <Toast ref={toast}></Toast>

    ); // Không cần render gì cả
}

export default TokenVerify;
