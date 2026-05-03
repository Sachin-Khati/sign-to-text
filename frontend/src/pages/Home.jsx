import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="md:w-1/2">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Bridging Communication with <span className="text-yellow-300">AI</span>
            </h1>
            <p className="text-lg mb-6">
              Our AI-powered sign language detector helps break barriers and make
              communication more inclusive. Learn, detect, and practice sign
              language with ease.
            </p>
            <div className="flex gap-4">
              <Link
                to="/detect"
                className="bg-pink-400 text-white font-semibold px-6 py-3 rounded-xl hover:bg-pink-300 transition"
              >
                Try Detector
              </Link>
              <Link
                to="/learn"
                className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Learn Signs
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/homee.png"
              alt="Sign Language Illustration"
              className="w-104 drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Card 1 */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <img
              src="/aii.png"
              alt="AI Detection"
              className="w-full h-40 mx-auto mb-6"
            />
            <h3 className="text-xl font-semibold mb-3 text-purple-600">AI-Powered Detection</h3>
            <p className="text-gray-600">
              Instantly detect and recognize sign language gestures using
              real-time AI models.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <img
              src="/learningg.png"
              alt="Learning"
              className="w-full h-40 mx-auto mb-6"
            />
            <h3 className="text-xl font-semibold mb-3 text-purple-600">Interactive Learning</h3>
            <p className="text-gray-600">
              Practice with sign images, take quizzes, and improve your
              understanding step by step.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition">
            <img
              src="/comunicationn.png"
              alt="Inclusive"
              className="w-full h-40 mx-auto mb-6"
            />
            <h3 className="text-xl font-semibold mb-3 text-purple-600">Inclusive Communication</h3>
            <p className="text-gray-600">
              Breaking barriers between the deaf community and society through
              technology.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-14 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Learning Today!</h2>
        <p className="text-lg mb-6">
          Explore our sign language resources and make communication inclusive.
        </p>
        <Link
          to="/learn"
          className="bg-pink-400 text-white px-6 py-3 font-semibold rounded-xl hover:bg-pink-300 transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
