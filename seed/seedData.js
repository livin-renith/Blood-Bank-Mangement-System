require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Donor = require('../models/Donor');
const Donation = require('../models/Donation');
const Inventory = require('../models/Inventory');
const BloodRequest = require('../models/Request');
const Hospital = require('../models/Hospital');
const Log = require('../models/Log');

async function seed() {
  await connectDB();

  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Donor.deleteMany({}),
    Donation.deleteMany({}),
    Inventory.deleteMany({}),
    BloodRequest.deleteMany({}),
    Hospital.deleteMany({}),
    Log.deleteMany({})
  ]);

  console.log('Seeding Users...');
  const admin = await User.create({
    name: 'Dr. Eleanor Vance, MD',
    email: 'admin.bloodbank@lifeflow.med',
    password: 'SecureLifeFlow2025!',
    role: 'administrator',
    institution: 'St. Jude Metropolitan Medical Center',
    phone: '+1 (555) 382-9102'
  });

  await User.create({
    name: 'Marcus Chen, Lab Director',
    email: 'staff@lifeflow.med',
    password: 'SecureLifeFlow2025!',
    role: 'staff',
    institution: 'Central Regional Blood Bank',
    phone: '+1 (555) 491-2233'
  });

  console.log('Seeding Hospitals...');
  const hospitalsData = [
    {
      hospitalId: 'HSP-8801',
      name: 'St. Jude General Medical Center',
      type: 'Level III Tertiary',
      region: 'Central Metro',
      contactPerson: 'Dr. Sarah Jenkins',
      emergencyPhone: '+1 (555) 382-9100',
      address: '742 Evergreen Terrace, Central Metro',
      complianceRate: '99.8%',
      activeRequests: 3
    },
    {
      hospitalId: 'HSP-8802',
      name: 'Metro Metropolitan Trauma Institute',
      type: 'Specialized Trauma',
      region: 'North District',
      contactPerson: 'Dr. Marcus Vance',
      emergencyPhone: '+1 (555) 491-2233',
      address: '108 Grand Avenue, North District',
      complianceRate: '98.5%',
      activeRequests: 5
    },
    {
      hospitalId: 'HSP-8803',
      name: "Children's Specialized Hospital",
      type: 'Pediatric Care',
      region: 'East Valley',
      contactPerson: 'Dr. Chloe Martinez',
      emergencyPhone: '+1 (555) 720-4100',
      address: '42 Blossom Way, East Valley',
      complianceRate: '100%',
      activeRequests: 3
    },
    {
      hospitalId: 'HSP-8804',
      name: 'Hope Valley Community Clinic',
      type: 'General Community',
      region: 'South Bay',
      contactPerson: 'Nurse Gregory House',
      emergencyPhone: '+1 (555) 914-8822',
      address: '500 Ocean Blvd, South Bay',
      complianceRate: '99.2%',
      activeRequests: 1
    },
    {
      hospitalId: 'HSP-8805',
      name: 'City General Medical Center',
      type: 'Level III Tertiary',
      region: 'Central Metro',
      contactPerson: 'Dr. Allison Cameron',
      emergencyPhone: '+1 (555) 234-9988',
      address: '12 Medical Plaza, Central Metro',
      complianceRate: '99.6%',
      activeRequests: 2
    }
  ];
  await Hospital.insertMany(hospitalsData);

  console.log('Seeding Donors...');
  const donorsData = [
    {
      donorId: 'LF-89201',
      fullName: 'Eleanor Vance',
      email: 'e.vance@gmail.com',
      phone: '+1 (555) 382-9102',
      bloodGroup: 'O-',
      lastDonationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      eligibilityStatus: 'Eligible',
      totalDonations: 14,
      address: '123 Health Ave, Suite 4B, Metro City',
      clinicalNotes: 'Universal red cell donor. High antibody titer, excellent donation tolerance.'
    },
    {
      donorId: 'LF-89202',
      fullName: 'Marcus Chen',
      email: 'marcus.chen@outlook.com',
      phone: '+1 (555) 491-2233',
      bloodGroup: 'A+',
      lastDonationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      eligibilityStatus: 'Deferred',
      totalDonations: 8,
      address: '88 Tech Boulevard, East Valley',
      clinicalNotes: 'Temporary deferral due to recent international travel (tropical zone).'
    },
    {
      donorId: 'LF-89203',
      fullName: 'Sarah Jenkins',
      email: 's.jenkins@biocare.org',
      phone: '+1 (555) 831-4455',
      bloodGroup: 'B+',
      lastDonationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      eligibilityStatus: 'Eligible',
      totalDonations: 19,
      address: '404 Pine Grove, Central Metro',
      clinicalNotes: 'Frequent apheresis platelet donor. Veins accessible and well maintained.'
    },
    {
      donorId: 'LF-89204',
      fullName: 'David Ross',
      email: 'david.ross@consulting.com',
      phone: '+1 (555) 201-9981',
      bloodGroup: 'AB-',
      lastDonationDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000),
      eligibilityStatus: 'Eligible',
      totalDonations: 6,
      address: '15 Highline St, North District',
      clinicalNotes: 'Rare blood group. High-priority call list for emergency plasma and RBCs.'
    },
    {
      donorId: 'LF-89205',
      fullName: 'Amara Okafor',
      email: 'amara.okafor@university.edu',
      phone: '+1 (555) 672-1144',
      bloodGroup: 'O+',
      lastDonationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      eligibilityStatus: 'Temporary Hold',
      totalDonations: 11,
      address: '77 Campus Road, South Bay',
      clinicalNotes: 'Mild vasovagal syncope during last session; recommend 30-minute post-observation.'
    },
    {
      donorId: 'LF-89206',
      fullName: 'Liam Patel',
      email: 'liam.patel@designstudio.io',
      phone: '+1 (555) 902-3311',
      bloodGroup: 'A-',
      lastDonationDate: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000),
      eligibilityStatus: 'Eligible',
      totalDonations: 4,
      address: '320 Waterfront Way, South Bay',
      clinicalNotes: 'Consistently high hemoglobin (15.2 g/dL), ideal for packed RBC processing.'
    },
    {
      donorId: 'LF-89207',
      fullName: 'Hannah Zimmerman',
      email: 'hannah.z@lawfirm.net',
      phone: '+1 (555) 412-8877',
      bloodGroup: 'B-',
      lastDonationDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      eligibilityStatus: 'Eligible',
      totalDonations: 12,
      address: '50 Judicial Lane, Central Metro',
      clinicalNotes: 'Rare negative factor. Excellent candidate for urgent requests.'
    },
    {
      donorId: 'LF-89208',
      fullName: 'Carlos Rodriguez',
      email: 'carlos.rod@transport.org',
      phone: '+1 (555) 554-1290',
      bloodGroup: 'AB+',
      lastDonationDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      eligibilityStatus: 'Eligible',
      totalDonations: 22,
      address: '900 Logistics Highway, North District',
      clinicalNotes: 'Universal plasma donor. Regular monthly plasma donation participant.'
    }
  ];
  const donors = await Donor.insertMany(donorsData);

  console.log('Seeding Donations...');
  const donationsData = [
    {
      donationId: 'DON-9821',
      donor: donors[0]._id,
      donorName: 'Eleanor Vance',
      donorCode: 'LF-89201',
      bloodGroup: 'O-',
      volumeMl: 450,
      collectionCenter: 'Downtown Main Center',
      vitalSigns: { bloodPressure: '118/76 mmHg', hemoglobin: '13.8 g/dL', temperature: '98.4 °F' },
      testingStatus: 'Passed',
      staffNotes: 'Flawless venipuncture. No dizziness or bruising reported.',
      donationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      donationId: 'DON-9820',
      donor: donors[1]._id,
      donorName: 'Marcus Chen',
      donorCode: 'LF-89202',
      bloodGroup: 'A+',
      volumeMl: 500,
      collectionCenter: 'City General Hospital',
      vitalSigns: { bloodPressure: '124/82 mmHg', hemoglobin: '14.2 g/dL', temperature: '98.6 °F' },
      testingStatus: 'Passed',
      staffNotes: 'Standard whole blood collection. Successfully processed into RBC and plasma.',
      donationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      donationId: 'DON-9819',
      donor: donors[2]._id,
      donorName: 'Sarah Jenkins',
      donorCode: 'LF-89203',
      bloodGroup: 'B+',
      volumeMl: 450,
      collectionCenter: 'Downtown Main Center',
      vitalSigns: { bloodPressure: '120/80 mmHg', hemoglobin: '13.4 g/dL', temperature: '98.5 °F' },
      testingStatus: 'Passed',
      staffNotes: 'Apheresis platelet donation unit. High platelet yield confirmed by lab.',
      donationDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      donationId: 'DON-9818',
      donor: donors[4]._id,
      donorName: 'Amara Okafor',
      donorCode: 'LF-89205',
      bloodGroup: 'O+',
      volumeMl: 350,
      collectionCenter: 'Northside Mobile Van',
      vitalSigns: { bloodPressure: '110/70 mmHg', hemoglobin: '12.8 g/dL', temperature: '98.8 °F' },
      testingStatus: 'Pending',
      staffNotes: 'Underweight collection (350 mL). Undergoing serological screening in Lab 2.',
      donationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      donationId: 'DON-9817',
      donor: donors[5]._id,
      donorName: 'Liam Patel',
      donorCode: 'LF-89206',
      bloodGroup: 'A-',
      volumeMl: 450,
      collectionCenter: 'Downtown Main Center',
      vitalSigns: { bloodPressure: '122/78 mmHg', hemoglobin: '15.0 g/dL', temperature: '98.2 °F' },
      testingStatus: 'Passed',
      staffNotes: 'RBC component isolated and frozen at -80°C.',
      donationDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    }
  ];
  await Donation.insertMany(donationsData);

  console.log('Seeding Inventory...');
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const inventoryData = [
    {
      unitId: 'BLD-98421',
      bloodGroup: 'O+',
      componentType: 'Red Blood Cells',
      collectionDate: new Date(now - 14 * day),
      expiryDate: new Date(now + 28 * day),
      storageLocation: 'Freezer A - Shelf 3',
      status: 'Available',
      donorId: 'LF-89201'
    },
    {
      unitId: 'BLD-98422',
      bloodGroup: 'O-',
      componentType: 'Platelets',
      collectionDate: new Date(now - 3 * day),
      expiryDate: new Date(now + 2 * day), // Expiring in 48 hours! Matches alert
      storageLocation: 'Agitator 2 - Tray 1',
      status: 'Expiring Soon',
      donorId: 'LF-89201'
    },
    {
      unitId: 'BLD-98423',
      bloodGroup: 'A+',
      componentType: 'Plasma, Fresh Frozen',
      collectionDate: new Date(now - 30 * day),
      expiryDate: new Date(now + 330 * day),
      storageLocation: 'Deep Freezer B - Box 4',
      status: 'Reserved',
      donorId: 'LF-89202'
    },
    {
      unitId: 'BLD-98424',
      bloodGroup: 'B+',
      componentType: 'Whole Blood',
      collectionDate: new Date(now - 2 * day),
      expiryDate: new Date(now + 33 * day),
      storageLocation: 'Lab Incubator 1',
      status: 'Testing',
      donorId: 'LF-89203'
    },
    {
      unitId: 'BLD-98425',
      bloodGroup: 'AB-',
      componentType: 'Red Blood Cells',
      collectionDate: new Date(now - 18 * day),
      expiryDate: new Date(now + 24 * day),
      storageLocation: 'Freezer A - Shelf 1',
      status: 'Available',
      donorId: 'LF-89204'
    },
    {
      unitId: 'BLD-98426',
      bloodGroup: 'A-',
      componentType: 'Red Blood Cells',
      collectionDate: new Date(now - 10 * day),
      expiryDate: new Date(now + 32 * day),
      storageLocation: 'Freezer B - Shelf 2',
      status: 'Available',
      donorId: 'LF-89206'
    },
    {
      unitId: 'BLD-98427',
      bloodGroup: 'B-',
      componentType: 'Platelets',
      collectionDate: new Date(now - 2 * day),
      expiryDate: new Date(now + 3 * day),
      storageLocation: 'Agitator 1 - Tray 2',
      status: 'Available',
      donorId: 'LF-89207'
    },
    {
      unitId: 'BLD-98428',
      bloodGroup: 'AB+',
      componentType: 'Plasma, Fresh Frozen',
      collectionDate: new Date(now - 5 * day),
      expiryDate: new Date(now + 355 * day),
      storageLocation: 'Deep Freezer A - Box 1',
      status: 'Available',
      donorId: 'LF-89208'
    },
    {
      unitId: 'BLD-98429',
      bloodGroup: 'O-',
      componentType: 'Red Blood Cells',
      collectionDate: new Date(now - 20 * day),
      expiryDate: new Date(now + 22 * day),
      storageLocation: 'Emergency Reserves - Vault 1',
      status: 'Available',
      donorId: 'LF-89201'
    },
    {
      unitId: 'BLD-98430',
      bloodGroup: 'A+',
      componentType: 'Whole Blood',
      collectionDate: new Date(now - 4 * day),
      expiryDate: new Date(now + 31 * day),
      storageLocation: 'Refrigerator 2 - Rack C',
      status: 'Available',
      donorId: 'LF-89202'
    }
  ];
  await Inventory.insertMany(inventoryData);

  console.log('Seeding Blood Requests...');
  const requestsData = [
    {
      requestId: 'REQ-9021',
      hospitalName: 'St. Jude Metropolitan Hospital',
      ward: 'Trauma Ward 3',
      bloodGroup: 'O-',
      componentType: 'Packed RBCs',
      unitsRequired: 4,
      priority: 'Emergency',
      requestDate: new Date(now - 3 * 60 * 60 * 1000),
      requiredByDate: new Date(now + 1 * 60 * 60 * 1000),
      status: 'Pending',
      notes: 'Severe multi-vehicle collision trauma victim with acute blood loss.'
    },
    {
      requestId: 'REQ-9022',
      hospitalName: 'City General Medical Center',
      ward: 'Surgery Unit B',
      bloodGroup: 'A+',
      componentType: 'Packed RBCs',
      unitsRequired: 2,
      priority: 'Urgent',
      requestDate: new Date(now - 5 * 60 * 60 * 1000),
      requiredByDate: new Date(now + 4 * 60 * 60 * 1000),
      status: 'Approved',
      notes: 'Scheduled cardiothoracic bypass procedure in Operating Room 4.'
    },
    {
      requestId: 'REQ-9023',
      hospitalName: "Children's Specialized Hospital",
      ward: 'Pediatric ICU',
      bloodGroup: 'B-',
      componentType: 'Platelets',
      unitsRequired: 3,
      priority: 'Emergency',
      requestDate: new Date(now - 2 * 60 * 60 * 1000),
      requiredByDate: new Date(now + 2 * 60 * 60 * 1000),
      status: 'Pending',
      notes: 'Leukemia patient experiencing thrombocytopenic hemorrhage.'
    },
    {
      requestId: 'REQ-9024',
      hospitalName: 'Hope Valley Community Clinic',
      ward: 'Maternity Ward',
      bloodGroup: 'AB+',
      componentType: 'Plasma, Fresh Frozen',
      unitsRequired: 1,
      priority: 'Routine',
      requestDate: new Date(now - 12 * 60 * 60 * 1000),
      requiredByDate: new Date(now + 24 * 60 * 60 * 1000),
      status: 'Fulfilled',
      notes: 'Post-delivery stabilization unit dispatched via courier vehicle.'
    },
    {
      requestId: 'REQ-9025',
      hospitalName: 'Metro Metropolitan Trauma Institute',
      ward: 'ER Resuscitation',
      bloodGroup: 'O+',
      componentType: 'Whole Blood',
      unitsRequired: 6,
      priority: 'Emergency',
      requestDate: new Date(now - 1 * 60 * 60 * 1000),
      requiredByDate: new Date(now + 45 * 60 * 1000),
      status: 'Pending',
      notes: 'Mass casualty protocol activated. Immediate helicopter delivery required.'
    }
  ];
  await BloodRequest.insertMany(requestsData);

  console.log('Seeding Activity Logs...');
  await Log.create([
    { action: 'SYSTEM_INIT', category: 'SYSTEM', details: 'LifeFlow Blood Bank system database initialized.' },
    { action: 'DONATION_RECORDED', category: 'DONATION', details: 'Donation #DON-9821 processed from Eleanor Vance (O-).' },
    { action: 'REQUEST_RECEIVED', category: 'REQUEST', details: 'Emergency request #REQ-9021 created by St. Jude Metropolitan Hospital.' }
  ]);

  console.log('Database seeding successfully completed!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
