import React, { useState, useEffect } from 'react';
import { Car, MapPin, Navigation, Info, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://3sxl7nrx-3000.inc1.devtunnels.ms';

const TransportBooking = ({ deviceId, userProfile }) => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, [deviceId]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/booking/${deviceId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error('Failed to fetch bookings:', e);
    }
  };

  const handleBook = async (e) => {
    if (e) e.preventDefault();
    if (!pickup || !destination) return;

    setIsBooking(true);
    try {
      const response = await fetch(`${API_URL}/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: deviceId,
          pickupLocation: pickup,
          destination: destination,
          disabilityType: userProfile?.disabilityType || 'Not specified',
          specialInstructions: `User has ${userProfile?.disabilityType || 'specific'} needs.`
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setPickup('');
        setDestination('');
        fetchBookings();
      }
    } catch (e) {
      console.error('Booking failed:', e);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest">
          <Car size={14} fill="currentColor" /> Transport Services
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Accessible Rides</h2>
        <p className="text-xl font-medium text-slate-500 leading-relaxed max-w-2xl">
          Book a specialized transport mechanism. Your driver will be notified of your condition to provide the best care.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Booking Form */}
        <section className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-indigo-700 p-8 text-white">
            <h3 className="text-xl font-black uppercase tracking-tight">Request a Ride</h3>
            <p className="text-indigo-100 text-sm font-medium">Safe, reliable, and accessible.</p>
          </div>
          
          <form onSubmit={handleBook} className="p-10 space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pickup Location</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={20}/></div>
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Where are you now?"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Navigation size={20}/></div>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where are you going?"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-3xl flex items-start gap-4">
              <Info className="text-amber-600 shrink-0 mt-1" size={24} />
              <div>
                <p className="font-black text-amber-900 uppercase text-xs tracking-widest mb-1">Driver Alert Active</p>
                <p className="text-sm font-bold text-amber-800 leading-relaxed">
                  We will automatically inform the driver that you have <span className="underline decoration-2 underline-offset-2">{userProfile?.disabilityType || 'specific'}</span> needs.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isBooking || !pickup || !destination}
              className={`w-full py-6 rounded-2xl font-black text-xl uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 ${
                isBooking 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200'
              }`}
            >
              {isBooking ? 'Requesting...' : 'Book Ride'}
              {!isBooking && <ChevronRight size={24} />}
            </button>
          </form>
        </section>

        {/* Recent Bookings Sidebar */}
        <section className="lg:col-span-5 space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] px-4 flex items-center gap-2">
            <Clock size={16} /> Recent Requests
          </h3>
          
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center">
                <p className="font-bold text-slate-300">No recent rides found.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-200/30 flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Car size={28} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 uppercase text-xs tracking-widest truncate max-w-[150px]">To: {booking.destination}</p>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">From: {booking.pickupLocation}</p>
                      <div className="mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-300 uppercase">Date</p>
                    <p className="text-xs font-black text-slate-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TransportBooking;
