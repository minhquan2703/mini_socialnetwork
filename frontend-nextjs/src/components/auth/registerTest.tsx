"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { GoogleIcon } from "@/library/CustomMUI/CustomIcons";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { postAuthRegister } from "@/services/auth.service";
import { IRegister } from "@/types/auth.type";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    minHeight: "550px",
    width: "100%",
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    height: "auto",
    margin: "10px auto",
    border: "1px solid black",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
    },
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    ...theme.applyStyles("dark", {
        boxShadow:
            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
    minHeight: "100%",
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4),
    },
    "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        zIndex: -1,
        inset: 0,
        backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
        ...theme.applyStyles("dark", {
            backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
        }),
    },
}));

const CustomButton = styled(Button)({
    textTransform: "none",
    borderRadius: "7px",
    background: "black",
    color: "white",
    "&:hover": {
        background: "#333333",
    },
});

const Register2 = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<IRegister>({
        defaultValues: {
            name: "",
            email: "",
            username: "",
            password: "",
            confirmPassword: ""
        },
        mode: "onBlur"
    });

    const watchPassword = watch("password");
    const onSubmit = async(data: IRegister) => {
        clearErrors()
        const res = await postAuthRegister(data)
        if(res.error && res?.message){
            if (res.message.includes('Email')){
                setError("email", { type: "server", message: res.message })
            }
            if (res.message.includes('Tên tài khoản')){
                setError("username", { type: "server", message: res.message })
            }
        }
    }

    const validationRules = {
        email: {
            required: "Vui lòng điền địa chỉ email",
            pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Địa chỉ email không hợp lệ"
            }
        },
        username: {
            required: "Vui lòng điền tên tài khoản",
            minLength: {
                value: 3,
                message: "Tên tài khoản phải có ít nhất 3 ký tự"
            }
        },
        password: {
            required: "Vui lòng điền mật khẩu",
            minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự"
            }
        },
        confirmPassword: {
            required: "Vui lòng điền mật khẩu",
            validate: (value: string) =>
                value ===  watchPassword|| "Mật khẩu không khớp"
        }
    };

    return (
        <>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            width: "100%",
                            fontSize: "23px",
                            fontFamily: "inherit",
                            fontWeight: "600",
                        }}
                    >
                        Đăng ký tài khoản
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: 2,
                        }}
                    >
                        {/*name*/}
                        <FormControl>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        size="small"
                                        type="text"
                                        placeholder="Họ và tên"
                                        variant="outlined"
                                    />
                                )}
                            />
                        </FormControl>

                        {/*email*/}
                        <FormControl>
                            <Controller
                                name="email"
                                control={control}
                                rules={validationRules.email}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        size="small"
                                        type="email"
                                        placeholder="Địa chỉ email *"
                                        autoFocus
                                        required
                                        variant="outlined"
                                    />
                                )}
                            />
                        </FormControl>

                        {/*username*/}
                        <FormControl>
                            <Controller
                                name="username"
                                control={control}
                                rules={validationRules.username}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={!!errors.username}
                                        helperText={errors.username?.message}
                                        size="small"
                                        placeholder="Tên đăng nhập *"
                                        required
                                        variant="outlined"
                                    />
                                )}
                            />
                        </FormControl>

                        {/* password*/}
                        <FormControl>
                            <Controller
                                name="password"
                                control={control}
                                rules={validationRules.password}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        size="small"
                                        placeholder="Mật khẩu *"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip
                                                        placement="right"
                                                        title={
                                                            showPassword
                                                                ? "Ẩn mật khẩu"
                                                                : "Hiện mật khẩu"
                                                        }
                                                    >
                                                        <IconButton
                                                            onClick={() =>
                                                                setShowPassword(!showPassword)
                                                            }
                                                            edge="end"
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOffIcon />
                                                            ) : (
                                                                <VisibilityIcon />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </FormControl>

                        {/* confirm password*/}
                        <FormControl>
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={validationRules.confirmPassword}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        size="small"
                                        placeholder="Nhập lại mật khẩu *"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Tooltip
                                                        placement="right"
                                                        title={
                                                            showConfirmPassword
                                                                ? "Ẩn mật khẩu"
                                                                : "Hiện mật khẩu"
                                                        }
                                                    >
                                                        <IconButton
                                                            onClick={() =>
                                                                setShowConfirmPassword(
                                                                    !showConfirmPassword
                                                                )
                                                            }
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? (
                                                                <VisibilityOffIcon />
                                                            ) : (
                                                                <VisibilityIcon />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </FormControl>

                        <CustomButton
                            type="submit"
                            disabled={isSubmitting}
                            fullWidth
                            variant="contained"
                            sx={{
                                fontWeight: 600,
                                padding: "8px",
                                fontSize: "13px",
                            }}
                        >
                            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                        </CustomButton>
                    </Box>
                    
                    <Divider sx={{ fontSize: "10px", color: "grey" }}>
                        HOẶC
                    </Divider>
                    
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <CustomButton
                            fullWidth
                            variant="outlined"
                            onClick={() => alert("Sign in with Google")}
                            startIcon={<GoogleIcon />}
                            sx={{
                                fontWeight: 600,
                                padding: "8px",
                                fontSize: "13px",
                            }}
                        >
                            Google
                        </CustomButton>
                        <Typography sx={{ textAlign: "center" }}>
                            Bạn đã có tài khoản?{" "}
                            <Link
                                href="/auth"
                                variant="body2"
                                sx={{ alignSelf: "center", fontSize: "15px" }}
                            >
                                Đăng Nhập
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </>
    );
};

export default Register2;