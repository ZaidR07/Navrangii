"use client";

import { useState } from "react";
import {
  Edit,
  Trash2,
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Building,
  CheckCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DeliveryPartners } from "@/lib/types/orderType";
import PageLoading from "./page-loading";
import PageError from "./page-error";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import { useGetDeliveryPartners } from "@/hooks/delivery-partner/useGetDeliveryPartner";
import { useDeleteDeliveryPartner } from "@/hooks/delivery-partner/useDeleteDeliveryPartner";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-gradient-to-r from-green-400 to-green-500 text-white border-0";
    case "inactive":
      return "bg-gradient-to-r from-red-400 to-red-500 text-white border-0";
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0";
  }
};

export default function DeliveryPartnerList({
  onEditDeliveryPartner,
}: {
  onEditDeliveryPartner: (id: string) => void;
}) {
  const { data, isLoading, isError } = useGetDeliveryPartners();
  const [deliveryPartnerToDelete, setDeliveryPartnerToDelete] = useState<DeliveryPartners | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounced] = useDebounce(searchTerm.trim(), 500);
  const isDebouncing = searchTerm.trim() !== debounced;

  const filteredData =
    data?.filter((partner) => {
      if (!debounced) return true;
      const searchLower = debounced.toLowerCase();
      return (
        partner.name.toLowerCase().includes(searchLower) ||
        partner.email.toLowerCase().includes(searchLower) ||
        partner.city.toLowerCase().includes(searchLower) ||
        partner.phone.toLowerCase().includes(searchLower) ||
        partner.state.toLowerCase().includes(searchLower)
      );
    }) || [];

  const { mutate: deleteDeliveryPartner, isPending: isDeleting } = useDeleteDeliveryPartner();

  const handleDeleteDeliveryPartner = (id: string) => {
    deleteDeliveryPartner(id, {
      onSuccess: () => {
        toast.success("Delivery Partner deleted successfully");
        setDeliveryPartnerToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete Delivery Partner");
      },
    });
  };

  if (isLoading || isDeleting) return <PageLoading />;
  if (isError) return <PageError />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/20 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
          Delivery Partner Management
        </h1>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Manage and monitor all your delivery partners
        </p>
        <Card className="mt-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search Delivery Partners by name, email, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white/80 border-purple-200 focus:border-purple-400 focus:ring-purple-400 text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {isDebouncing ? (
        <PageLoading />
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl pt-0">
          <CardHeader className="pt-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              Delivery Partner Directory
              {data && (
                <Badge className="ml-auto bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-0">
                  {searchTerm ? `${filteredData.length} of ${data.length}` : `${data.length} Total`}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-slate-50 to-purple-50/30">
                  <TableHead>Delivery Partner</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((partner) => (
                  <TableRow key={partner._id ?? partner.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {partner.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{partner.name}</div>
                          <div className="text-sm text-slate-500">ID: {partner._id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-purple-500" />
                          {partner.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-indigo-500" />
                          {partner.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <div>
                          <div className="font-medium text-slate-800">{partner.city}</div>
                          <div className="text-sm text-slate-500">{partner.state}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-orange-500" />
                        <div className="font-semibold text-slate-800 bg-orange-100 px-3 py-1 rounded-full text-sm">
                          {partner.capacity} orders
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(partner.status)}>
                        <div className="flex items-center gap-1">
                          {partner.status === "active" ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 shadow-lg rounded-lg ">
                            <DropdownMenuItem onClick={() => onEditDeliveryPartner(partner._id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeliveryPartnerToDelete(partner)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Delivery Partners Found</h3>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deliveryPartnerToDelete} onOpenChange={() => setDeliveryPartnerToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{deliveryPartnerToDelete?.name}</span>? This action is permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() =>
                deliveryPartnerToDelete && handleDeleteDeliveryPartner(deliveryPartnerToDelete._id)
              }
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white bg-red-600 border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </div>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Delivery Partner
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
