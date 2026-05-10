import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2, Calendar, MonitorSmartphone, Clock, ChevronRight } from 'lucide-react';

export default function BookingSuccessPage() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="w-full max-w-xl text-center mx-auto animate-slide-up">
        <div className="w-20 h-20 mx-auto mb-8 bg-[#00f5d4]/10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.2)]">
          <CheckCircle2 className="w-10 h-10 text-[#00f5d4]" strokeWidth={2} />
        </div>
        
        <h1 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.03em] text-white leading-tight mb-4">
          Booking Confirmed.
        </h1>
        
        <p className="text-[19px] text-white/65 mb-10 max-w-md mx-auto">
          Your repair request has been successfully scheduled. We'll send you an email confirmation shortly.
        </p>

        <div className="ds-card rounded-[32px] p-6 sm:p-8 text-left mb-10">
          <h2 className="text-[17px] font-semibold text-white mb-6">Booking Details</h2>
          
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <MonitorSmartphone className="w-5 h-5 text-[#7a5cff] mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-[13px] text-white/40 font-medium mb-1 uppercase tracking-wider">Device</p>
                <p className="text-[15px] font-medium text-white">{booking.deviceBrand} {booking.deviceModel}</p>
                <p className="text-[14px] text-white/60 mt-0.5">{booking.problemTitle}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-[#7a5cff] mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-[13px] text-white/40 font-medium mb-1 uppercase tracking-wider">Drop-off Date</p>
                <p className="text-[15px] font-medium text-white">
                  {new Date(booking.preferredDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-[#7a5cff] mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-[13px] text-white/40 font-medium mb-1 uppercase tracking-wider">Time Slot</p>
                <p className="text-[15px] font-medium text-white">{booking.timeSlotDetails?.startTime} - {booking.timeSlotDetails?.endTime}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/account/bookings"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#7a5cff] text-white rounded-full text-[15px] font-bold hover:bg-[#8c72ff] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(122,92,255,0.25)] hover:shadow-[0_0_25px_rgba(122,92,255,0.4)]"
          >
            Track Booking
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 text-white rounded-full text-[15px] font-bold hover:bg-white/10 transition-all text-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
