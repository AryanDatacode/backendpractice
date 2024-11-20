import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, UserPlus, Users } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [averageAge, setAverageAge] = useState(0);
  const [youngest, setYoungest] = useState([]);
  const [aboveAverage, setAboveAverage] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", age: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  const fetchAverageAge = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/averageAge"
      );
      console.log("average age is: ", response.data[0].avgAge);
      setAverageAge(response.data[0]?.avgAge || 0);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchYoungest = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/youngestUsers"
      );
      console.log("youngeest users: ", response.data);
      setYoungest(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchAboveAverage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/aboveAverageAgeUsers"
      );
      console.log("Above average users: ", response.data);
      setAboveAverage(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users", formData);
      setFormData({ name: "", email: "", age: "" });
      await fetchUsers();
      await fetchAverageAge();
      setError(null);
    } catch (err) {
      setError("Failed to add user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchAverageAge(),
        fetchAboveAverage(),
        fetchYoungest(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 w-screen ">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
          User Management
        </h1>

        <form onSubmit={addUser} className="mb-8 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            Add New User
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              required
              className="w-full p-2 border border-gray-300 rounded text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out flex items-center"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add User
          </button>
        </form>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">
            Average Age
          </h2>
          <p className="text-4xl font-bold text-blue-500">
            {averageAge.toFixed(2)}
          </p>
        </div>

        <div className="overflow-x-auto text-black">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Age</th>
              </tr>
            </thead>
            <tbody>
              
          <h2 className="text-2xl font-semibold my-3 text-gray-700">
            Users: 
          </h2>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.age}</td>
                </tr>
              ))}

              <hr />
          <h2 className="text-2xl font-semibold my-3 text-gray-700">
            Youngest Users:
          </h2>
              {youngest.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.age}</td>
                </tr>
              ))}

              <hr />

          <h2 className="text-2xl font-semibold my-3 text-gray-700">
            Above Average Users: 
          </h2>
              {aboveAverage.length > 0 ? (
                aboveAverage.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2">{user.age}</td>
                  </tr>
                ))
              ) : (
                <p> No such users exists</p>
              )}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}
