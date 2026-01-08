import { AuthForm } from "@/components/auth-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <AuthForm mode="register" />
    </div>
  )
}
