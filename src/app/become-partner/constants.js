export const ORGANIZATION_TYPES = [
  "Private",
  "School",
  "College/University",
  "Computer Institute",
  "Training Centre",
  "Skill Development Centre",
  "Government Institution",
  "Other",
];

export const CENTER_TYPES = [
  "CBT",
  "PBT/Paper Exam",
  "Certification",
  "Government",
  "Training",
];

export const STAR_RATINGS = [
  { label: "1 Star", value: 1 },
  { label: "2 Star", value: 2 },
  { label: "3 Star", value: 3 },
  { label: "4 Star", value: 4 },
  { label: "5 Star", value: 5 },
];

export const CONNECTION_TYPES = ["Fibre", "Leased Line", "Broadband", "Other"];

export const OPERATING_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const AUTH_FACILITIES = [
  "Aadhaar / ID Verification",
  "Biometric Fingerprint Scanner",
  "Barcode / QR Scanner",
  "Document Register",
];

export const CCTV_COVERAGE_OPTIONS = [
  "Entrance",
  "Registration Area",
  "Examination Labs",
  "Corridors",
  "Server / Control Room",
];

export const PHOTO_UNCHANGED = "__unchanged__";

export const MANDATORY_PHOTO_FIELDS = [
  { key: "buildingFront", label: "Building – Front View / Entrance" },
  { key: "reception", label: "Reception / Registration Area" },
  { key: "computerLab", label: "Computer Lab" },
  { key: "candidateSeating", label: "Candidate Seating" },
  { key: "cctvCoverage", label: "CCTV Camera Coverage" },
  { key: "upsPowerBackup", label: "UPS / Power Backup / DG" },
  { key: "washrooms", label: "Washrooms" },
  { key: "drinkingWater", label: "Drinking Water Facility" },
  { key: "fireSafety", label: "Fire Safety Equipment" },
  { key: "emergencyExit", label: "Emergency Exit" },
];

export function createCbtInfrastructure() {
  return {
    totalComputers: "",
    backupComputers: "",
    processorConfiguration: "",
    minimumRam: "",
    operatingSystem: "",
    monitorSize: "",
    webcamAvailable: "",
    headphonesAvailable: "",
    microphoneAvailable: "",
    lanConnectivity: "",
    systemsConnectedThroughLan: "",
    usbPortsDisabled: "",
    localAdminRestricted: "",
    secureBrowserCompatible: "",
  };
}

export function createInternetInfrastructure() {
  return {
    primaryIsp: "",
    primarySpeed: "",
    connectionType: "",
    dedicatedConnection: "",
    staticIpAvailable: "",
    backupInternetAvailable: "",
    backupIspName: "",
    backupSpeed: "",
    loadBalancingAvailable: "",
  };
}

export function createPbtInfrastructure() {
  return {
    seatingCapacity: "",
    numberOfRooms: "",
    individualDeskAvailable: "",
    secureQuestionPaperStorage: "",
    cctvCoverage: "",
    printerFacility: "",
    omrHandlingFacility: "",
    secureMaterialStorage: "",
    materialDispatchFacility: "",
  };
}

export function createPowerInfrastructure() {
  return {
    electricityAvailable: "",
    upsAvailable: "",
    upsBackupDuration: "",
    generatorAvailable: "",
    generatorCapacity: "",
    inverterBackup: "",
    labOperatesDuringPowerFailure: "",
  };
}

export function createCctvSecurity() {
  return {
    cctvInstalled: "",
    numberOfCameras: "",
    cctvCoverage: [],
    recordingAvailable: "",
    retentionPeriod: "",
    liveMonitoringAvailable: "",
    remoteAccessPossible: "",
    securityGuardAvailable: "",
    fireExtinguishersAvailable: "",
    emergencyExitAvailable: "",
    fireSafetyCertificateAvailable: "",
  };
}

export function createAccessibility() {
  return {
    wheelchairAccessible: "",
    liftAvailable: "",
    rampAvailable: "",
    accessibleToilet: "",
    drinkingWater: "",
    separateToilets: "",
    airConditioning: "",
    properVentilation: "",
    waitingArea: "",
    parkingFacility: "",
    publicTransportNearby: "",
  };
}

export function createStaffDetails() {
  return {
    centreManager: "",
    technicalSupportStaff: "",
    invigilators: "",
    registrationStaff: "",
    securityPersonnel: "",
    femaleInvigilators: "",
    itAdministrator: "",
  };
}

export function createCenter(index = 1) {
  return {
    id: crypto.randomUUID(),
    label: `Center-details`,
    separateRegistrationArea: "",
    bagStorage: "",
    totalAreaSqFt: "",
    examRooms: "",
    totalSeatingCapacity: "",
    totalComputerCapacity: "",
    maxCandidatesPerShift: "",
    shiftsPerDay: "",
    waitingArea: "",
    price: "",
    isAvailable: true,
    cbtInfrastructure: createCbtInfrastructure(),
    internetInfrastructure: createInternetInfrastructure(),
    pbtInfrastructure: createPbtInfrastructure(),
    powerInfrastructure: createPowerInfrastructure(),
    cctvSecurity: createCctvSecurity(),
    authenticationFacilities: [],
    accessibility: createAccessibility(),
    staff: createStaffDetails(),
    photos: Object.fromEntries(MANDATORY_PHOTO_FIELDS.map(({ key }) => [key, []])),
    additionalPhotos: [],
  };
}

export function createInitialForm() {
  return {
    organizationName: "",
    organizationType: "",
    contactPersonName: "",
    email: "",
    emailOtp: "",
    emailVerified: false,
    contactNumber: "",
    mobileOtp: "",
    mobileVerified: false,
    centerType: "",
    centerRating: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    fullAddress: "",
    latitude: "",
    longitude: "",
    locationPhotos: { hall: [], entrance: [], washroom: [] },
    gstNumber: "",
    gstDocument: "",
    panNumber: "",
    panDocument: "",
    registrationNumber: "",
    registrationDocument: "",
    centreCapacity: "",
    centers: [createCenter(1)],
    banking: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branch: "",
      cancelledCheque: "",
    },
    availability: {
      operatingDays: [],
      hoursFrom: "",
      hoursTo: "",
      weekdayExams: false,
      weekendExams: false,
      multiDayExams: false,
      shortNoticeExams: false,
    },
    declaration: {
      informationAccurate: false,
      termsAccepted: false,
      confidentialityAccepted: false,
      verificationConsent: false,
      accurateInfrastructure: false,
      authorisedPersonName: "",
      designation: "",
      declarationDate: "",
    },
  };
}