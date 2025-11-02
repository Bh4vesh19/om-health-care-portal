import React, { useState, useEffect } from 'react';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initial sample orders - each has unique data
  const initialOrders = [
    {
      id: 'OM1001',
      customer: 'Raj Sharma',
      phone: '+91 98765 43210',
      items: [
        { name: 'Paracetamol 500mg', quantity: 10, price: 25 },
        { name: 'Vitamin C 1000mg', quantity: 1, price: 200 }
      ],
      total: 450,
      status: 'NEW',
      orderTime: new Date(Date.now() - 2 * 60000),
      address: '123 Main St, Mumbai',
      notes: ''
    },
    {
      id: 'OM1002', 
      customer: 'Priya Patel',
      phone: '+91 87654 32109',
      items: [
        { name: 'Crocin Advance', quantity: 15, price: 18.67 }
      ],
      total: 280,
      status: 'NEW',
      orderTime: new Date(Date.now() - 15 * 60000),
      address: '456 Park Ave, Delhi',
      notes: 'Customer requested quick delivery'
    },
    {
      id: 'OM1003',
      customer: 'Amit Kumar',
      phone: '+91 76543 21098',
      items: [
        { name: 'Aspirin 75mg', quantity: 30, price: 15 },
        { name: 'Multivitamin Capsules', quantity: 1, price: 350 }
      ],
      total: 800,
      status: 'NEW',
      orderTime: new Date(Date.now() - 45 * 60000),
      address: '789 Sector 15, Gurgaon',
      notes: ''
    }
  ];

  useEffect(() => {
    setOrders(initialOrders);
    
    // Simulate new order every 45 seconds
    const interval = setInterval(() => {
      addNewOrder();
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Calculate time ago
  const getTimeAgo = (orderTime) => {
    const diff = currentTime - orderTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Calculate estimated completion time
  const getEstimatedCompletion = (status, orderTime) => {
    const baseTime = orderTime.getTime();
    let estimatedTime = baseTime;
    
    switch(status) {
      case 'NEW':
        estimatedTime += 30 * 60000; // +30 minutes
        break;
      case 'PREPARING':
        estimatedTime += 15 * 60000; // +15 minutes
        break;
      case 'READY':
        estimatedTime += 5 * 60000; // +5 minutes
        break;
      default:
        return 'Completed';
    }
    
    const completionTime = new Date(estimatedTime);
    const now = new Date();
    
    if (completionTime < now) return 'Any moment';
    
    const diff = completionTime - now;
    const minutes = Math.ceil(diff / 60000);
    return `~${minutes}m`;
  };

  const addNewOrder = () => {
    const customers = ['Anjali Singh', 'Rohit Verma', 'Sneha Gupta', 'Karan Malhotra'];
    const medicines = [
      'Paracetamol 500mg', 'Ibuprofen 400mg', 'Cetirizine 10mg', 
      'Omeprazole 20mg', 'Amoxicillin 500mg', 'Vitamin B Complex'
    ];
    
    const newId = 'OM' + (1000 + orders.length + 1);
    const newOrderTime = new Date();
    
    const newOrder = {
      id: newId,
      customer: customers[Math.floor(Math.random() * customers.length)],
      phone: '+91 ' + Math.floor(9000000000 + Math.random() * 1000000000),
      items: [{
        name: medicines[Math.floor(Math.random() * medicines.length)],
        quantity: Math.floor(Math.random() * 5) + 1,
        price: Math.floor(Math.random() * 200) + 50
      }],
      total: 0,
      status: 'NEW',
      orderTime: newOrderTime,
      address: 'New Customer Address',
      notes: ''
    };
    
    newOrder.total = newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setOrders(prev => [newOrder, ...prev]);
    setNewOrderAlert(true);
    
    if (Notification.permission === 'granted') {
      new Notification('🆕 New Order Received!', {
        body: `Order #${newOrder.id} from ${newOrder.customer} - ₹${newOrder.total}`,
        icon: '/logo.png'
      });
    }
    
    setTimeout(() => setNewOrderAlert(false), 5000);
  };

  // FIXED: This function now correctly updates only the specific order
  const updateOrderStatus = (orderId, newStatus) => {
    console.log('Updating order:', orderId, 'to status:', newStatus);
    
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => {
        // Only update the order with matching ID
        if (order.id === orderId) {
          console.log('Found matching order, updating status');
          return {
            ...order,
            status: newStatus
          };
        }
        // Return other orders unchanged
        return order;
      });
      
      console.log('Updated orders:', updatedOrders);
      return updatedOrders;
    });
  };

  const addOrderNote = (orderId) => {
    const newNote = prompt('Add note for this order:', '');
    if (newNote) {
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, notes: newNote } : order
        )
      );
    }
  };

  const deleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(prev => prev.filter(order => order.id !== orderId));
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'NEW': 'danger',
      'PREPARING': 'warning', 
      'READY': 'info',
      'COMPLETED': 'success'
    };
    return `badge bg-${statusColors[status]}`;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'NEW': 'bi-bell-fill',
      'PREPARING': 'bi-clock-fill',
      'READY': 'bi-check-circle-fill',
      'COMPLETED': 'bi-bag-check-fill'
    };
    return icons[status];
  };

  // Filter orders based on search
  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone.includes(searchTerm)
  );

  // Calculate average preparation time
  const completedOrders = orders.filter(order => order.status === 'COMPLETED');
  const avgPreparationTime = completedOrders.length > 0 
    ? Math.round(completedOrders.reduce((sum, order) => {
        const prepTime = (currentTime - order.orderTime) / 60000;
        return sum + prepTime;
      }, 0) / completedOrders.length)
    : 0;

  return (
    <div className="container-fluid">
      {/* Header */}
      <nav className="navbar navbar-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center">
            <img 
              src="/logo.png" 
              alt="Om Health Care" 
              style={{ 
                height: '40px', 
                marginRight: '15px',
                filter: 'brightness(0) invert(1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <div style={{ fontSize: '1.2rem', lineHeight: '1.2' }}>Om Health Care</div>
              <small style={{ fontSize: '0.8rem', opacity: '0.9' }}>Live Order Management</small>
            </div>
          </span>
          
          <div className="d-flex align-items-center">
            <div className="input-group input-group-sm me-3" style={{ width: '250px' }}>
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="text-white text-end">
              <div style={{ fontSize: '0.9rem' }}>
                <i className="bi bi-clock me-1"></i>
                {currentTime.toLocaleTimeString()}
              </div>
              <small style={{ fontSize: '0.7rem', opacity: '0.8' }}>
                Live: {orders.filter(o => o.status !== 'COMPLETED').length} orders
              </small>
            </div>
          </div>
        </div>
      </nav>

      {/* New Order Alert */}
      {newOrderAlert && (
        <div className="alert alert-success alert-dismissible fade show m-3" role="alert">
          <i className="bi bi-bell-fill me-2"></i>
          <strong>New Order Received!</strong> Check the orders list below.
          <button type="button" className="btn-close" onClick={() => setNewOrderAlert(false)}></button>
        </div>
      )}

      {/* Orders Summary */}
      <div className="row m-3">
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card text-white bg-danger h-100">
            <div className="card-body text-center">
              <i className="bi bi-bell-fill display-6 mb-2"></i>
              <h3>{orders.filter(o => o.status === 'NEW').length}</h3>
              <h6>New Orders</h6>
              <small>Awaiting processing</small>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body text-center">
              <i className="bi bi-clock-fill display-6 mb-2"></i>
              <h3>{orders.filter(o => o.status === 'PREPARING').length}</h3>
              <h6>Preparing</h6>
              <small>In progress</small>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card text-white bg-info h-100">
            <div className="card-body text-center">
              <i className="bi bi-check-circle-fill display-6 mb-2"></i>
              <h3>{orders.filter(o => o.status === 'READY').length}</h3>
              <h6>Ready</h6>
              <small>For pickup</small>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body text-center">
              <i className="bi bi-bag-check-fill display-6 mb-2"></i>
              <h3>{orders.filter(o => o.status === 'COMPLETED').length}</h3>
              <h6>Completed</h6>
              <small>Today</small>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card text-white bg-secondary h-100">
            <div className="card-body text-center">
              <i className="bi bi-graph-up display-6 mb-2"></i>
              <h3>{avgPreparationTime}</h3>
              <h6>Avg Time</h6>
              <small>Minutes</small>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 mb-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body text-center">
              <i className="bi bi-lightning-fill display-6 mb-2"></i>
              <h3>{orders.length}</h3>
              <h6>Total</h6>
              <small>All orders</small>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="m-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            <i className="bi bi-list-ul me-2"></i>
            Live Orders
            <span className="badge bg-secondary ms-2">{filteredOrders.length}</span>
          </h4>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-dark btn-sm"
              onClick={addNewOrder}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Test New Order
            </button>
            <div className="text-muted small">
              <i className="bi bi-clock me-1"></i>
              Auto-refresh: On
            </div>
          </div>
        </div>

        <div className="row">
          {filteredOrders.map((order, index) => (
            <div key={order.id} className="col-xxl-4 col-lg-6 mb-4">
              <div className={`card shadow order-card ${index === 0 && order.status === 'NEW' ? 'new-order' : ''}`}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="me-2">#{order.id}</strong>
                    <span className={getStatusBadge(order.status)}>
                      <i className={`bi ${getStatusIcon(order.status)} me-1`}></i>
                      {order.status}
                    </span>
                  </div>
                  <small className="text-light">
                    <i className="bi bi-clock me-1"></i>
                    {getTimeAgo(order.orderTime)}
                  </small>
                </div>
                
                <div className="card-body">
                  {/* Customer Info */}
                  <div className="mb-3">
                    <h6 className="card-title mb-1">
                      <i className="bi bi-person me-2"></i>
                      {order.customer}
                    </h6>
                    <p className="card-text mb-1">
                      <i className="bi bi-telephone me-2"></i>
                      <small>{order.phone}</small>
                    </p>
                    <p className="card-text">
                      <i className="bi bi-geo-alt me-2"></i>
                      <small className="text-muted">{order.address}</small>
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-3">
                    <strong>
                      <i className="bi bi-cart me-2"></i>
                      Order Items:
                    </strong>
                    <div className="mt-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                          <span>{item.name}</span>
                          <span>
                            {item.quantity} × ₹{item.price} = 
                            <strong className="ms-1">₹{item.quantity * item.price}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timing Information */}
                  <div className="mb-3 p-2 bg-light rounded">
                    <div className="row text-center">
                      <div className="col-4">
                        <small className="text-muted">Ordered</small>
                        <div className="fw-bold">{order.orderTime.toLocaleTimeString()}</div>
                      </div>
                      <div className="col-4">
                        <small className="text-muted">Duration</small>
                        <div className="fw-bold">{getTimeAgo(order.orderTime)}</div>
                      </div>
                      <div className="col-4">
                        <small className="text-muted">Est. Complete</small>
                        <div className="fw-bold text-success">
                          {getEstimatedCompletion(order.status, order.orderTime)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <div className="mb-3 p-2 bg-light rounded">
                      <strong>
                        <i className="bi bi-sticky me-2"></i>
                        Notes:
                      </strong>
                      <div className="small text-muted mt-1">{order.notes}</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-dark">Total: ₹{order.total}</strong>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => addOrderNote(order.id)}
                        title="Add Note"
                      >
                        <i className="bi bi-sticky"></i>
                      </button>
                      
                      <select 
                        className="form-select form-select-sm"
                        style={{ width: '130px' }}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="NEW">New</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY">Ready</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                      
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteOrder(order.id)}
                        title="Delete Order"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-inbox display-1 text-muted"></i>
            <h4 className="text-muted mt-3">No orders found</h4>
            <p className="text-muted">No orders match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;