export interface User {
  email: string;
  password: string;
  type?: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface LoginFormProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  errors: { [key: string]: string };
  loading: boolean;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  type: string | null;
}

export interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export interface ErrorAlertProps {
  message: string;
}

export interface SubmitButtonProps {
  loading: boolean;
  text?: string;
  loadingText?: string;
}