import React from 'react';
import { FiUsers, FiTarget, FiAward, FiHeart } from 'react-icons/fi';

const About = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About JobBoard</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          We're on a mission to connect talented professionals with amazing companies,
          making the job search process simple and effective for everyone.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">100K+ Users</h3>
            <p className="text-gray-600">Trust our platform</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTarget className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">95% Match Rate</h3>
            <p className="text-gray-600">Find your perfect job</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">5K+ Companies</h3>
            <p className="text-gray-600">Partner with us</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-3xl text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">98% Satisfaction</h3>
            <p className="text-gray-600">Happy users</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2024, JobBoard was created with a simple vision: to make the
            job search process easier, more transparent, and more effective for both
            job seekers and employers.
          </p>
          <p className="text-gray-600">
            Today, we're proud to connect thousands of professionals with their dream
            jobs and help companies build amazing teams.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;