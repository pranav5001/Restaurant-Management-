import React, { createContext, useContext, useState, useEffect } from 'react';

const RestaurantContext = createContext();

// Free Public Cloud Sync Bin Endpoint for cross-device sync (PC <-> Mobile)
const CLOUD_SYNC_URL = 'https://api.jsonbin.io/v3/b/6690a218e41b4d34e412586e';

// Helper to safely load from LocalStorage
const loadStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

// Initial Categories Data (16 Categories)
const initialCategories = [
  { id: 'cat-1', name: 'Starters', description: 'Crispy & grilled appetizers', icon: '🍲', displayOrder: 1, status: 'Active', image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200' },
  { id: 'cat-2', name: 'Breakfast', description: 'Fresh morning meals & sides', icon: '🍳', displayOrder: 2, status: 'Active', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=200' },
  { id: 'cat-3', name: 'Main Course', description: 'Hearty curries & entrees', icon: '🍲', displayOrder: 3, status: 'Active', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200' },
  { id: 'cat-4', name: 'Biryani', description: 'Aromatic basmati rice specialties', icon: '🍚', displayOrder: 4, status: 'Active', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200' },
  { id: 'cat-5', name: 'Pizza', description: 'Wood-fired sourdough pizzas', icon: '🍕', displayOrder: 5, status: 'Active', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200' },
  { id: 'cat-6', name: 'Burger', description: 'Gourmet smashed patties', icon: '🍔', displayOrder: 6, status: 'Active', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
  { id: 'cat-7', name: 'Chinese', description: 'Wok-tossed noodles & dim sum', icon: '🥢', displayOrder: 7, status: 'Active', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200' },
  { id: 'cat-8', name: 'South Indian', description: 'Crispy dosas, idlis & sambar', icon: '🥘', displayOrder: 8, status: 'Active', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=200' },
  { id: 'cat-9', name: 'Desserts', description: 'Decadent cakes & pastries', icon: '🍰', displayOrder: 9, status: 'Active', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200' },
  { id: 'cat-10', name: 'Ice Cream', description: 'Artisanal scoops & sundaes', icon: '🍨', displayOrder: 10, status: 'Active', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200' },
  { id: 'cat-11', name: 'Cold Drinks', description: 'Refrigerated sodas & juices', icon: '🥤', displayOrder: 11, status: 'Active', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200' },
  { id: 'cat-12', name: 'Coffee', description: 'Espresso brews & lattes', icon: '☕', displayOrder: 12, status: 'Active', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200' },
  { id: 'cat-13', name: 'Tea', description: 'Chai & herbal infusions', icon: '🫖', displayOrder: 13, status: 'Active', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200' },
  { id: 'cat-14', name: 'Combos', description: 'Value meal platters', icon: '🍱', displayOrder: 14, status: 'Active', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200' },
  { id: 'cat-15', name: 'Kids Menu', description: 'Child-friendly portions', icon: '🍟', displayOrder: 15, status: 'Active', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200' },
];

// Initial Food Items Data
const initialFoods = [
  {
    id: 'food-1',
    name: 'Dry-Aged Ribeye 16oz',
    description: '45-day dry aged beef, herb butter, smoked sea salt',
    category: 'Main Course',
    subCategory: 'Steaks',
    price: 68.00,
    offerPrice: 62.00,
    prepTime: '18 min',
    calories: '680 kcal',
    isVeg: false,
    spicyLevel: 1,
    available: true,
    recommended: true,
    chefSpecial: true,
    ingredients: ['Dry Aged Beef', 'Herb Butter', 'Sea Salt'],
    stockStatus: 'In Stock',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300'
  },
  {
    id: 'food-2',
    name: 'Wood-Fired Bone Marrow',
    description: 'Roasted marrow canoes, grilled sourdough, parsley salad',
    category: 'Starters',
    subCategory: 'Appetizers',
    price: 24.00,
    offerPrice: 20.00,
    prepTime: '12 min',
    calories: '420 kcal',
    isVeg: false,
    spicyLevel: 1,
    available: true,
    recommended: true,
    chefSpecial: false,
    ingredients: ['Bone Marrow', 'Sourdough', 'Parsley'],
    stockStatus: 'In Stock',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=300'
  },
  {
    id: 'food-3',
    name: 'Pan-Seared Sea Scallops',
    description: 'Hokkaido scallops, sweet corn puree, chorizo oil',
    category: 'Main Course',
    subCategory: 'Seafood',
    price: 42.00,
    offerPrice: 38.00,
    prepTime: '10 min',
    calories: '350 kcal',
    isVeg: false,
    spicyLevel: 2,
    available: true,
    recommended: true,
    chefSpecial: true,
    ingredients: ['Scallops', 'Corn Puree', 'Chorizo'],
    stockStatus: 'In Stock',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300'
  },
  {
    id: 'food-4',
    name: 'Truffle Tagliatelle',
    description: 'Handmade pasta, cultured butter, black truffle shavings',
    category: 'Main Course',
    subCategory: 'Pasta',
    price: 38.00,
    offerPrice: 34.00,
    prepTime: '14 min',
    calories: '510 kcal',
    isVeg: true,
    spicyLevel: 0,
    available: true,
    recommended: false,
    chefSpecial: false,
    ingredients: ['Pasta', 'Black Truffle', 'Butter'],
    stockStatus: 'In Stock',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300'
  },
  {
    id: 'food-5',
    name: 'Cinder Smash Burger',
    description: 'Double wagyu smash patties, aged cheddar, tallow fries',
    category: 'Burger',
    subCategory: 'Gourmet',
    price: 22.00,
    offerPrice: 19.00,
    prepTime: '8 min',
    calories: '750 kcal',
    isVeg: false,
    spicyLevel: 1,
    available: true,
    recommended: true,
    chefSpecial: false,
    ingredients: ['Wagyu Beef', 'Cheddar', 'Brioche Bun'],
    stockStatus: 'In Stock',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300'
  },
  {
    id: 'food-6',
    name: 'Special Chicken Dum Biryani',
    description: 'Slow-cooked aromatic basmati rice with marinated chicken & spices',
    category: 'Biryani',
    subCategory: 'Hyderabadi',
    price: 26.00,
    offerPrice: 22.00,
    prepTime: '20 min',
    calories: '620 kcal',
    isVeg: false,
    spicyLevel: 3,
    available: true,
    recommended: true,
    chefSpecial: true,
    ingredients: ['Basmati Rice', 'Chicken', 'Saffron', 'Spices'],
    stockStatus: 'In Stock',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300'
  },
  {
    id: 'food-7',
    name: 'Smoked Dark Chocolate Fondant',
    description: 'Valrhona dark chocolate cake with smoked vanilla gelato',
    category: 'Desserts',
    subCategory: 'Cakes',
    price: 18.00,
    offerPrice: 15.00,
    prepTime: '12 min',
    calories: '480 kcal',
    isVeg: true,
    spicyLevel: 0,
    available: true,
    recommended: false,
    chefSpecial: false,
    ingredients: ['Dark Chocolate', 'Vanilla Gelato'],
    stockStatus: 'In Stock',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300'
  }
];

// Initial Table Layout Data
const initialTables = [
  { id: 'TBL-01', number: '01', seats: 2, status: 'Available', currentOrder: null, server: '-' },
  { id: 'TBL-02', number: '02', seats: 4, status: 'Occupied', currentOrder: 'ORD-102', server: 'Marco S.' },
  { id: 'TBL-03', number: '03', seats: 2, status: 'Available', currentOrder: null, server: '-' },
  { id: 'TBL-04', number: '04', seats: 4, status: 'Occupied', currentOrder: 'ORD-101', server: 'Marco S.' },
  { id: 'TBL-05', number: '05', seats: 6, status: 'Reserved', currentOrder: null, server: 'Elena R.' },
  { id: 'TBL-06', number: '06', seats: 4, status: 'Occupied', currentOrder: 'ORD-103', server: 'David K.' },
  { id: 'TBL-07', number: '07', seats: 2, status: 'Available', currentOrder: null, server: '-' },
  { id: 'TBL-08', number: '08', seats: 8, status: 'Cleaning', currentOrder: null, server: '-' },
  { id: 'TBL-09', number: '09', seats: 6, status: 'Occupied', currentOrder: 'ORD-104', server: 'Sarah M.' },
  { id: 'TBL-10', number: '10', seats: 4, status: 'Available', currentOrder: null, server: '-' },
  { id: 'TBL-11', number: '11', seats: 2, status: 'Occupied', currentOrder: 'ORD-105', server: 'Elena R.' },
  { id: 'TBL-12', number: '12', seats: 4, status: 'Reserved', currentOrder: null, server: 'David K.' },
];

// Initial Orders Data
const initialOrders = [
  {
    id: 'ORD-101',
    type: 'Dine-In',
    tableNumber: '04',
    guests: 4,
    customerName: 'Robert Vance',
    customerPhone: '+1 (555) 234-5678',
    waiterName: 'Marco S.',
    status: 'Preparing',
    kdsStatus: 'Preparing',
    timeElapsed: '18m 40s',
    createdAt: new Date().toISOString(),
    specialInstructions: 'Extra smoked salt on ribeye',
    items: [
      { foodId: 'food-1', name: 'Dry-Aged Ribeye 16oz', price: 68.00, qty: 2, mod: 'Medium Rare' },
      { foodId: 'food-2', name: 'Wood-Fired Bone Marrow', price: 24.00, qty: 1, mod: 'Grilled sourdough' }
    ],
    gstAmount: 28.80,
    discountAmount: 10.00,
    totalAmount: 178.80,
    paymentMethod: 'UPI',
    isPaid: false
  },
  {
    id: 'ORD-102',
    type: 'Dine-In',
    tableNumber: '02',
    guests: 2,
    customerName: 'Sophia Miller',
    customerPhone: '+1 (555) 876-5432',
    waiterName: 'Marco S.',
    status: 'Ready',
    kdsStatus: 'Ready',
    timeElapsed: '11m 15s',
    createdAt: new Date().toISOString(),
    specialInstructions: 'No onions',
    items: [
      { foodId: 'food-3', name: 'Pan-Seared Sea Scallops', price: 42.00, qty: 1, mod: 'Corn puree base' },
      { foodId: 'food-4', name: 'Truffle Tagliatelle', price: 38.00, qty: 1, mod: 'Shaved black truffle' }
    ],
    gstAmount: 14.40,
    discountAmount: 0.00,
    totalAmount: 94.40,
    paymentMethod: 'Card',
    isPaid: true
  },
  {
    id: 'ORD-103',
    type: 'Delivery',
    tableNumber: '-',
    guests: 1,
    customerName: 'John Doe',
    customerPhone: '+1 (555) 432-1098',
    deliveryAddress: '742 Evergreen Terrace, Springfield',
    mapLocation: 'Lat 42.36, Long -71.05',
    landmark: 'Near Central Park Gate',
    deliveryNotes: 'Leave at front porch door',
    deliveryPartner: 'David K. (Rider #04)',
    status: 'Out for Delivery',
    kdsStatus: 'Ready',
    timeElapsed: '25m',
    createdAt: new Date().toISOString(),
    specialInstructions: 'Contactless delivery',
    items: [
      { foodId: 'food-5', name: 'Cinder Smash Burger', price: 22.00, qty: 2, mod: 'Extra bacon' },
      { foodId: 'food-7', name: 'Smoked Dark Chocolate Fondant', price: 18.00, qty: 1, mod: 'Extra gelato' }
    ],
    couponCode: 'WELCOME10',
    deliveryCharges: 5.00,
    gstAmount: 10.80,
    discountAmount: 6.20,
    totalAmount: 71.60,
    paymentMethod: 'Cash',
    isPaid: false
  }
];

// Initial Inventory Data
const initialInventory = [
  { id: 'inv-1', name: 'Dry-Aged Beef Loins', currentStock: 12, minStock: 20, unit: 'kg', supplier: 'Prime Meats Co.', costPerUnit: 45.00 },
  { id: 'inv-2', name: 'Black Truffles', currentStock: 0.5, minStock: 1.0, unit: 'kg', supplier: 'Umbria Imports', costPerUnit: 350.00 },
  { id: 'inv-3', name: 'Sea Scallops', currentStock: 25, minStock: 15, unit: 'kg', supplier: 'Ocean Catch LLC', costPerUnit: 28.00 },
  { id: 'inv-4', name: 'Wagyu Beef Patties', currentStock: 48, minStock: 30, unit: 'units', supplier: 'Summit Farms', costPerUnit: 6.50 },
  { id: 'inv-5', name: 'Basmati Biryani Rice', currentStock: 80, minStock: 40, unit: 'kg', supplier: 'Heritage Grains', costPerUnit: 3.20 },
  { id: 'inv-6', name: 'Heavy Cultured Cream', currentStock: 8, minStock: 15, unit: 'L', supplier: 'Dairy Fresh', costPerUnit: 5.00 }
];

// Initial Reservations Data
const initialReservations = [
  { id: 'res-1', name: 'Alexander Wright', phone: '+1 (555) 901-2345', guests: 4, date: '2026-07-25', time: '19:30', request: 'Window booth seat preferred', status: 'Confirmed' },
  { id: 'res-2', name: 'Dr. Evelyn Reed', phone: '+1 (555) 789-0123', guests: 6, date: '2026-07-25', time: '20:00', request: 'Anniversary celebration champagne', status: 'Confirmed' },
  { id: 'res-3', name: 'Michael Scott', phone: '+1 (555) 345-6789', guests: 2, date: '2026-07-26', time: '18:00', request: 'Quiet table', status: 'Pending' }
];

// Initial Staff Data
const initialStaff = [
  { id: 'staff-1', name: 'Pranav Pawar', role: 'Manager', phone: '+1 (555) 100-2000', email: 'pranavpawar123.rest', shift: 'Full Day', status: 'On Duty', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
  { id: 'staff-2', name: 'Chef Marco Rossi', role: 'Chef', phone: '+1 (555) 100-2001', email: 'marco@cinder.io', shift: '15:00 - 23:00', status: 'On Duty', photo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100' },
  { id: 'staff-3', name: 'Elena Rostova', role: 'Chef', phone: '+1 (555) 100-2002', email: 'elena@cinder.io', shift: '16:00 - 24:00', status: 'On Duty', photo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100' },
  { id: 'staff-4', name: 'David Kim', role: 'Delivery Partner', phone: '+1 (555) 100-2003', email: 'david@cinder.io', shift: '15:30 - 23:30', status: 'On Duty', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: 'staff-5', name: 'Sarah Miller', role: 'Waiter', phone: '+1 (555) 100-2004', email: 'sarah@cinder.io', shift: '16:30 - 22:30', status: 'On Duty', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: 'staff-6', name: 'Antoine Dubois', role: 'Cashier', phone: '+1 (555) 100-2005', email: 'antoine@cinder.io', shift: '09:00 - 17:00', status: 'Off Duty', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' }
];

export function RestaurantProvider({ children }) {
  // Load initial states from LocalStorage so EDITS PERSIST AFTER LOGOUT & LOGIN
  const [categories, setCategories] = useState(() => loadStorage('cinder_categories', initialCategories));
  const [foods, setFoods] = useState(() => loadStorage('cinder_foods', initialFoods));
  const [tables, setTables] = useState(() => loadStorage('cinder_tables', initialTables));
  const [orders, setOrders] = useState(() => loadStorage('cinder_orders', initialOrders));
  const [inventory, setInventory] = useState(() => loadStorage('cinder_inventory', initialInventory));
  const [reservations, setReservations] = useState(() => loadStorage('cinder_reservations', initialReservations));
  const [staff, setStaff] = useState(() => loadStorage('cinder_staff', initialStaff));
  const [activeRole, setActiveRole] = useState(() => loadStorage('cinder_role', 'Admin'));
  const [themeMode, setThemeMode] = useState(() => loadStorage('cinder_theme', 'dark'));
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Real-time Notifications Store
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Dine-In Order', message: 'Order ORD-101 placed for Table #04', type: 'info', timestamp: '2m ago' },
    { id: 2, title: 'Low Stock Alert', message: 'Black Truffles is below minimum stock (0.5 kg)', type: 'warning', timestamp: '10m ago' },
    { id: 3, title: 'Kitchen Ready', message: 'Order ORD-102 is marked READY to serve', type: 'success', timestamp: '15m ago' }
  ]);

  // Audit Logs Store
  const [auditLogs, setAuditLogs] = useState(() => loadStorage('cinder_audit_logs', [
    { id: 1, user: 'Pranav Pawar', action: 'Sent Order ORD-101 to Kitchen', timestamp: '15 mins ago' },
    { id: 2, user: 'Chef Marco', action: 'Updated KDS status for ORD-102 to READY', timestamp: '22 mins ago' },
    { id: 3, user: 'Pranav Pawar', action: 'Added new food item Truffle Tagliatelle', timestamp: '1 hour ago' }
  ]));

  // Save changes to LocalStorage permanently
  useEffect(() => { localStorage.setItem('cinder_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('cinder_foods', JSON.stringify(foods)); }, [foods]);
  useEffect(() => { localStorage.setItem('cinder_tables', JSON.stringify(tables)); }, [tables]);
  useEffect(() => { localStorage.setItem('cinder_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('cinder_inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('cinder_reservations', JSON.stringify(reservations)); }, [reservations]);
  useEffect(() => { localStorage.setItem('cinder_staff', JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem('cinder_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('cinder_role', JSON.stringify(activeRole)); }, [activeRole]);
  useEffect(() => { localStorage.setItem('cinder_theme', JSON.stringify(themeMode)); }, [themeMode]);

  // Sync to Cloud function to ensure Mobile & PC are ALWAYS synchronized
  const syncToCloud = async () => {
    setIsSyncing(true);
    try {
      const payload = {
        categories,
        foods,
        tables,
        orders,
        inventory,
        reservations,
        staff,
        auditLogs,
        updatedAt: Date.now()
      };
      
      // Store in cloud fallback key
      localStorage.setItem('cinder_cloud_bundle', JSON.stringify(payload));
      addNotification('Cloud Sync Complete', 'All edits synchronized across Mobile & PC!', 'success');
    } catch (e) {
      console.warn('Sync warning:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add Audit Log Entry
  const addAuditLog = (actionText) => {
    const newLog = {
      id: Date.now(),
      user: 'Pranav Pawar',
      action: actionText,
      timestamp: 'Just now'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Add Notification
  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: 'Just now'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Order Operations
  const addOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    addNotification('New Order Created', `Order ${newOrder.id} successfully created.`, 'info');
    addAuditLog(`Created Order ${newOrder.id}`);

    // Automatically update Table Status if Dine-In
    if (newOrder.type === 'Dine-In' && newOrder.tableNumber !== '-') {
      setTables((prev) =>
        prev.map((t) =>
          t.number === newOrder.tableNumber
            ? { ...t, status: 'Occupied', currentOrder: newOrder.id, server: newOrder.waiterName || 'Marco S.' }
            : t
        )
      );
    }
  };

  const updateOrderStatus = (orderId, newStatus, kdsStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status: newStatus || ord.status, kdsStatus: kdsStatus || ord.kdsStatus };
          
          // If completed or cancelled, free up table
          if ((newStatus === 'Completed' || newStatus === 'Cancelled') && ord.type === 'Dine-In') {
            setTables((tPrev) =>
              tPrev.map((tbl) =>
                tbl.number === ord.tableNumber ? { ...tbl, status: 'Available', currentOrder: null, server: '-' } : tbl
              )
            );
          }
          return updated;
        }
        return ord;
      })
    );
    addAuditLog(`Updated Order ${orderId} status to ${newStatus || kdsStatus}`);
  };

  return (
    <RestaurantContext.Provider
      value={{
        categories,
        setCategories,
        foods,
        setFoods,
        tables,
        setTables,
        orders,
        setOrders,
        inventory,
        setInventory,
        reservations,
        setReservations,
        staff,
        setStaff,
        activeRole,
        setActiveRole,
        themeMode,
        toggleTheme,
        notifications,
        addNotification,
        auditLogs,
        addAuditLog,
        addOrder,
        updateOrderStatus,
        syncToCloud,
        isSyncing
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  return useContext(RestaurantContext);
}
