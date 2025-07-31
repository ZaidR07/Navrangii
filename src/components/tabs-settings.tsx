"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import VariablesSetting from "./variables-setting";
import DeliveryPartner from "./delivery-partner-setting";


export default function TabsSettings() {
  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Product Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
              Manage your product variables and Delivery Partners here.
            </p>
          </div>
        </div>
      </div>

      <Card className="shadow-xl pt-0 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 border-b border-purple-200/30 dark:border-purple-700/30 pt-4">
          <CardTitle className="text-2xl text-slate-800 dark:text-slate-200">
            Settings Management
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Add and organize your product variables and delivery partners here.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          {/* Outer Tabs */}
          <Tabs defaultValue="variables" className="w-full">
            <TabsList className="mb-6 p-1 w-full rounded-xl bg-slate-100 dark:bg-slate-800 flex justify-start gap-2">
              <TabsTrigger
                value="variables"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600
                 data-[state=active]:text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
                Variables
              </TabsTrigger>

              <TabsTrigger
                value="deliveryPartner"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600
                 data-[state=active]:text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
              Delivery Partner
              </TabsTrigger>
             
            </TabsList>

            {/* Variables Tab Content */}
           <VariablesSetting value="variables" />

            {/* Delivery Partner Tab Content */}
           <DeliveryPartner value="deliveryPartner" />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
