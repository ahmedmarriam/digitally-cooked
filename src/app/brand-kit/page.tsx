"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BrandKitRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/brand-profile"); }, [router]);
  return null;
}
