"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetAllUsers } from "@/hooks/users/useGetAllUser";
import type { ExtendedUser } from "@/lib/types/userType";
import PageLoading from "@/components/page-loading";
import PageError from "@/components/page-error";
import { Filters } from "@/components/customer-filter";
import { CustomersTable } from "@/components/customers-table";
import {
  getUserLastOrder,
  getUserOrders,
  getUserTotalOrders,
  getUserTotalSpent,
} from "@/helper/customerStats";

export default function CustomersPage() {
  const { data, isLoading, isError } = useGetAllUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const isDebouncing = searchTerm.trim() !== debouncedSearchTerm.trim();
  const users: ExtendedUser[] = data || [];
  const search = debouncedSearchTerm.toLowerCase();

  const filteredUsers = users.filter((user) => {
    const isNotAdmin = user.isAdmin === false;
    if (!search) return isNotAdmin;
    const matchesSearch =
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone?.toString().includes(search);
    return matchesSearch && isNotAdmin;
  });

  if (isLoading) return <PageLoading />;
  if (isError) return <PageError />;

  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Customer Management
        </h1>
        <p className="text-sm bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Manage customer accounts and view order history
        </p>
      </header>

      <Filters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <CustomersTable
        filteredUsers={filteredUsers}
        getUserLastOrder={getUserLastOrder}
        getUserOrders={getUserOrders}
        getUserTotalOrders={getUserTotalOrders}
        getUserTotalSpent={getUserTotalSpent}
        isDebouncing={isDebouncing}
      />
    </div>
  );
}
