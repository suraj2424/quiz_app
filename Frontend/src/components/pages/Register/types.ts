export interface User {
  full_name: string;
  email: string;
  password: string;
  type: string;
}

export interface FormErrors {
  full_name?: string;
  email?: string;
  password?: string;
  default?: string;
}

export interface ApiResponse {
  message: string;
}

export interface TextInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}

export interface RegisterFormProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  errors: FormErrors;
  loading: boolean;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  type: string;
}
