export default function HomePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        Punjab Heritage - Test Page
      </h1>
      <div className="max-w-4xl mx-auto">
        <p className="text-lg text-gray-600 text-center mb-8">
          This is a minimal test page to check if the basic React components are working.
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ If you can see this message, the basic React rendering is working!
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-blue-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Test Card {item}</h3>
              <p className="text-gray-600">This is test content for card {item}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="text-yellow-800">
            <strong>Debug Info:</strong> This test page bypasses all complex components.
            If you see this, React is working. The issue is likely in a specific component.
          </p>
        </div>
      </div>
    </div>
  )
}
