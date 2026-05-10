import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2, Calendar, MonitorSmartphone, Clock, ChevronRight } from 'lucide-react';

export default function BookingSuccessPage() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] flex flex-col items-center justify-center pt-20 pb-24 px-4">
      <div className="w-full max-w-xl text-center animate-slide-up">
        <div className="w-20 h-20 mx-auto mb-8 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" strokeWidth={2} />
        </div>
        
        <h1 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.03em] text-[#1D1D1F] leading-tight mb-4">
          Booking Confirmed.
        </h1>
        
        <p className="text-[19px] text-[#86868B] mb-10 max-w-md mx-auto">
          Your repair request has been successfully scheduled. We'll send you an email confirmation shortly.
        </p>

        <div className="bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 text-left mb-10 border border-[#E8E8ED]">
          <h2 className="text-[17px] font-semibold text-[#1D1D1F] mb-6">Booking Details</h2>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <MonitorSmartphone className="w-5 h-5 text-[#86868B] mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] text-[#86868B] font-medium mb-1 uppercase tracking-wider">Device</p>
                <p className="text-[15px] font-medium text-[#1D1D1F]">{booking.deviceBrand} {booking.deviceModel}</p>
                <p className="text-[14px] text-[#86868B] mt-0.5">{booking.problemTitle}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-[#86868B] mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] text-[#86868B] font-medium mb-1 uppercase tracking-wider">Drop-off Date</p>
                <p className="text-[15px] font-medium text-[#1D1D1F]">
                  {new Date(booking.preferredDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#86868B] mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] text-[#86868B] font-medium mb-1 uppercase tracking-wider">Time Slot</p>
                <p className="text-[15px] font-medium text-[#1D1D1F]">{booking.timeSlotDetails?.startTime} - {booking.timeSlotDetails?.endTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/account/bookings"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0071E3] text-white rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-all flex items-center justify-center gap-2"
          >
            Track Booking
            <ChevronRight className="w-4 h-4" strokeWidth={2} />
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#F5F5F7] text-[#1D1D1F] rounded-full text-[15px] font-medium hover:bg-[#E8E8ED] transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
