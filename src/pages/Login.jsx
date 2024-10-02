import React, { useContext, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from 'primereact/button';
import { Password } from "primereact/password";
import { LayoutContext } from "../context/layoutContext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { DataContext } from "../context/dataContext";
import { dataAccount } from "../utils/dataMenu";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";
import { BASE_URL } from "../services/kSecurityService";

const schema = yup.object({
  username: yup.string().required("This field is required"),
  password: yup
    .string()
    .required("This field is required")
    .matches(
      /^(?=.*[!@#$%^&*()-=_+[\]{}|;':",.<>/?]).+$/,
      "Password should be 8 chars minimum and at least 1 special character"
    ),
});

const LoginPage = () => {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const { layoutConfig } = useContext(LayoutContext);
  const { login } = useContext(DataContext);

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

  const onHandleSubmit = async (data) => {
    const { username, password } = data

    try {
      const formData = new URLSearchParams()
      formData.append("username", username)
      formData.append("password", password)

      const url = new URL(`${BASE_URL}/api/v1/user/token`);
      const response = await fetch(url,
        {
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
          body: formData
        }
      )
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('id', data.id)
        localStorage.setItem('isAdmin', data.isAdmin)
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Successfully! Return login page after 3s",
        });
        if (data.isAdmin === true) {
          login(username, password);
          navigate("/");
        }
        if (data.isAdmin !== true) {
          login(username, password);
          navigate("/");
        }
         else {
          navigate("/");
        }
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

    authentication(username, password);
    reset({
      username: "",
      password: "",
    });
  };

  const show = () => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Login failed",
    });
  };

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );

  const authentication = (email, password) => {
    if (
      email === dataAccount.dataUsername &&
      password === dataAccount.dataPassword
    ) {
      login(email, password);
      navigate("/");
    } else {
      show();
    }
  };
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
                Sign in
              </div>
            </div>

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
                {errors.username?.message}
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

              <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                  <Checkbox
                    inputid="rememberme1"
                    checked={checked}
                    onChange={(e) => setChecked(e.checked)}
                    className="mr-2"
                  ></Checkbox>
                  <label htmlFor="rememberme1">Remember me</label>
                </div>
                <div >
                  <label>
                    Bạn chưa có tài khoản? <Link to={"/register"} className="font-medium">
                      Đăng ký
                    </Link>
                  </label>
                </div>

              </div>

              <Button type="submit" label="Sign In" />
              <Link
                className="font-medium no-underline ml-2 text-right cursor-pointer"
                style={{ color: "var(--primary-color)" }}
              >
                Forgot password?
              </Link>
            </form>

          </div>
        </div>
      </div>
    </div >
  );
};

export default LoginPage;
