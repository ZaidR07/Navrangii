"use client"

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";


interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border-white dark:from-slate-800">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-white text-slate-800 focus-visible:ring-purple-700 dark:text-black"
              />
            </div>
 
          </div>
        </div>
      </CardContent>
    </Card>
  );
};