import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React, { useContext, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { DataContext } from '../context/dataContext';
import { LayoutContext } from '../context/layoutContext';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL, createUser } from '../services/kSecurityService';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { dataAccount } from '../utils/dataMenu';

const schema = yup.object({
    username: yup.string().required("This field is required").min(6, "Username must be at least 6 characters long"),
    password: yup
        .string()
        .required("This field is required")
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
            "Password must be at least 8 characters and include letters and numbers."
        ),
    confirmPassword: yup
        .string()
        .required("This field is required")
        .oneOf([yup.ref('password')], "Passwords must match")
});
const Register = () => {
    const navigate = useNavigate();
    const { layoutConfig } = useContext(LayoutContext);
    const { login } = useContext(DataContext);
    const [errorUsername, setErrorUsername] = useState('')

    const toast = useRef(null);


    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const checkExistUsername = async (setErrorUsername, username) => {
        if (username.trim() === "") {
            return false;
        }
        if (username.trim().length < 6) {
            setErrorUsername("Tên đăng nhập phải chứa ít nhất 6 ký tự");
            return true;
        }
        const endpoint = BASE_URL + `/api/v1/user/existsByUsername?username=${username}`;
        console.log(endpoint);
        // Call api
        try {
            const response = await fetch(endpoint);
            const data = await response.text();

            if (data === "true") {
                setErrorUsername("Username đã tồn tại!");
                return true;
            }
            return false;
        } catch (error) {
            console.log("Lỗi api khi gọi hàm kiểm tra username");
        }
    };

    const onHandleSubmit = async (data) => {

        const { username, password } = data
        const isUsernameValid = !(await checkExistUsername(
            setErrorUsername,
            username
        ));
        console.log(errorUsername);
        console.log(isUsernameValid);
        if (isUsernameValid) {
            try {
                const url = new URL(`${BASE_URL}/api/v1/user/register`);
                const response = await fetch(url,
                    {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({
                            "username": username,
                            "password": password
                        }),
                    }
                )
                if (response.ok) {
                    setTimeout(() => {
                        navigate('/login'); // Hoặc navigate('/login') nếu sử dụng v6
                    }, 3000)
                    toast.current.show({
                        severity: "success",
                        summary: "Success",
                        detail: "Successfully! Return login page after 3s",
                    });

                } else {
                    toast.current.show({
                        severity: "error",
                        summary: "Failure",
                        detail: "error",
                    });
                }

                reset({
                    username: "",
                    password: "",
                    confirmPassword: ""
                });
            }
            catch (error) {
                console.log(error);

            }
        }else{
            toast.current.show({
                severity: "error",
                summary: "Failure",
                detail: "Username is exists!",
            });
        }

    };



    const containerClassName = classNames(
        "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
        { "p-input-filled": layoutConfig.inputStyle === "filled" }
    );


    return (

        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: "56px",
                        padding: "0.3rem",
                        background:
                            "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
                    }}
                >
                    <div
                        className="w-full surface-card py-7 px-5 sm:px-7"
                        style={{ borderRadius: "53px" }}
                    >

                        <div className="text-center mb-2">
                            <div className="text-900 text-3xl font-medium mb-3">
                                Sign up
                            </div>
                        </div>

                        <div>
                            <form
                                onSubmit={handleSubmit(onHandleSubmit)}
                                className="flex flex-column gap-2"
                            >
                                <label
                                    htmlFor="username"
                                    className="block text-900 text-xl font-medium mb-2"
                                >
                                    Username
                                </label>

                                <InputText
                                    inputid="username"
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    className="w-full md:w-26rem mb-2"
                                    style={{ padding: "1rem" }}
                                    {...register("username")}
                                />

                                <p style={{ color: "var(--red-500)" }}>
                                    {errorUsername}
                                </p>
                                <label
                                    htmlFor="password"
                                    className="block text-900 font-medium text-xl mb-2"
                                >
                                    Password
                                </label>

                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <Password
                                            toggleMask
                                            placeholder="Password"
                                            className="w-full mb-2"
                                            inputClassName="w-full p-3 md:w-26rem"
                                            feedback={false}
                                            {...field}
                                        />
                                    )}
                                />
                                <p
                                    style={{ color: "var(--red-500)" }}
                                    className="w-full md:w-26rem mb-2"
                                >
                                    {errors.password?.message}
                                </p>
                                <label
                                    htmlFor="confirm password"
                                    className="block text-900 font-medium text-xl mb-2"
                                >
                                    Confirm password
                                </label>

                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <Password
                                            toggleMask
                                            placeholder="Confirm password"
                                            className="w-full mb-2"
                                            inputClassName="w-full p-3 md:w-26rem"
                                            feedback={false}
                                            {...field}
                                        />
                                    )}
                                />
                                <p
                                    style={{ color: "var(--red-500)" }}
                                    className="w-full md:w-26rem mb-2"
                                >
                                    {errors.confirmPassword?.message}
                                </p>
                                <div className='flex justify-content-end mb-2'>
                                    <span>
                                        Bạn có tài khoản rồi? <Link className='font-medium' to={"/login"}>Đăng nhập</Link>
                                    </span>
                                </div>
                                <Button type="submit" label="Sign up" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Register;
