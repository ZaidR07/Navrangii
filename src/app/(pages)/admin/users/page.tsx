"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useGetVisitors } from "@/hooks/users/useGetVisitors";
import { toast } from "react-toastify";
import LoaderSpinner from "@/components/loader-spinner";
import { Search, UserCheck, Mail, Phone, Calendar, Users } from "lucide-react";

interface Visitor {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  createdAt?: string;
  lastLogin?: string;
  isActive?: boolean;
}

export default function UsersPage() {
  const { data, isLoading, isError } = useGetVisitors();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const visitors: Visitor[] = data || [];
  const search = debouncedSearchTerm.toLowerCase();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load users. Please try again later.");
    }
  }, [isError]);

  const filteredVisitors = visitors.filter((user) => {
    if (!search) return true;
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone?.toString().includes(search)
    );
  });

  if (isLoading) return <LoaderSpinner message="Loading users..." />;

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Users
        </h1>
        <p className="text-sm bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Registered users who haven&apos;t placed any orders yet
        </p>
      </header>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-800"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Total Users</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{visitors.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Active Users</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {visitors.filter((v) => v.isActive !== false).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">New This Month</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {visitors.filter((v) => {
                  if (!v.createdAt) return false;
                  const d = new Date(v.createdAt);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredVisitors.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-gray-300 dark:text-slate-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {visitors.length === 0 ? "No users found" : "No users match your search"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            {visitors.length === 0
              ? "Users who visit the website but haven't placed orders will appear here"
              : "Try adjusting your search terms"}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700/50">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-700">
                            {visitor.name?.charAt(0)?.toUpperCase() || visitor.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {visitor.name || "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-400">
                        <Mail className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
                        {visitor.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400">
                      {visitor.phone ? (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
                          {visitor.phone}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400">
                      {visitor.createdAt
                        ? (() => {
                            const date = new Date(visitor.createdAt);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-400">
                      {visitor.lastLogin
                        ? (() => {
                            const date = new Date(visitor.lastLogin);
                            const day = date.getDate().toString().padStart(2, '0');
                            const month = (date.getMonth() + 1).toString().padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          visitor.isActive !== false
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-200"
                        }`}
                      >
                        {visitor.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
