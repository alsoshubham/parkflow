// Mock data store - simulates backend state

export const DEMO_USERS = [
  { id: 'u1', name: 'Arjun Sharma', email: 'admin@parkflow.io', password: 'admin123', role: 'Admin', status: 'active', phone: '+91 98765 43210', created: '2024-01-15' },
  { id: 'u2', name: 'Priya Mehta', email: 'operator@parkflow.io', password: 'op123', role: 'Operator', status: 'active', phone: '+91 98765 43211', created: '2024-02-10' },
  { id: 'u3', name: 'Ravi Kumar', email: 'guard@parkflow.io', password: 'guard123', role: 'Guard', status: 'active', phone: '+91 98765 43212', created: '2024-03-05' },
  { id: 'u4', name: 'Kavya Nair', email: 'driver@parkflow.io', password: 'driver123', role: 'Driver', status: 'active', phone: '+91 98765 43213', created: '2024-03-20' },
  { id: 'u5', name: 'Saurav Patel', email: 'saurav@parkflow.io', password: '123', role: 'Driver', status: 'active', phone: '+91 98765 43214', created: '2024-04-01' },
  { id: 'u6', name: 'Deepa Rao', email: 'deepa@parkflow.io', password: '123', role: 'Operator', status: 'inactive', phone: '+91 98765 43215', created: '2024-04-15' },
];

export const LOTS = [
  { id: 'l1', name: 'Nexus Mall Parking', address: '12 MG Road, Bangalore', zones: ['A','B','C'], totalSpots: 120, pricePerHour: 40, status: 'active', lat: 12.97, lng: 77.6 },
  { id: 'l2', name: 'Tech Park Tower', address: '45 Outer Ring Rd, Bangalore', zones: ['P1','P2'], totalSpots: 80, pricePerHour: 60, status: 'active', lat: 12.93, lng: 77.68 },
  { id: 'l3', name: 'City Centre Plaza', address: '78 Commercial St, Bangalore', zones: ['G','F1','F2'], totalSpots: 200, pricePerHour: 30, status: 'active', lat: 12.98, lng: 77.61 },
  { id: 'l4', name: 'Airport Express Hub', address: 'Terminal 1, Bangalore Airport', zones: ['T1','T2','T3'], totalSpots: 300, pricePerHour: 80, status: 'active', lat: 13.19, lng: 77.71 },
];

function generateSpots(lotId, total) {
  const statuses = ['available','available','available','available','occupied','occupied','occupied','reserved','maintenance'];
  const zones = { l1: ['A','B','C'], l2: ['P1','P2'], l3: ['G','F1','F2'], l4: ['T1','T2','T3'] };
  const zoneList = zones[lotId] || ['A'];
  return Array.from({ length: total }, (_, i) => {
    const zone = zoneList[Math.floor(i / Math.ceil(total / zoneList.length))];
    const num = (i % Math.ceil(total / zoneList.length)) + 1;
    return {
      id: `${lotId}-${zone}${num}`,
      lotId,
      label: `${zone}${num}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: i % 8 === 0 ? 'handicap' : i % 6 === 0 ? 'ev' : 'standard',
    };
  });
}

export const SPOTS = [
  ...generateSpots('l1', 120),
  ...generateSpots('l2', 80),
  ...generateSpots('l3', 200),
  ...generateSpots('l4', 300),
];

export const BOOKINGS = [
  { id: 'BK-2024-0001', userId: 'u4', lotId: 'l1', spotId: 'l1-A5', vehicleNo: 'KA01AB1234', startTime: '2024-04-10T09:00', endTime: '2024-04-10T12:00', status: 'completed', amount: 120, paymentStatus: 'paid', createdAt: '2024-04-10T08:45' },
  { id: 'BK-2024-0002', userId: 'u5', lotId: 'l2', spotId: 'l2-P1B3', vehicleNo: 'KA02CD5678', startTime: '2024-04-10T10:00', endTime: '2024-04-10T14:00', status: 'confirmed', amount: 240, paymentStatus: 'paid', createdAt: '2024-04-10T09:30' },
  { id: 'BK-2024-0003', userId: 'u4', lotId: 'l3', spotId: 'l3-G12', vehicleNo: 'KA03EF9012', startTime: '2024-04-11T08:00', endTime: '2024-04-11T10:00', status: 'confirmed', amount: 60, paymentStatus: 'paid', createdAt: '2024-04-10T20:00' },
  { id: 'BK-2024-0004', userId: 'u5', lotId: 'l1', spotId: 'l1-B7', vehicleNo: 'KA01AB1234', startTime: '2024-04-09T14:00', endTime: '2024-04-09T18:00', status: 'completed', amount: 160, paymentStatus: 'paid', createdAt: '2024-04-09T13:45' },
  { id: 'BK-2024-0005', userId: 'u4', lotId: 'l4', spotId: 'l4-T2A9', vehicleNo: 'KA05GH3456', startTime: '2024-04-12T06:00', endTime: '2024-04-12T22:00', status: 'confirmed', amount: 1280, paymentStatus: 'paid', createdAt: '2024-04-10T18:00' },
  { id: 'BK-2024-0006', userId: 'u5', lotId: 'l2', spotId: 'l2-P2C5', vehicleNo: 'KA02CD5678', startTime: '2024-04-08T09:00', endTime: '2024-04-08T11:00', status: 'cancelled', amount: 120, paymentStatus: 'failed', createdAt: '2024-04-08T08:30' },
];

export const SESSIONS = [
  { id: 'S001', vehicleNo: 'KA01AB1234', lotId: 'l1', spotId: 'l1-A5', entryTime: '2024-04-10T22:10', exitTime: null, status: 'active', guardId: 'u3', amount: null },
  { id: 'S002', vehicleNo: 'MH02XY9988', lotId: 'l2', spotId: 'l2-P1A2', entryTime: '2024-04-10T21:55', exitTime: null, status: 'active', guardId: 'u3', amount: null },
  { id: 'S003', vehicleNo: 'DL3CAF7654', lotId: 'l3', spotId: 'l3-G5', entryTime: '2024-04-10T20:30', exitTime: '2024-04-10T22:00', status: 'closed', guardId: 'u3', amount: 45 },
  { id: 'S004', vehicleNo: 'KA51B2222', lotId: 'l1', spotId: 'l1-C11', entryTime: '2024-04-10T19:00', exitTime: '2024-04-10T21:30', status: 'closed', guardId: 'u3', amount: 100 },
];

export const PAYMENTS = [
  { id: 'PAY-001', bookingId: 'BK-2024-0001', userId: 'u4', amount: 120, method: 'UPI', status: 'success', createdAt: '2024-04-10T08:47', txnId: 'TXN82736472' },
  { id: 'PAY-002', bookingId: 'BK-2024-0002', userId: 'u5', amount: 240, method: 'Card', status: 'success', createdAt: '2024-04-10T09:32', txnId: 'TXN93746283' },
  { id: 'PAY-003', bookingId: 'BK-2024-0003', userId: 'u4', amount: 60, method: 'UPI', status: 'success', createdAt: '2024-04-10T20:02', txnId: 'TXN11827364' },
  { id: 'PAY-004', bookingId: 'BK-2024-0004', userId: 'u5', amount: 160, method: 'Card', status: 'success', createdAt: '2024-04-09T13:47', txnId: 'TXN22836475' },
  { id: 'PAY-005', bookingId: 'BK-2024-0005', userId: 'u4', amount: 1280, method: 'Net Banking', status: 'success', createdAt: '2024-04-10T18:03', txnId: 'TXN33847586' },
  { id: 'PAY-006', bookingId: 'BK-2024-0006', userId: 'u5', amount: 120, method: 'Card', status: 'failed', createdAt: '2024-04-08T08:32', txnId: 'TXN44856697' },
];

export const ACTIVITY_FEED = [
  { id: 1, type: 'entry', text: 'MH02XY9988 entered Nexus Mall Parking – Zone A', time: '2 min ago' },
  { id: 2, type: 'booking', text: 'New booking BK-2024-0005 confirmed for Airport Express Hub', time: '5 min ago' },
  { id: 3, type: 'payment', text: '₹240 payment received for BK-2024-0002 via Card', time: '12 min ago' },
  { id: 4, type: 'exit', text: 'DL3CAF7654 exited City Centre Plaza – ₹45 charged', time: '20 min ago' },
  { id: 5, type: 'entry', text: 'KA51B2222 entered Nexus Mall Parking – Zone C', time: '25 min ago' },
  { id: 6, type: 'alert', text: 'Spot A12 marked for maintenance at Tech Park Tower', time: '32 min ago' },
  { id: 7, type: 'booking', text: 'New booking BK-2024-0003 confirmed for City Centre Plaza', time: '40 min ago' },
  { id: 8, type: 'exit', text: 'KA51B2222 exited Nexus Mall Parking – ₹100 charged', time: '1h ago' },
];

export const REVENUE_CHART = [
  { day: 'Mon', revenue: 8200, bookings: 42 },
  { day: 'Tue', revenue: 9400, bookings: 51 },
  { day: 'Wed', revenue: 7800, bookings: 38 },
  { day: 'Thu', revenue: 11200, bookings: 62 },
  { day: 'Fri', revenue: 14600, bookings: 80 },
  { day: 'Sat', revenue: 18900, bookings: 105 },
  { day: 'Sun', revenue: 16400, bookings: 91 },
];

export const MONTHLY_REVENUE = [
  { month: 'Nov', revenue: 285000 },
  { month: 'Dec', revenue: 312000 },
  { month: 'Jan', revenue: 298000 },
  { month: 'Feb', revenue: 334000 },
  { month: 'Mar', revenue: 356000 },
  { month: 'Apr', revenue: 189000 },
];

export const OCCUPANCY_TREND = [
  { hour: '06:00', nexus: 22, techpark: 18, city: 35, airport: 45 },
  { hour: '08:00', nexus: 68, techpark: 75, city: 52, airport: 62 },
  { hour: '10:00', nexus: 82, techpark: 90, city: 64, airport: 58 },
  { hour: '12:00', nexus: 76, techpark: 88, city: 79, airport: 72 },
  { hour: '14:00', nexus: 70, techpark: 85, city: 68, airport: 68 },
  { hour: '16:00', nexus: 85, techpark: 78, city: 72, airport: 75 },
  { hour: '18:00', nexus: 92, techpark: 60, city: 88, airport: 80 },
  { hour: '20:00', nexus: 78, techpark: 30, city: 72, airport: 70 },
  { hour: '22:00', nexus: 45, techpark: 15, city: 40, airport: 55 },
];

export const NOTIFICATIONS_DATA = [
  { id: 'n1', type: 'booking', title: 'New Booking Confirmed', desc: 'BK-2024-0005 confirmed for Airport Express Hub – ₹1,280', time: '5 min ago', read: false },
  { id: 'n2', type: 'payment', title: 'Payment Received', desc: '₹240 received for booking BK-2024-0002 via Card', time: '12 min ago', read: false },
  { id: 'n3', type: 'alert', title: 'Spot Maintenance Alert', desc: 'Spot A12 at Tech Park Tower marked for maintenance', time: '32 min ago', read: false },
  { id: 'n4', type: 'entry', title: 'Vehicle Entry Logged', desc: 'MH02XY9988 entered Nexus Mall Parking Zone A', time: '1h ago', read: true },
  { id: 'n5', type: 'exit', title: 'Vehicle Exited', desc: 'DL3CAF7654 exited City Centre Plaza – ₹45 charged', time: '2h ago', read: true },
  { id: 'n6', type: 'booking', title: 'Booking Cancelled', desc: 'BK-2024-0006 was cancelled by driver Saurav Patel', time: '4h ago', read: true },
];

export const getDashboardStats = (spots) => {
  const total = spots.length;
  const occupied = spots.filter(s => s.status === 'occupied').length;
  const available = spots.filter(s => s.status === 'available').length;
  const reserved = spots.filter(s => s.status === 'reserved').length;
  const occupancyRate = Math.round((occupied / total) * 100);
  return { total, occupied, available, reserved, occupancyRate };
};
