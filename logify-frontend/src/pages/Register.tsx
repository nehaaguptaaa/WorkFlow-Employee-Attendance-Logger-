import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Building2, Eye, EyeOff } from "lucide-react";
import { registerUser } from "../api/authApi";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("IT");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const validate = () => {
    const newErrors: FormErrors = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (trimmedName.length > 30) {
      newErrors.name = "Name must be under 100 characters";
    } else if (!/[A-Za-z]/.test(trimmedName)) {
      newErrors.name = "Name must contain at least one letter";
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (trimmedEmail.length > 30) {
      newErrors.email = "Email must be under 254 characters";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "8-20 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character, no spaces";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);
    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        department,
      });
      navigate("/login");
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-800">Logify</h1>
          <p className="text-slate-500 mt-1 text-sm">Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-sm border border-slate-200"
        >
          <h2 className="text-xl font-semibold mb-1 text-slate-800">Get started</h2>
          <p className="text-slate-500 mb-6 text-sm">Register as an employee</p>

          {serverError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
              {serverError}
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Neha Gupta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className={`w-full border pl-10 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 transition text-sm ${
                  errors.name ? "border-red-300" : "border-slate-300"
                }`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={254}
                className={`w-full border pl-10 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 transition text-sm ${
                  errors.email ? "border-red-300" : "border-slate-300"
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={20}
                className={`w-full border pl-10 pr-10 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 transition text-sm ${
                  errors.password ? "border-red-300" : "border-slate-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password ? (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">
                8-20 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={20}
                className={`w-full border pl-10 pr-10 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 transition text-sm ${
                  errors.confirmPassword ? "border-red-300" : "border-slate-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Department */}
          <div className="mb-6">
            <label className="text-sm font-medium text-slate-700 mb-1 block">Department</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-slate-300 pl-10 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 transition appearance-none bg-white text-sm"
              >
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="FINANCE">Finance</option>
                <option value="SALES">Sales</option>
                <option value="MARKETING">Marketing</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-medium hover:bg-slate-900 active:scale-[0.98] transition disabled:opacity-60 text-sm"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-slate-800 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;