const ThankYou = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center items-center p-6">
      <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
      <p className="text-lg mb-6 text-gray-300">
        Your response has been recorded. We appreciate your time and effort!
      </p>

      <a
        href="/"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
      >
        Go Back to Home
      </a>
    </div>
  );
};

export default ThankYou;
