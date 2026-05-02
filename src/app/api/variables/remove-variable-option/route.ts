import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongodb";

export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDB();
    const { field, value } = await request.json();

    if (!field || !value) {
      return NextResponse.json(
        { success: false, message: "Field and value are required" },
        { status: 400 }
      );
    }

    const variables = await db.collection("variables").findOne({});

    if (!variables) {
      return NextResponse.json(
        { success: false, message: "Variables not found" },
        { status: 404 }
      );
    }

    if (field === "subCatergory") {
      // subCatergory is a Record<string, string[]>, remove value from all category arrays
      const subCatergory = variables.subCatergory || {};
      const updatedSubCatergory: Record<string, string[]> = {};

      for (const [cat, subs] of Object.entries(subCatergory)) {
        const filtered = (subs as string[]).filter((s: string) => s !== value);
        if (filtered.length > 0) {
          updatedSubCatergory[cat] = filtered;
        }
      }

      await db.collection("variables").updateOne(
        {},
        { $set: { subCatergory: updatedSubCatergory } }
      );
    } else {
      // For array fields like catergory, color, occassion, etc.
      const currentArray = variables[field] || [];
      const updatedArray = currentArray.filter((item: string) => item !== value);

      await db.collection("variables").updateOne(
        {},
        { $set: { [field]: updatedArray } }
      );

      // If removing a category, also clean up its subcategories
      if (field === "catergory") {
        const subCatergory = variables.subCatergory || {};
        const updatedSubCatergory = { ...subCatergory };
        delete updatedSubCatergory[value];
        await db.collection("variables").updateOne(
          {},
          { $set: { subCatergory: updatedSubCatergory } }
        );
      }
    }

    const updated = await db.collection("variables").findOne({});

    return NextResponse.json(
      {
        success: true,
        message: `Deleted "${value}" from ${field}`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error in removeVariableOption:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting variable option",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
