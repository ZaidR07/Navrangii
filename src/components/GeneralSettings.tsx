"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useGetGeneralSettings } from "@/hooks/GeneralSettings/useGetGeneralSettings";
import { useAddUpdateGeneralSettings } from "@/hooks/GeneralSettings/useAddUpdateGeneralSettings";

export default function GeneralSettings() {
  const { settings, isLoading } = useGetGeneralSettings();
  const { saveGeneralSettings, isSaving, saveError } = useAddUpdateGeneralSettings();

  const [generalItems, setGeneralItems] = useState<string[]>([""]);
  const [returnPeriod, setReturnPeriod] = useState<number | "">("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | "">("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");

  // Populate local state when settings load
  useEffect(() => {
    if (!settings) return;
    setGeneralItems((settings.newsAndOffers || []).map((i: any) => i?.title ?? ""));
    setReturnPeriod(settings.returnPeriod ?? "");
    setFreeShippingThreshold(settings.freeShippingThreshold ?? "");
    setPhoneNumber(settings.phoneNumber ?? "");
    setEmail(settings.email ?? "");
    setWhatsapp(settings.whatsapp ?? "");
  }, [settings]);

  const addGeneralItem = () => {
    setGeneralItems([...generalItems, ""]);
  };

  const removeGeneralItem = (index: number) => {
    if (generalItems.length > 1) {
      const newItems = [...generalItems];
      newItems.splice(index, 1);
      setGeneralItems(newItems);
    }
  };

  const updateGeneralItem = (index: number, value: string) => {
    const newItems = [...generalItems];
    newItems[index] = value;
    setGeneralItems(newItems);
  };

  const handleSave = () => {
    // Build payload expected by useAddUpdateGeneralSettings hook
    const payload = {
      newsAndOffers: generalItems
        .filter((t) => (t || "").trim().length > 0)
        .map((t, idx) => ({
          id: `${Date.now()}-${idx}`,
          title: t,
          description: "",
          type: "news" as const,
          isActive: true,
        })),
      returnPeriod: returnPeriod === "" ? null : returnPeriod,
      freeShippingThreshold: freeShippingThreshold === "" ? null : freeShippingThreshold,
      phoneNumber,
      email,
      whatsapp,
    };

    saveGeneralSettings(payload);
    toast.success("Saving general settings...");
  };

  const handleReset = () => {
    // Reset to the last fetched values
    if (settings) {
      setGeneralItems((settings.newsAndOffers || []).map((i: any) => i?.title ?? ""));
      setReturnPeriod(settings.returnPeriod ?? "");
      setFreeShippingThreshold(settings.freeShippingThreshold ?? "");
      setPhoneNumber(settings.phoneNumber ?? "");
      setEmail(settings.email ?? "");
      setWhatsapp(settings.whatsapp ?? "");
    } else {
      setGeneralItems([""]);
      setReturnPeriod("");
      setFreeShippingThreshold("");
      setPhoneNumber("");
      setEmail("");
      setWhatsapp("");
    }
    toast.info("Form reset");
  };

  return (
    <Card className="shadow-xl pt-0 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-8">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 border-b border-purple-200/30 dark:border-purple-700/30 pt-4">
        <CardTitle className="text-2xl text-slate-800 dark:text-slate-200">
          General Settings
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Add and manage news and special offers for your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Contact Information Section */}
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading || isSaving}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isSaving}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="Enter WhatsApp number"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  disabled={isLoading || isSaving}
                />
              </div>
            </div>
          </div>

          {/* Policy Information Section */}
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Policy Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="returnPeriod">Return Period (Days)</Label>
                <Input
                  id="returnPeriod"
                  type="number"
                  min="0"
                  placeholder="Enter return period"
                  value={returnPeriod === "" ? "" : returnPeriod}
                  onChange={(e) => {
                    const val = e.target.value;
                    setReturnPeriod(val === "" ? "" : Number(val));
                  }}
                  disabled={isLoading || isSaving}
                />
              </div>
              <div>
                <Label htmlFor="freeShipping">Free Shipping Threshold (₹)</Label>
                <Input
                  id="freeShipping"
                  type="number"
                  min="0"
                  placeholder="Enter free shipping threshold"
                  value={freeShippingThreshold === "" ? "" : freeShippingThreshold}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFreeShippingThreshold(val === "" ? "" : Number(val));
                  }}
                  disabled={isLoading || isSaving}
                />
              </div>
            </div>
          </div>

          {/* News and Offers Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">News and Offers</h3>
              <Button onClick={addGeneralItem} variant="outline" size="sm" disabled={isSaving}>
                Add Item
              </Button>
            </div>
            <div className="space-y-4">
              {generalItems.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`general-${index}`} className="sr-only">News/Offer Item {index + 1}</Label>
                    <Input
                      id={`general-${index}`}
                      placeholder="Enter news or offer..."
                      value={item}
                      onChange={(e) => updateGeneralItem(index, e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  {generalItems.length > 1 && (
                    <Button
                      onClick={() => removeGeneralItem(index)}
                      variant="outline"
                      size="sm"
                      className="mt-6 h-10"
                      disabled={isSaving}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleReset} disabled={isSaving}>
              Reset
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              Save General Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
