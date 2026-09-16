"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useGetGeneralSettings } from "@/hooks/GeneralSettings/useGetGeneralSettings";
import { useAddUpdateGeneralSettings } from "@/hooks/GeneralSettings/useAddUpdateGeneralSettings";

export default function GeneralSettings() {
  const { settings, isLoading } = useGetGeneralSettings();
  const { saveGeneralSettings, isSaving, saveError } = useAddUpdateGeneralSettings();

  const [generalItems, setGeneralItems] = useState<string[]>([""]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroUploading, setHeroUploading] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const [heroMobileImages, setHeroMobileImages] = useState<string[]>([]);
  const [heroMobileUploading, setHeroMobileUploading] = useState(false);
  const heroMobileFileInputRef = useRef<HTMLInputElement>(null);
  const [returnPeriod, setReturnPeriod] = useState<number | "">("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number | "">("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [whatsappUsername, setWhatsappUsername] = useState<string>("");
  const [whatsappDeviceToken, setWhatsappDeviceToken] = useState<string>("");

  // Populate local state when settings load
  useEffect(() => {
    if (!settings) return;
    setGeneralItems((settings.newsAndOffers || []).map((i: any) => i?.title ?? ""));
    setHeroImages(settings.heroCarousel || []);
    setHeroMobileImages(settings.heroCarouselMobile || []);
    setReturnPeriod(settings.returnPeriod ?? "");
    setFreeShippingThreshold(settings.freeShippingThreshold ?? "");
    setPhoneNumber(settings.phoneNumber ?? "");
    setEmail(settings.email ?? "");
    setWhatsapp(settings.whatsapp ?? "");
    setWhatsappUsername(settings.whatsappUsername ?? "");
    setWhatsappDeviceToken(settings.whatsappDeviceToken ?? "");
  }, [settings]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleCarouselFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    setUploading: (v: boolean) => void
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const base64s = await Promise.all(files.map(fileToBase64));
      setter((prev) => [...prev, ...base64s]);
    } catch {
      toast.error("Failed to read image file");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeCarouselImage = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const renderCarouselGroup = (
    label: string,
    hint: string,
    images: string[],
    uploading: boolean,
    inputRef: React.RefObject<HTMLInputElement | null>,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    setUploading: (v: boolean) => void
  ) => (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading || isSaving || uploading}
        >
          {uploading ? "Uploading..." : "Add Image"}
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleCarouselFileChange(e, setter, setUploading)}
      />
      <p className="text-xs text-gray-500 mb-3">{hint}</p>
      {images.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No carousel images added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-video rounded-md border overflow-hidden">
              <Image
                src={img}
                alt={`${label} slide ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute top-1 right-1 bg-white/70 hover:bg-white h-7 w-7"
                onClick={() => removeCarouselImage(setter, index)}
                disabled={isSaving}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
      heroCarousel: heroImages,
      heroCarouselMobile: heroMobileImages,
      returnPeriod: returnPeriod === "" ? null : returnPeriod,
      freeShippingThreshold: freeShippingThreshold === "" ? null : freeShippingThreshold,
      phoneNumber,
      email,
      whatsapp,
      whatsappUsername,
      whatsappDeviceToken,
    };

    saveGeneralSettings(payload);
    toast.success("Saving general settings...");
  };

  const handleReset = () => {
    // Reset to the last fetched values
    if (settings) {
      setGeneralItems((settings.newsAndOffers || []).map((i: any) => i?.title ?? ""));
      setHeroImages(settings.heroCarousel || []);
      setHeroMobileImages(settings.heroCarouselMobile || []);
      setReturnPeriod(settings.returnPeriod ?? "");
      setFreeShippingThreshold(settings.freeShippingThreshold ?? "");
      setPhoneNumber(settings.phoneNumber ?? "");
      setEmail(settings.email ?? "");
      setWhatsapp(settings.whatsapp ?? "");
      setWhatsappUsername(settings.whatsappUsername ?? "");
      setWhatsappDeviceToken(settings.whatsappDeviceToken ?? "");
    } else {
      setGeneralItems([""]);
      setHeroImages([]);
      setHeroMobileImages([]);
      setReturnPeriod("");
      setFreeShippingThreshold("");
      setPhoneNumber("");
      setEmail("");
      setWhatsapp("");
      setWhatsappUsername("");
      setWhatsappDeviceToken("");
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
          {/* Hero Carousel Section */}
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Hero Carousel</h3>
            <div className="space-y-6">
              {renderCarouselGroup(
                "Desktop Carousel",
                "Shown on desktop screens. Recommended ratio 16:9.",
                heroImages,
                heroUploading,
                heroFileInputRef,
                setHeroImages,
                setHeroUploading
              )}
              {renderCarouselGroup(
                "Mobile Carousel",
                "Shown on mobile screens. Recommended portrait ratio 4:5 or 9:16. Falls back to desktop images if empty.",
                heroMobileImages,
                heroMobileUploading,
                heroMobileFileInputRef,
                setHeroMobileImages,
                setHeroMobileUploading
              )}
            </div>
          </div>

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

          {/* WhatsApp Marketing Credentials Section */}
          <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">WhatsApp Marketing Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="whatsappUsername">Username</Label>
                <Input
                  id="whatsappUsername"
                  placeholder="Enter WhatsApp username"
                  value={whatsappUsername}
                  onChange={(e) => setWhatsappUsername(e.target.value)}
                  disabled={isLoading || isSaving}
                />
              </div>
              <div>
                <Label htmlFor="whatsappDeviceToken">Device Token</Label>
                <Input
                  id="whatsappDeviceToken"
                  placeholder="Enter device token"
                  value={whatsappDeviceToken}
                  onChange={(e) => setWhatsappDeviceToken(e.target.value)}
                  disabled={isLoading || isSaving}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              API URL and country code are managed internally. Only username and device token need to be configured here.
            </p>
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
