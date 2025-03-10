const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-purple-500 text-white">
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Ace Your Next Interview with Confidence</h1>
        <p className="text-lg mb-6">AI-powered mock interviews and resume analysis tailored just for you.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-purple-800 px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:bg-gray-100">
            Get Started
          </button>
          <button className="bg-purple-900 px-6 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:bg-purple-950">
            Learn More
          </button>
        </div>
      </section>

      <section className="py-16 px-8 grid gap-8 grid-cols-1 md:grid-cols-3">
        <div className="bg-white text-purple-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">AI Mock Interviews</h3>
          <p>Get real-time interview questions and feedback based on your resume.</p>
        </div>
        <div className="bg-white text-purple-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">Resume Analysis</h3>
          <p>Let our ATS-powered system analyze and optimize your resume.</p>
        </div>
        <div className="bg-white text-purple-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-2">Performance Metrics</h3>
          <p>Track your progress and improve with detailed insights.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
