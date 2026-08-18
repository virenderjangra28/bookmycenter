import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/model/user";
import Location from "@/lib/model/location";
import LegalRegistration from "@/lib/model/legalRegistration";
import BankingDetail from "@/lib/model/bankingDetail";
import CenterAvilability from "@/lib/model/centerAvailability";
import CompDeclaration from "@/lib/model/complianceDeclaration";
import Centerlist from "@/lib/model/centerlist";
import { getDataFromToken } from "@/helper/getDataFromToken";
import { createCenter, createInitialForm } from "@/app/become-partner/constants";

function isClientRole(role) {
  return role === 2 || role === "2";
}

function parseCenterRating(value) {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "number") return value;
  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function firstPhoto(value) {
  if (Array.isArray(value) && value[0]) return value[0];
  if (typeof value === "string") return value;
  return "";
}

function toFormCenter(doc, index) {
  const base = createCenter(index + 1);
  const photos = { ...base.photos };

  if (doc.photos) {
    for (const key of Object.keys(photos)) {
      photos[key] = Array.isArray(doc.photos[key]) ? doc.photos[key] : [];
    }
  }

  return {
    ...base,
    _id: String(doc._id),
    id: doc.centerId || String(doc._id),
    label: doc.label || base.label,
    separateRegistrationArea: doc.separateRegistrationArea || "",
    bagStorage: doc.bagStorage || "",
    totalAreaSqFt: doc.totalAreaSqFt || "",
    examRooms: doc.examRooms || "",
    totalSeatingCapacity: doc.totalSeatingCapacity || "",
    totalComputerCapacity: doc.totalComputerCapacity || "",
    maxCandidatesPerShift: doc.maxCandidatesPerShift || "",
    shiftsPerDay: doc.shiftsPerDay || "",
    waitingArea: doc.waitingArea || "",
    cbtInfrastructure: { ...base.cbtInfrastructure, ...(doc.cbtInfrastructure || {}) },
    internetInfrastructure: { ...base.internetInfrastructure, ...(doc.internetInfrastructure || {}) },
    pbtInfrastructure: { ...base.pbtInfrastructure, ...(doc.pbtInfrastructure || {}) },
    powerInfrastructure: { ...base.powerInfrastructure, ...(doc.powerInfrastructure || {}) },
    cctvSecurity: {
      ...base.cctvSecurity,
      ...(doc.cctvSecurity || {}),
      cctvCoverage: Array.isArray(doc.cctvSecurity?.cctvCoverage)
        ? doc.cctvSecurity.cctvCoverage
        : [],
    },
    authenticationFacilities: Array.isArray(doc.authenticationFacilities)
      ? doc.authenticationFacilities
      : [],
    accessibility: { ...base.accessibility, ...(doc.accessibility || {}) },
    staff: { ...base.staff, ...(doc.staff || {}) },
    photos,
    additionalPhotos: Array.isArray(doc.additionalPhotos) ? doc.additionalPhotos : [],
  };
}

function mapPartnerForm(user, location, legal, banking, availability, declaration, centers) {
  const form = createInitialForm();

  return {
    ...form,
    organizationName: user.company || "",
    organizationType: user.organizationType || "",
    contactPersonName: user.name || "",
    email: user.email || "",
    emailVerified: true,
    contactNumber: user.mobile || "",
    mobileVerified: true,
    centerType: user.centerType || "",
    centerRating: user.centerRating ?? "",
    centreCapacity: user.centerCapacity || "",
    country: location?.country || "",
    state: location?.state || "",
    city: location?.city || "",
    pinCode: location?.pinCode != null ? String(location.pinCode) : "",
    fullAddress: location?.fullAddress || "",
    latitude: location?.latitude || "",
    longitude: location?.longitude || "",
    locationPhotos: {
      hall: location?.locationPhotos?.hall || [],
      entrance: location?.locationPhotos?.entrance || [],
      washroom: location?.locationPhotos?.washroom || [],
    },
    gstNumber: legal?.gstNumber || "",
    gstDocument: firstPhoto(legal?.legalRegistrationPhotos?.gst),
    panNumber: legal?.panNumber || "",
    panDocument: firstPhoto(legal?.legalRegistrationPhotos?.pan),
    registrationNumber: legal?.corporateNumber || "",
    registrationDocument: firstPhoto(legal?.legalRegistrationPhotos?.corporate),
    banking: {
      accountHolderName: banking?.accountName || "",
      bankName: banking?.bankName || "",
      accountNumber: banking?.accountNumber || "",
      ifscCode: banking?.ifscCode || "",
      branch: banking?.branchName || "",
      cancelledCheque:
        banking?.cancelCheckPhotos?.checkPhoto ||
        (typeof banking?.cancelCheckPhotos === "string" ? banking.cancelCheckPhotos : ""),
    },
    availability: {
      operatingDays: availability?.operatingDays || [],
      hoursFrom: availability?.operatingHoursFrom || "",
      hoursTo: availability?.operatingHoursTo || "",
      weekdayExams: Boolean(availability?.weekdayExams),
      weekendExams: Boolean(availability?.weekendExams),
      multiDayExams: Boolean(availability?.multiDayExams),
      shortNoticeExams: Boolean(availability?.shortNoticeExams),
    },
    declaration: {
      ...form.declaration,
      authorisedPersonName: declaration?.authorityName || "",
      designation: declaration?.authorityDesignation || "",
      declarationDate: formatDate(declaration?.authDate),
    },
    centers: centers.length ? centers.map(toFormCenter) : [createCenter(1)],
  };
}

export async function GET(request) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return NextResponse.json({ success: false, result: "User not found" }, { status: 404 });
    }

    if (!isClientRole(user.role)) {
      return NextResponse.json({ success: false, result: "Forbidden" }, { status: 403 });
    }

    const [location, legal, banking, availability, declaration, centers] = await Promise.all([
      Location.findOne({ userId }).lean(),
      LegalRegistration.findOne({ userId }).lean(),
      BankingDetail.findOne({ userId }).lean(),
      CenterAvilability.findOne({ userId }).lean(),
      CompDeclaration.findOne({ userId }).lean(),
      Centerlist.find({ userId }).sort({ created_at: 1 }).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: mapPartnerForm(user, location, legal, banking, availability, declaration, centers),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, result: "Unauthorized", error: error.message },
      { status: 401 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, result: "User not found" }, { status: 404 });
    }

    if (!isClientRole(user.role)) {
      return NextResponse.json({ success: false, result: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    user.company = body.organizationName || user.company;
    user.organizationType = body.organizationType || user.organizationType;
    user.name = body.contactPersonName || user.name;
    user.mobile = body.contactNumber || user.mobile;
    if (body.email) user.email = body.email;
    user.centerType = body.centerType || "";
    user.centerRating = parseCenterRating(body.centerRating);
    user.centerCapacity = String(body.centreCapacity || body.centerCapacity || "");
    await user.save();

    await Location.findOneAndUpdate(
      { userId },
      {
        userId,
        country: body.country || "",
        state: body.state || "",
        city: body.city || "",
        pinCode: body.pinCode || "",
        fullAddress: body.fullAddress || "",
        latitude: body.latitude || "",
        longitude: body.longitude || "",
        locationPhotos: body.locationPhotos || {},
      },
      { upsert: true, new: true }
    );

    await LegalRegistration.findOneAndUpdate(
      { userId },
      {
        userId,
        gstNumber: body.gstNumber || "",
        panNumber: body.panNumber || "",
        corporateNumber: body.registrationNumber || body.corporateNumber || "",
        legalRegistrationPhotos: {
          gst: body.gstDocument ? [body.gstDocument] : [],
          pan: body.panDocument ? [body.panDocument] : [],
          corporate: body.registrationDocument ? [body.registrationDocument] : [],
        },
      },
      { upsert: true, new: true }
    );

    await BankingDetail.findOneAndUpdate(
      { userId },
      {
        userId,
        accountName: body.banking?.accountHolderName || "",
        bankName: body.banking?.bankName || "",
        accountNumber: body.banking?.accountNumber || "",
        ifscCode: body.banking?.ifscCode || "",
        branchName: body.banking?.branch || "",
        cancelCheckPhotos: { checkPhoto: body.banking?.cancelledCheque || "" },
      },
      { upsert: true, new: true }
    );

    await CenterAvilability.findOneAndUpdate(
      { userId },
      {
        userId,
        operatingDays: Array.isArray(body.availability?.operatingDays)
          ? body.availability.operatingDays
          : [],
        operatingHoursFrom: body.availability?.hoursFrom || "",
        operatingHoursTo: body.availability?.hoursTo || "",
        weekdayExams: Boolean(body.availability?.weekdayExams),
        weekendExams: Boolean(body.availability?.weekendExams),
        multiDayExams: Boolean(body.availability?.multiDayExams),
        shortNoticeExams: Boolean(body.availability?.shortNoticeExams),
      },
      { upsert: true, new: true }
    );

    await CompDeclaration.findOneAndUpdate(
      { userId },
      {
        userId,
        authorityName: body.declaration?.authorisedPersonName || "",
        authorityDesignation: body.declaration?.designation || "",
        authDate: body.declaration?.declarationDate || "",
      },
      { upsert: true, new: true }
    );

    const incomingCenters = Array.isArray(body.centers) ? body.centers : [];
    const existingCenters = await Centerlist.find({ userId }).select("_id").lean();
    const incomingIds = new Set(
      incomingCenters.map((center) => center._id).filter(Boolean).map(String)
    );

    const idsToDelete = existingCenters
      .map((center) => String(center._id))
      .filter((id) => !incomingIds.has(id));

    if (idsToDelete.length) {
      await Centerlist.deleteMany({ _id: { $in: idsToDelete }, userId });
    }

    for (const [index, center] of incomingCenters.entries()) {
      const payload = {
        userId,
        centerId: center.id || "",
        label: center.label || `Center-${index + 1}`,
        separateRegistrationArea: center.separateRegistrationArea || "",
        bagStorage: center.bagStorage || "",
        totalAreaSqFt: center.totalAreaSqFt || "",
        examRooms: center.examRooms || "",
        totalSeatingCapacity: center.totalSeatingCapacity || "",
        totalComputerCapacity: center.totalComputerCapacity || "",
        maxCandidatesPerShift: center.maxCandidatesPerShift || "",
        shiftsPerDay: center.shiftsPerDay || "",
        waitingArea: center.waitingArea || "",
        cbtInfrastructure: center.cbtInfrastructure || {},
        internetInfrastructure: center.internetInfrastructure || {},
        pbtInfrastructure: center.pbtInfrastructure || {},
        powerInfrastructure: center.powerInfrastructure || {},
        cctvSecurity: {
          ...(center.cctvSecurity || {}),
          cctvCoverage: Array.isArray(center.cctvSecurity?.cctvCoverage)
            ? center.cctvSecurity.cctvCoverage
            : [],
        },
        authenticationFacilities: Array.isArray(center.authenticationFacilities)
          ? center.authenticationFacilities
          : [],
        accessibility: center.accessibility || {},
        staff: center.staff || {},
        photos: center.photos || {},
        additionalPhotos: Array.isArray(center.additionalPhotos) ? center.additionalPhotos : [],
      };

      if (center._id) {
        await Centerlist.findOneAndUpdate({ _id: center._id, userId }, payload);
      } else {
        await Centerlist.create(payload);
      }
    }

    return NextResponse.json({
      success: true,
      result: "Center details updated successfully",
    });
  } catch (error) {
    console.error("PATCH /api/client/center failed:", error);
    return NextResponse.json(
      { success: false, result: "Failed to update center", error: error.message },
      { status: 500 }
    );
  }
}
