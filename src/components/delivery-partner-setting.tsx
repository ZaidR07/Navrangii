import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import DeliveryPartnerForm from "./form-components/delivery-partner-form";
import DeliveryPartnerList from "./delivery-partner-list";

export default function DeliveryPartner({ value }: { value: string }) {
  const [tab, setTab] = useState<"form" | "list">("form");
  const [editDeliveryPartnerId, setEditDeliveryPartnerId] = useState<string | null>(null);

  return (
    <TabsContent value={value} className="space-y-6">
      <Tabs value={tab} onValueChange={(value) => setTab(value as "form" | "list")} className="w-full">
        <TabsList className="mb-6 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 gap-2">
          <TabsTrigger
            value="form"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            {editDeliveryPartnerId ? "Edit Delivery Partner" : "Add New Delivery Partner"}
          </TabsTrigger>
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            List Delivery Partners
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <DeliveryPartnerForm
            deliverypartnerId={editDeliveryPartnerId!} // ✅ fixed camelCase prop name
            onDone={() => {
              setEditDeliveryPartnerId(null);
              setTab("list");
            }}
          />
        </TabsContent>

        <TabsContent value="list">
          <DeliveryPartnerList
            onEditDeliveryPartner={(id: string) => {
              setEditDeliveryPartnerId(id);
              setTab("form");
            }}
          />
        </TabsContent>
      </Tabs>
    </TabsContent>
  );
}
