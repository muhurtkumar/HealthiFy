import { Link } from "react-router-dom";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12 px-4 md:py-16 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Text Content */}
          <div className="md:w-1/2 text-center md:text-left space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Your Health, <span className="text-yellow-300">Our Priority!</span>
            </h1>
            <p className="text-sm sm:text-lg opacity-90">
              Book appointments with top doctors anytime, anywhere.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <Link
                to="/doctors"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition text-center"
              >
                Find a Doctor
              </Link>
              <Link
                to="/consult"
                className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition text-center"
              >
                Consult Online
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/hero.png"
              alt="Doctor Consultation"
              className="w-4/5 sm:w-3/4 max-w-sm drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 md:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Why Choose <span className="text-blue-600">HealthiFy?</span>
        </h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-lg">
          We provide the best healthcare services with seamless access.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "👩‍⚕️", text: "1000+ Verified Doctors" },
            { icon: "📅", text: "Instant Appointments" },
            { icon: "📹", text: "Video Consultations" },
            { icon: "💊", text: "E-Prescriptions" }
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-lg rounded-lg transform hover:scale-105 transition"
            >
              <span className="text-4xl sm:text-5xl">{item.icon}</span>
              <p className="mt-3 font-semibold text-gray-800 text-sm sm:text-lg">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Find by Speciality Section */}
      <section className="py-8 px-6 text-center">
        <h2 className="text-3xl font-bold">
          Find by <span className="text-blue-600">Speciality</span>
        </h2>
        <p className="mt-2 text-gray-600">
          Choose the right doctor based on your medical needs.
        </p>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "❤️", name: "Cardiologist" },
            { icon: "🩺", name: "General Physician" },
            { icon: "🦴", name: "Orthopedic" },
            { icon: "🧠", name: "Neurologist" },
            { icon: "👶", name: "Pediatrician" },
            { icon: "🩹", name: "Dermatologist" },
            { icon: "🦷", name: "Dentist" },
            { icon: "👁️", name: "Ophthalmologist" }
          ].map((speciality, index) => (
            <Link
              key={index}
              to={`/doctors?speciality=${speciality.name.toLowerCase()}`}
              className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center space-y-3 transform hover:scale-105 transition"
            >
              <span className="text-5xl">{speciality.icon}</span>
              <p className="text-lg font-semibold text-gray-800">{speciality.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-blue-50 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">How It Works?</h2>
        <p className="mt-2 text-gray-600 text-sm sm:text-lg">Easy steps to connect with your doctor</p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-6">
          {[
            { icon: "🔍", text: "Search for a doctor" },
            { icon: "📅", text: "Choose an appointment" },
            { icon: "📞", text: "Consult via chat/video" },
            { icon: "💊", text: "Get prescriptions" }
          ].map((step, index) => (
            <div
              key={index}
              className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center space-y-3 transform hover:scale-105 transition"
            >
              <span className="text-4xl sm:text-5xl">{step.icon}</span>
              <p className="text-lg sm:text-xl font-semibold text-gray-800">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 text-center bg-blue-600 text-white">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to Consult a Doctor?</h2>
        <p className="mt-2 text-sm sm:text-lg opacity-90">Get the best medical advice at your convenience.</p>
        <Link
          to="/consult"
          className="mt-6 inline-block bg-yellow-400 text-blue-900 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
        >
          Start Consultation
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-gray-900 text-white">
        <p className="text-sm sm:text-base">© 2025 HealthiFy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
