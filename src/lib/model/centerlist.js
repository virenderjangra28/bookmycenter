import mongoose from "mongoose";

const cbtInfrastructureSchema = new mongoose.Schema(
    {
        totalComputers: String,
        backupComputers: String,
        processorConfiguration: String,
        minimumRam: String,
        operatingSystem: String,
        monitorSize: String,
        webcamAvailable: String,
        headphonesAvailable: String,
        microphoneAvailable: String,
        lanConnectivity: String,
        systemsConnectedThroughLan: String,
        usbPortsDisabled: String,
        localAdminRestricted: String,
        secureBrowserCompatible: String,
    },
    { _id: false }
);

const internetInfrastructureSchema = new mongoose.Schema(
    {
        primaryIsp: String,
        primarySpeed: String,
        connectionType: String,
        dedicatedConnection: String,
        staticIpAvailable: String,
        backupInternetAvailable: String,
        backupIspName: String,
        backupSpeed: String,
        loadBalancingAvailable: String,
    },
    { _id: false }
);

const pbtInfrastructureSchema = new mongoose.Schema(
    {
        seatingCapacity: String,
        numberOfRooms: String,
        individualDeskAvailable: String,
        secureQuestionPaperStorage: String,
        cctvCoverage: String,
        printerFacility: String,
        omrHandlingFacility: String,
        secureMaterialStorage: String,
        materialDispatchFacility: String,
    },
    { _id: false }
);

const powerInfrastructureSchema = new mongoose.Schema(
    {
        electricityAvailable: String,
        upsAvailable: String,
        upsBackupDuration: String,
        generatorAvailable: String,
        generatorCapacity: String,
        inverterBackup: String,
        labOperatesDuringPowerFailure: String,
    },
    { _id: false }
);

const cctvSecuritySchema = new mongoose.Schema(
    {
        cctvInstalled: String,
        numberOfCameras: String,
        cctvCoverage: [String],
        recordingAvailable: String,
        retentionPeriod: String,
        liveMonitoringAvailable: String,
        remoteAccessPossible: String,
        securityGuardAvailable: String,
        fireExtinguishersAvailable: String,
        emergencyExitAvailable: String,
        fireSafetyCertificateAvailable: String,
    },
    { _id: false }
);

const accessibilitySchema = new mongoose.Schema(
    {
        wheelchairAccessible: String,
        liftAvailable: String,
        rampAvailable: String,
        accessibleToilet: String,
        drinkingWater: String,
        separateToilets: String,
        airConditioning: String,
        properVentilation: String,
        waitingArea: String,
        parkingFacility: String,
        publicTransportNearby: String,
    },
    { _id: false }
);

const staffSchema = new mongoose.Schema(
    {
        centreManager: String,
        technicalSupportStaff: String,
        invigilators: String,
        registrationStaff: String,
        securityPersonnel: String,
        femaleInvigilators: String,
        itAdministrator: String,
    },
    { _id: false }
);

const photosSchema = new mongoose.Schema(
    {
        buildingFront: [String],
        reception: [String],
        computerLab: [String],
        candidateSeating: [String],
        cctvCoverage: [String],
        upsPowerBackup: [String],
        washrooms: [String],
        drinkingWater: [String],
        fireSafety: [String],
        emergencyExit: [String],
    },
    { _id: false }
);

const centerlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        centerId: String,
        label: String,
        separateRegistrationArea: String,
        bagStorage: String,
        totalAreaSqFt: String,
        examRooms: String,
        totalSeatingCapacity: String,
        totalComputerCapacity: String,
        maxCandidatesPerShift: String,
        shiftsPerDay: String,
        waitingArea: String,
        cbtInfrastructure: cbtInfrastructureSchema,
        internetInfrastructure: internetInfrastructureSchema,
        pbtInfrastructure: pbtInfrastructureSchema,
        powerInfrastructure: powerInfrastructureSchema,
        cctvSecurity: cctvSecuritySchema,
        authenticationFacilities: [String],
        accessibility: accessibilitySchema,
        staff: staffSchema,
        photos: photosSchema,
        additionalPhotos: [String],
        created_at: { type: Date, default: Date.now },
        isVerified: { type: Boolean, default: false },
        isAvailable: { type: Boolean, default: true },
        price: { type: Number, default: 0 },
        pricePerCandidate: { type: Number, default: 0 },
    },
    { collection: "centerLists" }
);

centerlistSchema.index({ userId: 1 });

if (mongoose.models.Centerlist) {
    mongoose.deleteModel("Centerlist");
}

export const Centerlist = mongoose.model("Centerlist", centerlistSchema);

export default Centerlist;
