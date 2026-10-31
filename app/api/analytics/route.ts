import { NextResponse } from "next/server";
import { getExasolAnalytics } from "@/lib/exasol";

export async function GET() {
  try {
    const data = await getExasolAnalytics();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      engine: "Exasol Personal 8.0 In-Memory Columnar",
      data,
    });
  } catch (error) {
    console.error("[analytics API] Error fetching Exasol analytics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to query Exasol database" },
      { status: 500 }
    );
  }
}
