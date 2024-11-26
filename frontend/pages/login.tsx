import Button from "@/components/ui/Button"

export default function Login() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        
        {/* Formulaire de connexion */}
        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <Button className="w-full">Login</Button>
        </form>

        {/* Lien vers la page d'inscription */}
        <p className="mt-4 text-center text-sm">
          Don't have an account? 
          <a href="/register" className="text-blue-500 hover:underline">Register</a>
        </p>
      </div>
    </main>
  )
}